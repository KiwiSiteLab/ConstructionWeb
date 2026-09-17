# Validation

Checked locally on 2026-09-17.

- Production static build and local link/asset/fragment checker pass.
- JavaScript syntax check passes.
- In-app Chromium browser rendered desktop at 1280px and mobile at 390px. Also checked 320px layout width; no document horizontal overflow at any of these widths.
- Why choose us is the first content section after the hero/service strip. The mobile menu links to it and closes after navigation.
- Service expansion switched from New builds to Renovations and updated the image and copy while collapsing the other service.
- Gallery opened a full, uncropped image, advanced to the next photo, handled the left arrow and Escape, and returned focus to the triggering thumbnail.
- Browser's system reduced-motion preference was enabled. Default static review presentation was verified. Explicit Play enabled the review animation; the computed transform changed between observations, and Pause returned the animation to paused.
- Browser console had no warning or error entries during the recorded checks.
- Phone and SMS destinations were checked in source; no real call or message was placed.

Scope: desktop Chromium with mobile-sized viewports, not physical iPhone/Android testing. GitHub upload is source delivery, not a production hosting or custom-domain verification. Real client photographs/reviews, company credentials and email remain owner-supplied content.
