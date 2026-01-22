# Task Manager

A modern, lightweight task management application built with React 19 and Vite, featuring persistent local storage, comprehensive CRUD operations, and a clean, modular architecture using CSS Modules.

## Description

Task Manager is a fully client-side React application that allows users to create, read, update, and delete tasks with real-time filtering capabilities. The application leverages React 19's latest features, uses CSS Modules for scoped styling, and implements localStorage for data persistence, ensuring your tasks remain available across browser sessions without requiring a backend server.

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn package manager

### Installation

1. Clone the repository or navigate to the project directory:
   ```bash
   cd final-project-react-todo
   ```

2. Install project dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to the URL displayed in the terminal (typically `http://localhost:5173`)

### Running Tests

To execute the unit test suite using Vitest:

```bash
npm test
```

For a single test run (non-watch mode):

```bash
npm run test:run
```

To view test results in a UI:

```bash
npm run test:ui
```

To generate test coverage reports:

```bash
npm run test:coverage
```

## Component Architecture

The application follows a modular, component-based architecture where each component has a single, well-defined responsibility:

- **App**: Manages the global task state, handles all CRUD operations, implements localStorage persistence, and coordinates data flow between child components.
- **TaskInput**: Provides a form interface for users to input new task titles, validates input, and triggers task creation via callback.
- **TaskList**: Renders a list of task items and displays an empty state message when no tasks are present.
- **TaskItem**: Displays an individual task with inline editing capabilities, handles task completion toggling, and manages delete operations for a single task.
- **TaskFilters**: Renders filter buttons (All, Active, Completed), displays the active task count, and provides a "Clear Completed" action button.

## Key Features

### CRUD Operations
- **Create**: Add new tasks with automatic input validation and whitespace trimming
- **Read**: View all tasks with real-time filtering options
- **Update**: Edit task titles inline with keyboard shortcuts (Enter to save, Escape to cancel)
- **Delete**: Remove individual tasks or clear all completed tasks at once

### Filtering System
- Filter tasks by status: All, Active, or Completed
- Visual indication of the active filter with CSS Module conditional classes
- Real-time task count display showing remaining active tasks

### State Persistence
- Automatic synchronization with browser localStorage on every state change
- Tasks persist across browser sessions and page refreshes
- Graceful error handling for localStorage operations

### Technical Stack
- **React 19**: Latest React features with functional components and hooks
- **Vite**: Fast build tool and development server with HMR
- **CSS Modules**: Scoped styling for maintainable, collision-free CSS
- **Vitest**: Fast unit testing framework with React Testing Library integration

## Testing Status

The application includes a comprehensive unit testing suite implemented with Vitest and React Testing Library. Tests focus on user interactions rather than simple rendering, ensuring that all critical user flows are validated.

### Test Coverage

- **TaskInput Component**: Tests for form submission, input validation, whitespace trimming, and keyboard interactions
- **TaskItem Component**: Tests for delete functionality, checkbox toggling, visual state changes, and edit mode transitions

### Interpreting Test Results

- All tests should pass without errors when running `npm test`
- Test failures indicate a regression in component behavior
- The test suite uses mocking to isolate component logic from external dependencies (e.g., localStorage)
- Each test simulates real user interactions (typing, clicking, keyboard events) to validate component behavior

## Known Limitations & Bugs

1. **Local Storage Only**: Data is stored exclusively in the browser's localStorage and does not sync across devices or browsers. Clearing browser data will result in permanent data loss.

2. **No User Authentication**: The application does not support multiple users or user accounts. All tasks are stored locally and are accessible to anyone using the same browser.

3. **Limited Task Metadata**: Tasks are limited to basic text input without support for priority levels, due dates, categories, or attachments.

4. **No Undo/Redo Functionality**: Deleted tasks cannot be recovered, and there is no history of changes or undo capability.

5. **Browser Storage Quota**: localStorage has size limitations (typically 5-10MB per domain), which may become a constraint for users with thousands of tasks.

6. **No Data Export/Import**: There is currently no feature to export tasks to a file or import tasks from external sources.

## Project Structure

```
src/
├── components/
│   ├── TaskInput/
│   │   ├── TaskInput.jsx
│   │   ├── TaskInput.module.css
│   │   └── TaskInput.test.jsx
│   ├── TaskList/
│   │   ├── TaskList.jsx
│   │   └── TaskList.module.css
│   ├── TaskItem/
│   │   ├── TaskItem.jsx
│   │   ├── TaskItem.module.css
│   │   └── TaskItem.test.jsx
│   └── TaskFilters/
│       ├── TaskFilters.jsx
│       └── TaskFilters.module.css
├── test/
│   └── setupTests.js
├── App.jsx
├── App.module.css
├── main.jsx
└── index.css
```

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run preview` - Preview the production build locally
- `npm test` - Run tests in watch mode
- `npm run test:run` - Run tests once
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Generate test coverage report
- `npm run lint` - Run ESLint to check code quality

## License

This project is created for educational purposes.
