# Client portfolio update, 2026-09-19

## Source and grouping

23 photos supplied by the customer in six folders under `public/images/`, plus two supplied qualification marks in `logo/`. The original files were not altered. Album labels describe work categories, not a claimed number of completed projects. Site progress images are not described as finished builds.

`scripts/prepare-photos.ps1` creates web JPEG copies at up to 1800 px and 720 px, respects EXIF orientation, and preserves the full composition. This is web delivery processing, not cosmetic retouching. `scripts/update-portfolio.mjs` consumes the generated manifest and creates the static portfolio markup and `portfolio-data.js`.

The existing four background/service stock-image files and the hero/background image markup were retained unchanged.

## Before / after

Pairs follow the provided filenames: `before1.jpg` with `After1.jpg`, and `Before2.jpg` with `After2.jpg`. Comparisons use the originals, labelled Before and After. Because camera angles differ, they are side-by-side rather than a falsely aligned overlay slider. Full uncropped views and the uploaded original files are available through the gallery.

## Optional clarity view

The softer `Decoration And recladding/Before2.jpg` has a separate, optional AI-assisted viewing copy at `public/images/projects/recladding-before-02-enhanced.jpg`. It is not the default comparison image. The gallery explicitly labels the enhancement and lets visitors return to the original. Fine reconstructed detail should not be used as evidence of site condition.

Tool: built-in imagegen. Original generated PNG is retained in the local `.qa/` folder; the site serves a JPEG copy. No API key was used.

Prompt used:

> Conservative photographic restoration of this exact original building-site photograph, for a factual construction before-and-after portfolio. ONLY gently improve softness/JPEG noise and neutral exposure/white balance. Retain identical framing, aspect ratio and camera angle. Preserve every existing weatherboard, nail, damaged area, unfinished patch, window, scaffold, bag, stain and texture. Do not repair the building, remove objects, add objects, invent architectural details, straighten perspective or beautify the site. It must remain the same BEFORE photo, with all defects intact. Subtle natural sharpness, no oversharpening, no artificial HDR. Output one faithful restored photograph.

## Credentials

The owner confirmed the team genuinely holds the relevant LBP/BCITO credentials and has permission to display the provided marks. Licence numbers were not supplied, so none are invented. The page distinguishes individual LBP licensing from trade qualifications/training and links to the official LBP register.
