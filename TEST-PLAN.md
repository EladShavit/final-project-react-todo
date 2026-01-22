# TEST-PLAN.md

## Overview
This document outlines the testing strategy for enhancing the Task Manager application with a "Clear Completed" feature verification and implementing a comprehensive unit testing suite using Vitest and React Testing Library.

---

## Task 1: Functional Update Verification ("Clear Completed")

### Current Status
✅ **Already Implemented**: The "Clear Completed" feature is already present in `TaskFilters.jsx` (lines 36-43) and `App.jsx` (lines 70-72).

### Verification Checklist
- [ ] **Button Visibility/State**: Verify the "Clear completed" button is disabled when `completedCount === 0`
- [ ] **Button Functionality**: Verify clicking the button removes all tasks with `completed: true`
- [ ] **Styling**: Verify the button uses CSS Modules (`styles.clearButton`) and is properly styled
- [ ] **Integration**: Verify the button is correctly wired to `handleClearCompleted` in App.jsx

### Implementation Details to Verify
- Location: `src/components/TaskFilters/TaskFilters.jsx`
- Button is conditionally disabled: `disabled={completedCount === 0}`
- Handler: `onClearCompleted` prop passed from App.jsx
- Logic: `handleClearCompleted` filters out all tasks where `completed === true`

### Manual Testing Steps
1. Add 3 tasks: "Task 1", "Task 2", "Task 3"
2. Mark "Task 1" and "Task 3" as completed
3. Verify "Clear completed" button is enabled
4. Click "Clear completed"
5. Verify only "Task 2" remains (the active task)
6. Verify button becomes disabled after clearing

---

## Task 2: Unit Testing Setup

### Step 2.1: Install Dependencies

