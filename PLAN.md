# Task Manager (React 19 + Vite + CSS Modules) — Implementation Plan

## Goals & Constraints
- **React 19**, functional components only.
- **Vite** build setup (already present).
- **CSS Modules only** for component styling; avoid global CSS except `index.css` (reset + variables).
- **State** via native hooks only: `useState`, `useEffect`.
- **Persistence** via `localStorage` (load on init, save on every change).
- **Architecture**: folder-per-component with `Component.jsx` + `Component.module.css`.
- **Data flow**: strict **Props down, Events up** (no cross-component state).
- **Features**: CRUD (create/read/update inline/delete), filtering (All/Active/Completed), active filter highlighting, remaining count, clear completed, responsive polished UI.

---

## Step-by-step execution plan (in order)

### 1) Baseline assessment & cleanup
- Review current files (`src/App.jsx`, `src/App.css`, `src/index.css`, `src/main.jsx`) to understand starter wiring.
- Decide what stays global:
  - Keep `src/index.css` for **reset + CSS variables + base typography** only.
  - Remove/stop using global `src/App.css` once CSS Modules are in place.

### 2) Define the target folder structure
- Create `src/components/` and implement a folder per component:
  - `src/components/TaskInput/TaskInput.jsx` + `TaskInput.module.css`
  - `src/components/TaskList/TaskList.jsx` + `TaskList.module.css`
  - `src/components/TaskItem/TaskItem.jsx` + `TaskItem.module.css`
  - `src/components/TaskFilters/TaskFilters.jsx` + `TaskFilters.module.css`
- Convert root to CSS Modules:
  - `src/App.jsx` + `src/App.module.css` (replace `src/App.css` usage).

### 3) Data model and state ownership (App is the single source of truth)
- Define a **task shape** (kept consistent everywhere):
  - `id` (string)
  - `title` (string)
  - `completed` (boolean)
  - `createdAt` (number timestamp) for stable ordering (optional but helpful)
- Define `filter` enum:
  - `"all" | "active" | "completed"`
- App state:
  - `tasks` (array)
  - `filter` (string)
- Derived values in `App`:
  - `activeCount`
  - `completedCount`
  - `filteredTasks`

### 4) localStorage persistence strategy
- Choose a single key name (e.g., `"taskManager.tasks.v1"`).
- Implement:
  - **Load** tasks on initial mount (`useEffect` with empty deps or lazy initializer for `useState`).
  - **Save** tasks on every tasks change (`useEffect([tasks])`).
- Add robust parsing:
  - Guard against invalid JSON / unexpected shapes; fall back to empty list.

### 5) Component contracts (Props down, Events up)
- `TaskInput`
  - Props: `onAddTask(title)`
  - Local state: input value, basic validation (trim + ignore empty).
- `TaskList`
  - Props: `tasks`, `onToggle(id)`, `onDelete(id)`, `onStartEdit(id)` (optional), `onSaveEdit(id, nextTitle)`, `onCancelEdit(id)` (optional)
  - Responsibility: render a list container and map tasks to `TaskItem`.
- `TaskItem`
  - Props: `task`, `onToggle(id)`, `onDelete(id)`, `onSave(id, nextTitle)`
  - Local UI state: `isEditing`, `draftTitle`
  - Inline edit behaviors:
    - Enter saves, Escape cancels, blur saves or cancels (define consistent rule).
    - Empty title after trim should revert or prevent save (define rule).
- `TaskFilters`
  - Props: `filter`, `activeCount`, `onChangeFilter(nextFilter)`, `onClearCompleted()`, `hasCompleted` (or `completedCount`)
  - Responsibility: filter buttons with **conditional active class** and remaining count.

### 6) Implement CRUD logic in App (pure operations)
- Add:
  - `addTask(title)` → prepend/append with new `id`
  - `toggleTask(id)` → flip `completed`
  - `deleteTask(id)` → remove
  - `updateTaskTitle(id, nextTitle)` → update title
  - `clearCompleted()` → remove completed tasks
- Keep these operations immutable and predictable.

### 7) Implement filtering (derived, not stored)
- Compute `filteredTasks` from `tasks` + `filter` in `App`.
- Pass `filteredTasks` into `TaskList`.
- In `TaskFilters`, highlight active filter with CSS Modules:
  - Example concept: `className={filter === "active" ? styles.active : ""}` (actual code later).

### 8) Styling plan (CSS Modules + responsive UI)
- Establish global variables in `src/index.css`:
  - Colors, spacing scale, radius, font stack.
- `App.module.css`:
  - Page layout: centered container, max width, padding, responsive behavior.
  - Header/title styling.
- `TaskInput.module.css`:
  - Input + button alignment, focus styles, disabled states.
- `TaskList.module.css`:
  - List spacing, empty state styling.
- `TaskItem.module.css`:
  - `.taskItem`, `.completed`, `.title`, `.editInput`, action buttons, hover/focus states.
- `TaskFilters.module.css`:
  - Filter button group, `.active` state, counter, and clear-completed button styles.
- Ensure mobile-first responsiveness:
  - Stack controls on small screens, avoid overflow, ensure touch targets.

### 9) UX polish & edge cases
- Prevent adding empty/whitespace tasks.
- Preserve stable ordering (e.g., by `createdAt`).
- Inline edit:
  - Trim and prevent empty updates.
  - Keep keyboard interactions consistent and accessible.
- Disable “Clear Completed” when there are no completed tasks.
- Display a friendly empty state when no tasks exist (or when filter yields none).

### 10) Accessibility & semantics
- Use semantic elements and accessible labels:
  - `<button type="button">`, proper `aria-label` for icon-only buttons (if any).
  - Visible focus outlines (do not remove).
- Ensure checkbox/toggle is accessible (or use a semantic checkbox if appropriate).

### 11) Refactor & quality pass
- Ensure each component is focused and small.
- Keep handler names clear (`handleAddTask`, `handleToggleTask`, etc.).
- Avoid prop drilling beyond these components; `App` orchestrates, components render and emit events.

### 12) Verification checklist (manual)
- CRUD:
  - Add task, toggle complete, edit inline, delete.
- Filters:
  - All/Active/Completed correct behavior; active filter button highlights.
- Persistence:
  - Refresh page keeps tasks; clearing localStorage resets.
- Bonus:
  - Clear completed works; active count accurate.
- Responsive:
  - Mobile widths look clean; no layout breaks.

---

## Deliverables (files that will be created/updated)
- **Create**:
  - `src/App.module.css`
  - `src/components/TaskInput/TaskInput.jsx`
  - `src/components/TaskInput/TaskInput.module.css`
  - `src/components/TaskList/TaskList.jsx`
  - `src/components/TaskList/TaskList.module.css`
  - `src/components/TaskItem/TaskItem.jsx`
  - `src/components/TaskItem/TaskItem.module.css`
  - `src/components/TaskFilters/TaskFilters.jsx`
  - `src/components/TaskFilters/TaskFilters.module.css`
- **Update**:
  - `src/App.jsx` (root state + layout + wiring)
  - `src/main.jsx` (only if needed for CSS imports)
  - `src/index.css` (reset + variables only)
- **Deprecate/Remove**:
  - `src/App.css` (once `App.module.css` is used everywhere)

