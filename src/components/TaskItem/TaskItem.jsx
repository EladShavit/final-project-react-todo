import { useEffect, useRef, useState } from 'react'

import styles from './TaskItem.module.css'

export function TaskItem({ task, onToggle, onDelete, onSaveTitle }) {
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState(task.title)
  const inputRef = useRef(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  useEffect(() => {
    if (!isEditing) {
      setDraft(task.title)
    }
  }, [task.title, isEditing])

  const handleSubmitEdit = () => {
    const trimmed = draft.trim()
    if (!trimmed) {
      setDraft(task.title)
      setIsEditing(false)
      return
    }
    if (trimmed !== task.title) {
      onSaveTitle(task.id, trimmed)
    }
    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    setDraft(task.title)
    setIsEditing(false)
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      handleSubmitEdit()
    }
    if (event.key === 'Escape') {
      event.preventDefault()
      handleCancelEdit()
    }
  }

  return (
    <li className={styles.taskItem}>
      <label className={styles.checkboxWrap}>
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
          aria-label={`Mark "${task.title}" as ${task.completed ? 'active' : 'completed'}`}
        />
        <span className={styles.check} />
      </label>

      <div className={styles.content}>
        {isEditing ? (
          <input
            ref={inputRef}
            className={styles.editInput}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={handleSubmitEdit}
            onKeyDown={handleKeyDown}
          />
        ) : (
          <span className={`${styles.title} ${task.completed ? styles.completed : ''}`}>
            {task.title}
          </span>
        )}
      </div>

      <div className={styles.actions}>
        {isEditing ? (
          <button className={styles.actionButton} type="button" onClick={handleSubmitEdit}>
            Save
          </button>
        ) : (
          <button className={styles.actionButton} type="button" onClick={() => setIsEditing(true)}>
            Edit
          </button>
        )}
        <button
          className={`${styles.actionButton} ${styles.danger}`}
          type="button"
          onClick={() => onDelete(task.id)}
          aria-label={`Delete "${task.title}"`}
        >
          Delete
        </button>
      </div>
    </li>
  )
}