**Required packages:**
```bash
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

**Package breakdown:**
- `vitest`: Test runner (Vite-native, fast)
- `@testing-library/react`: React component testing utilities
- `@testing-library/jest-dom`: Custom DOM matchers (`.toBeInTheDocument()`, `.toHaveClass()`, etc.)
- `@testing-library/user-event`: Simulate user interactions (typing, clicking)
- `jsdom`: DOM environment for Node.js (simulates browser)

### Step 2.2: Create Vitest Configuration

**File:** `vitest.config.js` (or `vitest.config.mjs`)

**Configuration requirements:**
- Use Vite's React plugin
- Set environment to `jsdom`
- Configure test file patterns (`**/*.{test,spec}.{js,jsx,ts,tsx}`)
- Set up path aliases if needed
- Configure coverage if desired

**Key settings:**
```javascript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setupTests.js',
  },
})
```

### Step 2.3: Create Test Setup File

**File:** `src/test/setupTests.js` (or `src/setupTests.js`)

**Purpose:**
- Import `@testing-library/jest-dom` matchers
- Configure global test utilities
- Set up cleanup after each test (React Testing Library does this automatically, but we can add custom cleanup)
- Mock localStorage if needed globally

**Content structure:**
```javascript
import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

// Auto-cleanup after each test
afterEach(() => {
  cleanup()
})

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
global.localStorage = localStorageMock
```

### Step 2.4: Update package.json Scripts

**Add test scripts:**
```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage"
  }
}
```

### Step 2.5: Verify Setup

**Test command:**
```bash
npm test
```

**Expected result:** Vitest starts in watch mode (or runs once if using `vitest run`)

---

## Task 3: Meaningful Unit Tests

### Testing Philosophy
- ✅ **No simple rendering tests**: Every test must simulate user interaction
- ✅ **Assert state changes or function calls**: Verify behavior, not just presence
- ✅ **Mock parent callbacks**: Use `vi.fn()` for all props that are functions
- ✅ **Mock localStorage**: Prevent test failures from localStorage operations

---

### Component 1: TaskInput Tests

**File:** `src/components/TaskInput/TaskInput.test.jsx`

#### Test Case 1: Add Task via Button Click
**Objective:** Verify that typing a task and clicking "Add" clears the input and triggers `onAddTask` with the correct string.

**Steps:**
1. Render `TaskInput` with mocked `onAddTask` prop
2. Find the input field using `getByPlaceholderText` or `getByRole`
3. Type a task title (e.g., "Buy groceries")
4. Find and click the "Add" button
5. Assertions:
   - `onAddTask` was called exactly once
   - `onAddTask` was called with the trimmed string (e.g., "Buy groceries")
   - Input field value is cleared (empty string)

**Test structure:**
```javascript
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TaskInput } from './TaskInput'

describe('TaskInput', () => {
  it('should clear input and call onAddTask when Add button is clicked', async () => {
    const mockOnAddTask = vi.fn()
    const user = userEvent.setup()
    
    render(<TaskInput onAddTask={mockOnAddTask} />)
    
    const input = screen.getByPlaceholderText(/add a new task/i)
    const addButton = screen.getByRole('button', { name: /add/i })
    
    await user.type(input, 'Buy groceries')
    await user.click(addButton)
    
    expect(mockOnAddTask).toHaveBeenCalledTimes(1)
    expect(mockOnAddTask).toHaveBeenCalledWith('Buy groceries')
    expect(input).toHaveValue('')
  })
})
```

#### Test Case 2: Add Task via Enter Key
**Objective:** Verify that pressing Enter submits the form and triggers `onAddTask`.

**Steps:**
1. Render `TaskInput` with mocked `onAddTask`
2. Type a task title
3. Press Enter key in the input field
4. Assertions:
   - `onAddTask` was called with the correct string
   - Input is cleared

#### Test Case 3: Prevent Empty Submission
**Objective:** Verify that empty or whitespace-only input doesn't trigger `onAddTask`.

**Steps:**
1. Render `TaskInput`
2. Try to submit with empty input (click button or press Enter)
3. Assertions:
   - `onAddTask` was not called
   - Button is disabled when input is empty/whitespace

#### Test Case 4: Trim Whitespace
**Objective:** Verify that leading/trailing whitespace is trimmed before calling `onAddTask`.

**Steps:**
1. Type "  Buy groceries  " (with spaces)
2. Submit
3. Assertions:
   - `onAddTask` was called with "Buy groceries" (trimmed)

---

### Component 2: TaskItem Tests

**File:** `src/components/TaskItem/TaskItem.test.jsx`

#### Test Case 1: Delete Button Functionality
**Objective:** Verify that clicking the "Delete" button triggers the correct deletion function.

**Steps:**
1. Create a mock task object: `{ id: '1', title: 'Test Task', completed: false, createdAt: Date.now() }`
2. Render `TaskItem` with mocked `onDelete` prop
3. Find the "Delete" button (use `getByRole('button', { name: /delete/i })` or `getByLabelText`)
4. Click the Delete button
5. Assertions:
   - `onDelete` was called exactly once
   - `onDelete` was called with the task's `id`

**Test structure:**
```javascript
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TaskItem } from './TaskItem'

describe('TaskItem', () => {
  const mockTask = {
    id: 'test-id-123',
    title: 'Test Task',
    completed: false,
    createdAt: Date.now(),
  }

  it('should call onDelete with task id when Delete button is clicked', async () => {
    const mockOnDelete = vi.fn()
    const mockOnToggle = vi.fn()
    const mockOnSaveTitle = vi.fn()
    const user = userEvent.setup()
    
    render(
      <TaskItem
        task={mockTask}
        onDelete={mockOnDelete}
        onToggle={mockOnToggle}
        onSaveTitle={mockOnSaveTitle}
      />
    )
    
    const deleteButton = screen.getByRole('button', { name: /delete/i })
    await user.click(deleteButton)
    
    expect(mockOnDelete).toHaveBeenCalledTimes(1)
    expect(mockOnDelete).toHaveBeenCalledWith('test-id-123')
  })
})
```

#### Test Case 2: Checkbox Toggle Functionality
**Objective:** Verify that clicking the checkbox correctly switches the visual state (completed class).

**Steps:**
1. Render `TaskItem` with `completed: false`
2. Find the checkbox input
3. Verify the checkbox is unchecked
4. Verify the title span does NOT have the `completed` CSS class
5. Click the checkbox
6. Assertions:
   - `onToggle` was called with the task's `id`
   - (Note: Visual state change requires re-rendering with updated prop, so we test the callback)

**Advanced assertion (if re-rendering with updated task):**
```javascript
// Re-render with completed: true
const completedTask = { ...mockTask, completed: true }
rerender(
  <TaskItem
    task={completedTask}
    onToggle={mockOnToggle}
    onDelete={mockOnDelete}
    onSaveTitle={mockOnSaveTitle}
  />
)

const titleSpan = screen.getByText('Test Task')
expect(titleSpan).toHaveClass(styles.completed) // Requires importing styles
```

#### Test Case 3: Checkbox Toggle Callback
**Objective:** Verify that clicking the checkbox calls `onToggle` with the correct task ID.

**Steps:**
1. Render `TaskItem` with mocked `onToggle`
2. Find the checkbox (use `getByRole('checkbox')` or `getByLabelText`)
3. Click the checkbox
4. Assertions:
   - `onToggle` was called exactly once
   - `onToggle` was called with the task's `id`

#### Test Case 4: Edit Mode Toggle (Bonus)
**Objective:** Verify that clicking "Edit" enters edit mode and shows the input field.

**Steps:**
1. Render `TaskItem`
2. Click the "Edit" button
3. Assertions:
   - Edit input field is visible
   - Input field has the task title as value
   - "Save" button is visible (replaces "Edit")

---

## Testing Best Practices

### Mocking Strategy

**1. Mock Functions:**
```javascript
const mockHandler = vi.fn()
```

**2. Mock localStorage:**
```javascript
// In setupTests.js or individual test files
beforeEach(() => {
  vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(null)
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {})
})
```

**3. Mock crypto.randomUUID (if used):**
```javascript
vi.stubGlobal('crypto', {
  randomUUID: () => 'mock-uuid-123',
})
```

### Query Strategies (Priority Order)
1. **Accessible queries first:**
   - `getByRole` (button, textbox, checkbox)
   - `getByLabelText`
   - `getByText`
2. **Fallback queries:**
   - `getByPlaceholderText`
   - `getByTestId` (last resort)

### Assertion Patterns

**Function calls:**
```javascript
expect(mockFn).toHaveBeenCalledTimes(1)
expect(mockFn).toHaveBeenCalledWith(expectedArg)
expect(mockFn).not.toHaveBeenCalled()
```

**DOM state:**
```javascript
expect(element).toBeInTheDocument()
expect(element).toHaveValue('expected')
expect(element).toHaveClass('className')
expect(element).toBeDisabled()
expect(element).toBeEnabled()
```

**User interactions:**
```javascript
await user.click(button)
await user.type(input, 'text')
await user.keyboard('{Enter}')
```

---

## File Structure After Implementation

```
src/
├── components/
│   ├── TaskInput/
│   │   ├── TaskInput.jsx
│   │   ├── TaskInput.module.css
│   │   └── TaskInput.test.jsx          ← NEW
│   ├── TaskItem/
│   │   ├── TaskItem.jsx
│   │   ├── TaskItem.module.css
│   │   └── TaskItem.test.jsx           ← NEW
│   ├── TaskList/
│   │   ├── TaskList.jsx
│   │   └── TaskList.module.css
│   └── TaskFilters/
│       ├── TaskFilters.jsx
│       └── TaskFilters.module.css
├── test/
│   └── setupTests.js                   ← NEW
├── App.jsx
├── App.module.css
├── main.jsx
└── index.css
├── vitest.config.js                    ← NEW
└── package.json                         ← UPDATED
```

---

## Execution Checklist

### Phase 1: Setup
- [ ] Install all required dependencies
- [ ] Create `vitest.config.js`
- [ ] Create `src/test/setupTests.js`
- [ ] Update `package.json` scripts
- [ ] Run `npm test` to verify setup works

### Phase 2: TaskInput Tests
- [ ] Create `TaskInput.test.jsx`
- [ ] Implement "Add via button click" test
- [ ] Implement "Add via Enter key" test
- [ ] Implement "Prevent empty submission" test
- [ ] Implement "Trim whitespace" test
- [ ] Run tests: `npm test TaskInput`
- [ ] Verify all tests pass

### Phase 3: TaskItem Tests
- [ ] Create `TaskItem.test.jsx`
- [ ] Implement "Delete button" test
- [ ] Implement "Checkbox toggle callback" test
- [ ] Implement "Checkbox visual state" test (if applicable)
- [ ] Run tests: `npm test TaskItem`
- [ ] Verify all tests pass

### Phase 4: Verification
- [ ] Run full test suite: `npm test`
- [ ] Verify "Clear Completed" feature works manually
- [ ] Check test coverage (if configured): `npm run test:coverage`
- [ ] Review test output for any warnings or errors

---

## Expected Test Results

After implementation, running `npm test` should show:

```
✓ src/components/TaskInput/TaskInput.test.jsx (4 tests)
  ✓ should clear input and call onAddTask when Add button is clicked
  ✓ should call onAddTask when Enter key is pressed
  ✓ should not call onAddTask for empty input
  ✓ should trim whitespace before calling onAddTask

✓ src/components/TaskItem/TaskItem.test.jsx (3 tests)
  ✓ should call onDelete with task id when Delete button is clicked
  ✓ should call onToggle with task id when checkbox is clicked
  ✓ should apply completed class when task is completed

Test Files  2 passed (2)
     Tests  7 passed (7)
```

---

## Notes

- **CSS Modules in tests**: To test CSS class names, you may need to import the styles object and check for the class name string (e.g., `styles.completed`).
- **Async user events**: Always use `await` with `userEvent` methods as they return promises.
- **Cleanup**: React Testing Library automatically cleans up after each test, but ensure any mocks are reset in `beforeEach` or `afterEach`.
- **localStorage mocking**: Since App.jsx uses localStorage, ensure tests that render App (if any) mock localStorage properly.

---

## Success Criteria

✅ All tests pass without errors  
✅ Tests simulate real user interactions (no simple render tests)  
✅ All callbacks are properly mocked and asserted  
✅ localStorage is mocked to prevent test failures  
✅ Test coverage demonstrates meaningful assertions  
✅ "Clear Completed" feature is verified to work correctly
