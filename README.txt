# Weekly Teaching & Personal Planner

A **Progressive Web App (PWA)** to help teachers or anyone organize their weekly activities, lesson planning, and personal tasks. The app allows you to **add, edit, delete, and track activities**, prevents scheduling conflicts, and keeps a **history of past activities**.

---

## Features

- Add activities with **title, day, date, start time, and end time**.
- Prevents scheduling conflicts within the same day/time.
- Edit or delete any activity.
- Weekly overview of all current activities.
- Automatic **history section** for past activities.
- Works offline as a PWA once installed.
- Can be installed on desktop or mobile as a standalone app.

---

## Installation

### Option 1: Using GitHub Pages

1. Clone or download this repository.
2. Go to **Settings → Pages** and enable GitHub Pages (source: `main` branch, folder: `/`).
3. Open the provided URL in your phone or desktop browser.
4. Add the app to your home screen (Chrome/Edge: menu → "Add to Home screen").

### Option 2: Local testing on your computer

1. Open the folder in **VS Code**.
2. Install the **Live Server** extension.
3. Right-click `index.html` → **Open with Live Server**.
4. The app will open in your browser at `http://127.0.0.1:5500/`.
5. On your phone, use your computer's local IP to access the app over Wi-Fi.

---

## How to Use

1. Fill in the form with:
   - **Activity title**
   - **Day of the week**
   - **Date**
   - **Start time**
   - **End time**
2. Click **Add / Save Activity** to add it to your weekly planner.
3. All current activities appear under **Weekly Overview**.
4. Use the **Edit** button to modify an activity.
5. Use the **Delete** button to remove an activity.
6. Past activities automatically move to the **History** section.
7. Your activities are saved locally in your browser and persist offline.

---

## Notes

- The app uses **localStorage**, so data is saved on the device/browser where it was added.
- Offline use is supported via the service worker (`service-worker.js`).
- For multi-device syncing, a backend like Firebase would be required.

---

## Files in this Repository

