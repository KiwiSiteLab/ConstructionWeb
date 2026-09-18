$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$projectRoot = Split-Path $PSScriptRoot -Parent
$imageRoot = Join-Path $projectRoot 'public/images'
$outputRoot = Join-Path $imageRoot 'projects'
New-Item -ItemType Directory -Force $outputRoot | Out-Null
$groups = @(
  @{ Folder='BrandNew House'; Key='new-builds'; Title='New builds'; Description='New homes, from site progress to exterior finishes.' },
  @{ Folder='Framework'; Key='framework'; Title='Structural framework'; Description='The timber structure behind the finished spaces.' },
  @{ Folder='Aluminum alloy exterior wall'; Key='aluminium'; Title='Aluminium exterior cladding'; Description='Clean profiles and carefully detailed exterior junctions.' },
  @{ Folder='Interior decoration'; Key='interiors'; Title='Interior renovations'; Description='Bathroom finishes, fixtures and the details of everyday living.' },
  @{ Folder='Deck'; Key='decks'; Title='Decks & outdoor living'; Description='Timber terraces, sheltered decks and garden connections.' },
  @{ Folder='Decoration And recladding'; Key='recladding'; Title='Renovation & recladding'; Description='A closer look at the exterior work, before and after.' }
)
$jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object MimeType -eq 'image/jpeg'
$encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
$encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]88)
$photos = @()
foreach ($group in $groups) {
  $sequence = 0
  foreach ($file in (Get-ChildItem -LiteralPath (Join-Path $imageRoot $group.Folder) -File | Sort-Object Name)) {
    $sequence++
    $image = [System.Drawing.Image]::FromFile($file.FullName)
    # Respect camera orientation. No cosmetic edits: only orientation and web-size encoding.
    if ($image.PropertyIdList -contains 274) {
      $orientation = [BitConverter]::ToUInt16($image.GetPropertyItem(274).Value,0)
      switch ($orientation) {
        2 { $image.RotateFlip([System.Drawing.RotateFlipType]::RotateNoneFlipX) }
        3 { $image.RotateFlip([System.Drawing.RotateFlipType]::Rotate180FlipNone) }
        4 { $image.RotateFlip([System.Drawing.RotateFlipType]::Rotate180FlipX) }
        5 { $image.RotateFlip([System.Drawing.RotateFlipType]::Rotate90FlipX) }
        6 { $image.RotateFlip([System.Drawing.RotateFlipType]::Rotate90FlipNone) }
        7 { $image.RotateFlip([System.Drawing.RotateFlipType]::Rotate270FlipX) }
        8 { $image.RotateFlip([System.Drawing.RotateFlipType]::Rotate270FlipNone) }
      }
    }
    $stem = $group.Key + '-' + $sequence.ToString('00')
    $record = [ordered]@{ id=$stem; category=$group.Key; title=$group.Title; source=('images/'+$group.Folder+'/'+$file.Name); file=('projects/'+$stem+'.jpg'); thumb=('projects/'+$stem+'-thumb.jpg'); width=$image.Width; height=$image.Height; stage=''; pair=0 }
    if($file.BaseName -match '(?i)^(before|befoe|after)(\d+)') { $record.stage=if($Matches[1] -eq 'after'){'After'}else{'Before'}; $record.pair=[int]$Matches[2] }
    foreach($variant in @(@{Size=1800;Suffix=''},@{Size=720;Suffix='-thumb'})) {
      $scale = [Math]::Min(1.0, $variant.Size/[double][Math]::Max($image.Width,$image.Height))
      $width=[int][Math]::Round($image.Width*$scale); $height=[int][Math]::Round($image.Height*$scale)
      $bitmap=New-Object System.Drawing.Bitmap($width,$height)
      $graphics=[System.Drawing.Graphics]::FromImage($bitmap)
      $graphics.InterpolationMode=[System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
      $graphics.DrawImage($image,0,0,$width,$height)
      $bitmap.Save((Join-Path $outputRoot ($stem+$variant.Suffix+'.jpg')),$jpegCodec,$encoderParams)
      $graphics.Dispose(); $bitmap.Dispose()
      if($variant.Suffix -eq '') { $record.width=$width; $record.height=$height }
    }
    $image.Dispose(); $photos += $record
  }
}
Copy-Item -LiteralPath (Join-Path $imageRoot 'logo/微信图片_20260918235958.jpg') -Destination (Join-Path $outputRoot 'bcito.jpg')
Copy-Item -LiteralPath (Join-Path $imageRoot 'logo/微信图片_20260919000010.jpg') -Destination (Join-Path $outputRoot 'lbp.jpg')
$manifest = @{groups=$groups;photos=$photos} | ConvertTo-Json -Depth 5
[IO.File]::WriteAllText((Join-Path $projectRoot '.qa/photo-manifest.json'),$manifest,[Text.UTF8Encoding]::new($false))
Write-Output ('Prepared '+$photos.Count+' project photos, two sizes each. Originals unchanged.')

