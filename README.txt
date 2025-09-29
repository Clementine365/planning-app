
Educational Planning System - README / Quick Training

QUICK START
1. Open index.html in a browser (desktop or mobile). For mobile add to Home Screen (PWA).
2. Click a day in the 'Week Overview' to edit lesson prep, grading notes, and personal tasks.
3. Use Templates to save and quickly apply lesson plan skeletons.
4. Export data using "Export JSON". Import by copying JSON into localStorage key 'eps_data' (advanced).

PILOT INSTRUCTIONS (1 month)
- Week 1: Populate recurring lessons and templates. Use daily and add personal tasks.
- Week 2-3: Track time spent and note conflicts; adjust templates.
- Week 4: Collect feedback -> produce case study.

ARTIFACTS INCLUDED
- index.html, styles.css, app.js, manifest.json, service-worker.js, README.txt

NOTES ABOUT EXTENDING TO A PHONE APP
- This project is PWA-ready: the manifest + service worker let users "install" it.
- To turn it into a native app consider wrapping with Capacitor or Cordova, or building a React Native front-end connected to a backend.
