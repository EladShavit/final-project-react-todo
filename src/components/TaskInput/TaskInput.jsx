import { useState } from 'react'

import styles from './TaskInput.module.css'

export function TaskInput({ onAddTask }) {
  const [value, setValue] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    const trimmed = value.trim()
    if (!trimmed) return
    onAddTask(trimmed)
    setValue('')
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        className={styles.input}
        type="text"
        placeholder="Add a new task..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button className={styles.button} type="submit" disabled={!value.trim()}>
        Add
      </button>
    </form>
  )
}
