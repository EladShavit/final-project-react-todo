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

  it('should call onAddTask when Enter key is pressed', async () => {
    const mockOnAddTask = vi.fn()
    const user = userEvent.setup()

    render(<TaskInput onAddTask={mockOnAddTask} />)

    const input = screen.getByPlaceholderText(/add a new task/i)

    await user.type(input, 'Complete project')
    await user.keyboard('{Enter}')

    expect(mockOnAddTask).toHaveBeenCalledTimes(1)
    expect(mockOnAddTask).toHaveBeenCalledWith('Complete project')
    expect(input).toHaveValue('')
  })

  it('should not call onAddTask for empty input', async () => {
    const mockOnAddTask = vi.fn()
    const user = userEvent.setup()

    render(<TaskInput onAddTask={mockOnAddTask} />)

    const input = screen.getByPlaceholderText(/add a new task/i)
    const addButton = screen.getByRole('button', { name: /add/i })

    // Verify button is disabled when input is empty
    expect(addButton).toBeDisabled()

    // Try to submit with empty input via button (should not work)
    await user.click(addButton)
    expect(mockOnAddTask).not.toHaveBeenCalled()

    // Try to submit with empty input via Enter key
    await user.keyboard('{Enter}')
    expect(mockOnAddTask).not.toHaveBeenCalled()

    // Try with whitespace only
    await user.type(input, '   ')
    // Button should still be disabled
    expect(addButton).toBeDisabled()
    await user.click(addButton)
    expect(mockOnAddTask).not.toHaveBeenCalled()
  })

  it('should trim whitespace before calling onAddTask', async () => {
    const mockOnAddTask = vi.fn()
    const user = userEvent.setup()

    render(<TaskInput onAddTask={mockOnAddTask} />)

    const input = screen.getByPlaceholderText(/add a new task/i)
    const addButton = screen.getByRole('button', { name: /add/i })

    // Type with leading and trailing whitespace
    await user.type(input, '  Buy groceries  ')
    await user.click(addButton)

    expect(mockOnAddTask).toHaveBeenCalledTimes(1)
    expect(mockOnAddTask).toHaveBeenCalledWith('Buy groceries')
    expect(input).toHaveValue('')
  })
})
