import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TaskItem } from './TaskItem'
import styles from './TaskItem.module.css'

describe('TaskItem', () => {
  const mockTask = {
    id: 'test-id-123',
    title: 'Test Task',
    completed: false,
    createdAt: Date.now(),
  }

  let mockOnDelete
  let mockOnToggle
  let mockOnSaveTitle

  beforeEach(() => {
    mockOnDelete = vi.fn()
    mockOnToggle = vi.fn()
    mockOnSaveTitle = vi.fn()
  })

  it('should call onDelete with task id when Delete button is clicked', async () => {
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

  it('should call onToggle with task id when checkbox is clicked', async () => {
    const user = userEvent.setup()

    render(
      <TaskItem
        task={mockTask}
        onDelete={mockOnDelete}
        onToggle={mockOnToggle}
        onSaveTitle={mockOnSaveTitle}
      />
    )

    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).not.toBeChecked()

    await user.click(checkbox)

    expect(mockOnToggle).toHaveBeenCalledTimes(1)
    expect(mockOnToggle).toHaveBeenCalledWith('test-id-123')
  })

  it('should apply completed class when task is completed', () => {
    const completedTask = { ...mockTask, completed: true }

    const { rerender } = render(
      <TaskItem
        task={mockTask}
        onDelete={mockOnDelete}
        onToggle={mockOnToggle}
        onSaveTitle={mockOnSaveTitle}
      />
    )

    // Initially, task is not completed
    const titleSpan = screen.getByText('Test Task')
    expect(titleSpan).not.toHaveClass(styles.completed)

    // Re-render with completed task
    rerender(
      <TaskItem
        task={completedTask}
        onDelete={mockOnDelete}
        onToggle={mockOnToggle}
        onSaveTitle={mockOnSaveTitle}
      />
    )

    // Now it should have the completed class
    const completedTitleSpan = screen.getByText('Test Task')
    expect(completedTitleSpan).toHaveClass(styles.completed)
  })

  it('should enter edit mode when Edit button is clicked', async () => {
    const user = userEvent.setup()

    render(
      <TaskItem
        task={mockTask}
        onDelete={mockOnDelete}
        onToggle={mockOnToggle}
        onSaveTitle={mockOnSaveTitle}
      />
    )

    const editButton = screen.getByRole('button', { name: /edit/i })
    await user.click(editButton)

    // Edit input should be visible
    const editInput = screen.getByDisplayValue('Test Task')
    expect(editInput).toBeInTheDocument()
    expect(editInput).toHaveValue('Test Task')

    // Save button should replace Edit button
    expect(screen.queryByRole('button', { name: /edit/i })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument()
  })

  it('should call onSaveTitle with updated title when Save button is clicked', async () => {
    const user = userEvent.setup()

    const { rerender } = render(
      <TaskItem
        task={mockTask}
        onDelete={mockOnDelete}
        onToggle={mockOnToggle}
        onSaveTitle={mockOnSaveTitle}
      />
    )

    // Enter edit mode
    const editButton = screen.getByRole('button', { name: /edit/i })
    await user.click(editButton)

    // Edit the task title
    const editInput = screen.getByDisplayValue('Test Task')
    await user.clear(editInput)
    await user.type(editInput, 'Updated Task Title')

    // Save the edit
    const saveButton = screen.getByRole('button', { name: /save/i })
    await user.click(saveButton)

    // Verify onSaveTitle was called with correct arguments
    expect(mockOnSaveTitle).toHaveBeenCalledTimes(1)
    expect(mockOnSaveTitle).toHaveBeenCalledWith('test-id-123', 'Updated Task Title')

    // Verify edit mode is exited (input should no longer be visible)
    expect(screen.queryByDisplayValue('Updated Task Title')).not.toBeInTheDocument()

    // Simulate parent updating the task prop (as would happen in real app)
    const updatedTask = { ...mockTask, title: 'Updated Task Title' }
    rerender(
      <TaskItem
        task={updatedTask}
        onDelete={mockOnDelete}
        onToggle={mockOnToggle}
        onSaveTitle={mockOnSaveTitle}
      />
    )

    // Now verify the updated title is displayed
    expect(screen.getByText('Updated Task Title')).toBeInTheDocument()
  })

  it('should call onSaveTitle when Enter key is pressed in edit mode', async () => {
    const user = userEvent.setup()

    render(
      <TaskItem
        task={mockTask}
        onDelete={mockOnDelete}
        onToggle={mockOnToggle}
        onSaveTitle={mockOnSaveTitle}
      />
    )

    // Enter edit mode
    const editButton = screen.getByRole('button', { name: /edit/i })
    await user.click(editButton)

    // Edit the task title
    const editInput = screen.getByDisplayValue('Test Task')
    await user.clear(editInput)
    await user.type(editInput, 'Task Saved with Enter')

    // Press Enter to save
    await user.keyboard('{Enter}')

    // Verify onSaveTitle was called
    expect(mockOnSaveTitle).toHaveBeenCalledTimes(1)
    expect(mockOnSaveTitle).toHaveBeenCalledWith('test-id-123', 'Task Saved with Enter')
  })

  it('should call onSaveTitle when input loses focus (blur)', async () => {
    const user = userEvent.setup()

    render(
      <TaskItem
        task={mockTask}
        onDelete={mockOnDelete}
        onToggle={mockOnToggle}
        onSaveTitle={mockOnSaveTitle}
      />
    )

    // Enter edit mode
    const editButton = screen.getByRole('button', { name: /edit/i })
    await user.click(editButton)

    // Edit the task title
    const editInput = screen.getByDisplayValue('Test Task')
    await user.clear(editInput)
    await user.type(editInput, 'Task Saved on Blur')

    // Blur the input (tab out or click outside)
    await user.tab()

    // Verify onSaveTitle was called
    expect(mockOnSaveTitle).toHaveBeenCalledTimes(1)
    expect(mockOnSaveTitle).toHaveBeenCalledWith('test-id-123', 'Task Saved on Blur')

    // Verify edit mode is exited (input should no longer be in the document)
    expect(screen.queryByDisplayValue('Task Saved on Blur')).not.toBeInTheDocument()
  })

  it('should cancel edit and not call onSaveTitle when Escape key is pressed', async () => {
    const user = userEvent.setup()

    render(
      <TaskItem
        task={mockTask}
        onDelete={mockOnDelete}
        onToggle={mockOnToggle}
        onSaveTitle={mockOnSaveTitle}
      />
    )

    // Enter edit mode
    const editButton = screen.getByRole('button', { name: /edit/i })
    await user.click(editButton)

    // Edit the task title
    const editInput = screen.getByDisplayValue('Test Task')
    await user.clear(editInput)
    await user.type(editInput, 'This should be cancelled')

    // Press Escape to cancel
    await user.keyboard('{Escape}')

    // Verify onSaveTitle was NOT called
    expect(mockOnSaveTitle).not.toHaveBeenCalled()

    // Verify edit mode is exited and original title is shown
    expect(screen.queryByDisplayValue('This should be cancelled')).not.toBeInTheDocument()
    expect(screen.getByText('Test Task')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument()
  })

  it('should trim whitespace before calling onSaveTitle', async () => {
    const user = userEvent.setup()

    render(
      <TaskItem
        task={mockTask}
        onDelete={mockOnDelete}
        onToggle={mockOnToggle}
        onSaveTitle={mockOnSaveTitle}
      />
    )

    // Enter edit mode
    const editButton = screen.getByRole('button', { name: /edit/i })
    await user.click(editButton)

    // Edit with leading and trailing whitespace
    const editInput = screen.getByDisplayValue('Test Task')
    await user.clear(editInput)
    await user.type(editInput, '  Trimmed Task Title  ')

    // Save the edit
    const saveButton = screen.getByRole('button', { name: /save/i })
    await user.click(saveButton)

    // Verify onSaveTitle was called with trimmed value
    expect(mockOnSaveTitle).toHaveBeenCalledTimes(1)
    expect(mockOnSaveTitle).toHaveBeenCalledWith('test-id-123', 'Trimmed Task Title')
  })

  it('should not call onSaveTitle if the trimmed value is unchanged', async () => {
    const user = userEvent.setup()

    render(
      <TaskItem
        task={mockTask}
        onDelete={mockOnDelete}
        onToggle={mockOnToggle}
        onSaveTitle={mockOnSaveTitle}
      />
    )

    // Enter edit mode
    const editButton = screen.getByRole('button', { name: /edit/i })
    await user.click(editButton)

    // Type the same value (with whitespace)
    const editInput = screen.getByDisplayValue('Test Task')
    await user.clear(editInput)
    await user.type(editInput, '  Test Task  ')

    // Save the edit
    const saveButton = screen.getByRole('button', { name: /save/i })
    await user.click(saveButton)

    // Verify onSaveTitle was NOT called since the trimmed value is the same
    expect(mockOnSaveTitle).not.toHaveBeenCalled()
  })

  it('should restore original title if edit is empty after trimming', async () => {
    const user = userEvent.setup()

    render(
      <TaskItem
        task={mockTask}
        onDelete={mockOnDelete}
        onToggle={mockOnToggle}
        onSaveTitle={mockOnSaveTitle}
      />
    )

    // Enter edit mode
    const editButton = screen.getByRole('button', { name: /edit/i })
    await user.click(editButton)

    // Clear the input or type only whitespace
    const editInput = screen.getByDisplayValue('Test Task')
    await user.clear(editInput)
    await user.type(editInput, '   ')

    // Try to save
    const saveButton = screen.getByRole('button', { name: /save/i })
    await user.click(saveButton)

    // Verify onSaveTitle was NOT called
    expect(mockOnSaveTitle).not.toHaveBeenCalled()

    // Verify original title is restored and edit mode is exited
    expect(screen.getByText('Test Task')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument()
  })
})
