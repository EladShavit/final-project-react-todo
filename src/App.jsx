import { useEffect, useMemo, useState } from 'react'

import styles from './App.module.css'

import { TaskInput } from './components/TaskInput/TaskInput.jsx'
import { TaskList } from './components/TaskList/TaskList.jsx'
import { TaskFilters } from './components/TaskFilters/TaskFilters.jsx'

const STORAGE_KEY = 'taskManager.tasks.v1'

function App() {
  /**
   * Task model:
   * - id: string
   * - title: string
   * - completed: boolean
   * - createdAt: number
   */
  const [tasks, setTasks] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return []
      const parsed = JSON.parse(raw)
      return Array.isArray(parsed) ? parsed : []
    } catch (err) {
      console.error('Failed to parse tasks from localStorage', err)
      return []
    }
  })

  /** @type {('all'|'active'|'completed')} */
  const [filter, setFilter] = useState('all')

  const activeCount = useMemo(() => tasks.filter((t) => !t.completed).length, [tasks])
  const completedCount = useMemo(() => tasks.filter((t) => t.completed).length, [tasks])

  const filteredTasks = useMemo(() => {
    if (filter === 'active') return tasks.filter((t) => !t.completed)
    if (filter === 'completed') return tasks.filter((t) => t.completed)
    return tasks
  }, [filter, tasks])

  // Handlers are intentionally minimal here; full CRUD + persistence comes next steps.
  const handleAddTask = (title) => {
    const trimmed = title.trim()
    if (!trimmed) return
    const nextTask = {
      id: crypto.randomUUID(),
      title: trimmed,
      completed: false,
      createdAt: Date.now(),
    }
    setTasks((prev) => [nextTask, ...prev])
  }

  const handleToggleTask = (id) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)))
  }

  const handleDeleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }

  const handleUpdateTaskTitle = (id, nextTitle) => {
    const trimmed = nextTitle.trim()
    if (!trimmed) return
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, title: trimmed } : t)))
  }

  const handleClearCompleted = () => {
    setTasks((prev) => prev.filter((t) => !t.completed))
  }

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
    } catch (err) {
      console.error('Failed to write tasks to localStorage', err)
    }
  }, [tasks])

  return (
    <div className={styles.app}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Task Manager</h1>
          <p className={styles.subtitle}>Clean, modular, and fully local-first.</p>
        </header>

        <main className={styles.panel}>
          <TaskInput onAddTask={handleAddTask} />

          <TaskFilters
            activeCount={activeCount}
            completedCount={completedCount}
            filter={filter}
            onChangeFilter={setFilter}
            onClearCompleted={handleClearCompleted}
          />

          <TaskList
            tasks={filteredTasks}
            onDelete={handleDeleteTask}
            onSaveTitle={handleUpdateTaskTitle}
            onToggle={handleToggleTask}
          />
        </main>
      </div>
    </div>
  )
}

export default App
