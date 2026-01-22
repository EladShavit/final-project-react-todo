import styles from './TaskFilters.module.css'

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active' },
  { id: 'completed', label: 'Completed' },
]

export function TaskFilters({
  filter,
  activeCount,
  completedCount,
  onChangeFilter,
  onClearCompleted,
}) {
  return (
    <div className={styles.filtersRow}>
      <div className={styles.filterGroup}>
        {FILTERS.map((item) => {
          const isActive = filter === item.id
          return (
            <button
              key={item.id}
              type="button"
              className={`${styles.filterButton} ${isActive ? styles.active : ''}`}
              onClick={() => onChangeFilter(item.id)}
            >
              {item.label}
            </button>
          )
        })}
      </div>

      <div className={styles.meta}>
        <span className={styles.count}>{activeCount} remaining</span>
        <button
          type="button"
          className={styles.clearButton}
          onClick={onClearCompleted}
          disabled={completedCount === 0}
        >
          Clear completed
        </button>
      </div>
    </div>
  )
}
