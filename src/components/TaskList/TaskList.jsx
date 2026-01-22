import { TaskItem } from '../TaskItem/TaskItem.jsx'

import styles from './TaskList.module.css'

export function TaskList({ tasks, onToggle, onDelete, onSaveTitle }) {
  if (!tasks.length) {
    return <div className={styles.empty}>No tasks yet.</div>
  }

  return (
    <ul className={styles.list}>
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
          onSaveTitle={onSaveTitle}
        />
      ))}
    </ul>
  )
}
