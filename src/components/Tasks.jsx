import { useState } from 'react'

export default function Tasks({ tasks, setTasks }) {
  const [input, setInput] = useState('')

  function addTask() {
    const name = input.trim()
    if (!name) return
    setTasks(prev => [...prev, { id: Date.now().toString(), name, pomodoros: 0, done: false }])
    setInput('')
  }

  function toggleDone(id) {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }

  function deleteTask(id) {
    setTasks(prev => prev.filter(t => t.id !== id))
  }

  return (
    <div className="tasks-view">
      <div className="task-input-row">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addTask()}
          placeholder="新增任務..."
          className="task-input"
        />
        <button className="btn-primary small" onClick={addTask}>新增</button>
      </div>

      <ul className="task-list">
        {tasks.length === 0 && <li className="empty-hint">還沒有任務，新增一個吧！</li>}
        {tasks.map(t => (
          <li key={t.id} className={`task-item ${t.done ? 'done' : ''}`}>
            <button className="task-check" onClick={() => toggleDone(t.id)}>
              {t.done ? '✓' : '○'}
            </button>
            <span className="task-name">{t.name}</span>
            <span className="task-pomodoros">🍅 {t.pomodoros}</span>
            <button className="task-delete" onClick={() => deleteTask(t.id)}>✕</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
