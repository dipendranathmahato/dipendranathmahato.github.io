# Website updates — October 25, 2026

This updated website package preserves the existing pages, course materials, assets and site design while making these changes:

1. **CV:** The “Download CV (PDF)” action on `cv.html` now points to the Google Drive URL supplied by the site owner. The local PDF at `assets/pdf/My_Curriculum_Vitae.pdf` has also been refreshed from the October 25, 2026 CV supplied with this task.
2. **All-time site visits:** `assets/js/site-template.js` adds a shared `hits.sh` counter badge to the sidebar of every page using the common site template. All pages use **one identifier**: `dipendranathmahato.com/all-pages`. A fresh request records each page load (including a course page) and displays the site-wide total. Browser caching is bypassed per page load. The counter is disabled on localhost and `file://` previews so test views are not counted. On local previews it shows “Displayed on the live website.”
3. **Outreach & Services:** The page now groups dated experiences under *Mentoring & STEM*, *Academic service* and *Community*. CV roles and dates have been updated, including ALTC through May 2026, both TWOPLES mentoring terms, Tulane and Tezpur service, AMS special sessions, and professional memberships. Community relief work not present in the supplied CV was preserved from the original page and clearly identified.
4. **Blogs:** Added a clearly labeled **coming soon** placeholder for “Mathematics & Artificial Intelligence.” No article or publication date is invented.
5. **Presentations:** Added the poster “Introduction to Rational Symbolic Powers” at CIMPA School PASCA 2.0, CIMAT, Guanajuato (May 18–29, 2026) with the supplied Google Drive poster link.
6. **Resources:** Removed the preview buttons, iframe preview modal and associated preview JavaScript. Every resource now has a single **Open link** action opening its original site in a new tab; search remains active.

## Important notes about visit counting

- GitHub Pages is static and cannot store a shared count on its own. The public badge at `https://hits.sh/dipendranathmahato.com/all-pages.svg` stores and displays counts on a third-party service. Please review the provider's policy before going live.
- This is a **page-view** counter, not an estimate of distinct human visitors. Browsers blocking third-party images and service outages may lead to missing visits.
- Because the previous CounterAPI widget failed, no verifiable earlier counter value was available for migration. The new Hits counter therefore begins accumulating from its own initial count, and does **not** reconstruct historical visits.
- To see the working counter, deploy this package to the real domain and visit a few different pages. GitHub Pages may require a hard refresh to clear previously cached JavaScript.
- Verify the Google Drive files are shared with **Anyone with the link** if they should be accessible to all site visitors.

## Deploy

Replace the corresponding files in your GitHub Pages repository with the contents of this package and commit/push to the branch used for Pages deployment. Keep the folder tree unchanged.
