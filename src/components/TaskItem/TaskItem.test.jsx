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
})
