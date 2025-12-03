# Daily Task Tracker – User Guide

Welcome to the **Daily Task Tracker** app! This guide explains everything you need to know to set up, use, and make the most of your to-do list, built with a modern Ocean Professional theme. The app runs entirely in your browser and all data is saved locally—no internet or server required!

---

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Setup & Running Instructions](#setup--running-instructions)
- [Environment Variables](#environment-variables)
- [Feature List](#feature-list)
- [Usage Guide](#usage-guide)
  - [Adding a Task](#adding-a-task)
  - [Editing a Task](#editing-a-task)
  - [Marking Complete or Incomplete](#marking-complete-or-incomplete)
  - [Deleting Tasks](#deleting-tasks)
  - [Using Filters](#using-filters)
  - [Searching Tasks](#searching-tasks)
  - [Theme Toggle (Light/Dark Mode)](#theme-toggle-lightdark-mode)
  - [Clearing Completed Tasks](#clearing-completed-tasks)
- [Accessibility & Keyboard Tips](#accessibility--keyboard-tips)
- [Troubleshooting & FAQs](#troubleshooting--faqs)

---

## Overview

**Daily Task Tracker** is a simple, fast, and elegant React-based to-do application. Organize daily tasks, keep focused, and enjoy a visually refined experience with the Ocean Professional theme—featuring blue and amber highlights, smooth gradients, and a modern interface.

All your tasks are stored **locally in your browser** via `localStorage`. No backend, server, or sign-in is required, and your data stays private to your device.

---

## Prerequisites

- **Node.js** (version 14+ recommended)
- **npm** (Node Package Manager, usually comes with Node.js)
- A modern web browser (Chrome, Firefox, Edge, Safari, etc.)

---

## Setup & Running Instructions

1. **Clone the repository** and navigate into the project:

    ```sh
    git clone <your-repo-url>
    cd daily-task-tracker-286556-286565/to_do_list_frontend
    ```

2. **Install dependencies:**

    ```sh
    npm install
    ```

3. **Start the app locally:**

    ```sh
    npm start
    ```

    - The app will launch in development mode and open at [http://localhost:3000](http://localhost:3000) by default.
    - **Note:** Any preview tools (e.g., hot reloads) are user-controlled—just refresh your browser to see updates.

4. **To build for production:**

    ```sh
    npm run build
    ```

    - Creates an optimized static build in the `build` directory.

5. **No backend or server setup required!** All data remains in your browser.

---

## Environment Variables

The app supports several environment variables if you want to customize the underlying React environment. **However, they are not required for normal usage** (the app will work without any configuration). Here is the full list, all optional:

| Variable Name                   | Purpose/Notes         |
|----------------------------------|----------------------|
| REACT_APP_API_BASE               | Optional, not used by default |
| REACT_APP_BACKEND_URL            | Optional, not used by default |
| REACT_APP_FRONTEND_URL           | Optional, not used by default |
| REACT_APP_WS_URL                 | Optional, not used by default |
| REACT_APP_NODE_ENV               | Standard React environment variable |
| REACT_APP_NEXT_TELEMETRY_DISABLED| Internal/react advanced use |
| REACT_APP_ENABLE_SOURCE_MAPS     | Controls source maps in development |
| REACT_APP_PORT                   | Change dev server port |
| REACT_APP_TRUST_PROXY            | Advanced deployments (not usually set) |
| REACT_APP_LOG_LEVEL              | Set logging verbosity if needed |
| REACT_APP_HEALTHCHECK_PATH       | For advanced health checks |
| REACT_APP_FEATURE_FLAGS          | Enable experimental features (if any) |
| REACT_APP_EXPERIMENTS_ENABLED    | Enable experiments     |

*You do not need to set any of these to use the app. If unfamiliar, you can safely ignore them.*

---

## Feature List

- **Add, Edit, and Delete Tasks**: Zero-setup task management.
- **Mark Tasks as Complete/Active**: Toggle status via checkbox.
- **Filters**: Show All, Active, or Completed tasks.
- **Search**: Instantly filter your list by typing part of a task or note.
- **Theme Toggle**: Switch between Light and Dark modes, with professional Ocean styling.
- **Persisted Data**: All tasks (and theme choice) are saved in your browser via localStorage. Data is loaded on refresh, even if you close your browser.
- **Clear Completed**: One click to remove all completed tasks.
- **Responsive Design**: Works on desktops, tablets, and phones.
- **Accessible UI**: Keyboard navigation and screen reader support for all users.

---

## Usage Guide

### Adding a Task

1. Locate the **"Add a Task"** card at the top.
2. Enter a **task name** (required). Optionally, add notes for context.
3. Click **Add task** or press **Enter** to submit.
4. Your new task appears at the top of the list.

### Editing a Task

1. Find your task in the **Tasks** list.
2. Click the **Edit** button next to the task.
3. Change the task’s name or notes.
4. Click **Save** or press **Enter** to save changes, or **Cancel** to discard.

### Marking Complete or Incomplete

- Click the **checkbox** next to a task to mark it as completed or revert to active. Completed tasks appear faded and struck-through.

### Deleting Tasks

- Click the **Delete** button on any task to permanently remove it.

### Using Filters

- Use the filter buttons (**All**, **Active**, **Completed**) to display a subset of your tasks.
  - **All** shows every task.
  - **Active** shows only incomplete tasks.
  - **Completed** shows only finished tasks.

### Searching Tasks

- Enter any text in the **Search by name or notes** box to instantly filter visible tasks.

### Theme Toggle (Light/Dark Mode)

- In the header, click the theme button (**🌙 Dark** for dark mode, **☀️ Light** for light mode) to switch themes.
- Your choice is remembered for future visits.

### Clearing Completed Tasks

- If there are finished tasks, click **Clear completed** to remove them from your list.

---

## Accessibility & Keyboard Tips

- **Navigate forms**: Use **Tab** and **Shift+Tab** to move between input fields and buttons.
- **Submit via keyboard**: Press **Enter** on text fields and forms to add or save tasks.
- **Edit mode**: When in editing, the title input is focused automatically for fast changes.
- **Screen readers**: The app structure uses landmark roles and aria-labels, making navigation friendly for screen readers.
- **Theme toggle, filters, and task actions**: All accessible via keyboard.

Pro tip: If you ever feel “lost,” press **Tab** and follow the live focus highlight!

---

## Troubleshooting & FAQs

### Common Issues

- **My data disappeared!**
  - Make sure you're using the same browser and device. Clearing browser storage (cache, cookies) will erase your tasks.
- **The app won’t launch**
  - Ensure Node.js and npm are correctly installed.
  - Run `npm install` in the `to_do_list_frontend` directory before starting.
- **Port conflict on startup**
  - If port 3000 is already in use, set a custom port with `REACT_APP_PORT=yourport npm start`.

### Frequently Asked Questions

**Q: Is my data private?**  
A: Yes! All tasks are saved in your browser with no data ever sent to a server.

**Q: Can I sync tasks between devices?**  
A: Not in this version; copy your tasks manually to another device if needed.

**Q: Is there a way to reset or clear all data?**  
A: You can delete all tasks one by one, clear completed, or reset your browser storage for a clean slate.

**Q: Does the app work offline?**  
A: Yes—once loaded, it works fully offline since all data and code are in your browser.

**Q: Do I need any account?**  
A: No account or login is required.

**Q: How do I get help or report issues?**  
A: Check this guide first. For further help, contact your administrator or project maintainer.

---

## Ocean Professional Theme

This application uses the **Ocean Professional** theme:

- **Primary:** Deep blue (`#2563EB`)
- **Accent:** Amber (`#F59E0B`)
- **Background:** Soft white & muted blue gradients
- **Surface:** Cards and forms use white/dark backgrounds with soft shadows and rounded corners
- **Accessibility:** All text meets recommended contrast for readability in both modes

For style customizations, check `src/App.css`.

---

Enjoy organizing your day with Daily Task Tracker!

