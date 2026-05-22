import { useState } from 'react'
import Timer from './components/Timer'
import Settings from './components/Settings'
import Tasks from './components/Tasks'
import './index.css'

export default function App() {
  const [view, setView] = useState('timer')
  const [settings, setSettings] = useState({
    workMinutes: 25,
    shortBreakMinutes: 5,
    longBreakMinutes: 15,
    longBreakAfter: 4,
    soundEnabled: true
  })
  const [tasks, setTasks] = useState([])

  return (
    <div className="app">
      <div className="titlebar">
        <span className="titlebar-title">🍅 番茄鐘</span>
        <div className="titlebar-controls">
          <button onClick={() => window.electron?.minimize()} className="ctrl-btn">─</button>
          <button onClick={() => window.electron?.close()} className="ctrl-btn close-btn">✕</button>
        </div>
      </div>

      <nav className="nav">
        <button className={view === 'timer' ? 'active' : ''} onClick={() => setView('timer')}>計時器</button>
        <button className={view === 'tasks' ? 'active' : ''} onClick={() => setView('tasks')}>任務</button>
        <button className={view === 'settings' ? 'active' : ''} onClick={() => setView('settings')}>設定</button>
      </nav>

      <main className="content">
        {view === 'timer' && <Timer settings={settings} tasks={tasks} setTasks={setTasks} />}
        {view === 'tasks' && <Tasks tasks={tasks} setTasks={setTasks} />}
        {view === 'settings' && <Settings settings={settings} setSettings={setSettings} />}
      </main>
    </div>
  )
}
