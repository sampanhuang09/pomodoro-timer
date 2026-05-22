import { useState, useEffect, useRef, useCallback } from 'react'

const MODES = {
  work: '專注工作',
  shortBreak: '短休息',
  longBreak: '長休息'
}

function beep(frequency = 440, duration = 600) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.frequency.value = frequency
    osc.type = 'sine'
    gain.gain.setValueAtTime(0.3, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration / 1000)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + duration / 1000)
  } catch (_) {}
}

export default function Timer({ settings, tasks, setTasks }) {
  const [mode, setMode] = useState('work')
  const [secondsLeft, setSecondsLeft] = useState(settings.workMinutes * 60)
  const [running, setRunning] = useState(false)
  const [pomodoroCount, setPomodoroCount] = useState(0)
  const [selectedTask, setSelectedTask] = useState('')
  const intervalRef = useRef(null)

  const getDuration = useCallback((m) => {
    if (m === 'work') return settings.workMinutes * 60
    if (m === 'shortBreak') return settings.shortBreakMinutes * 60
    return settings.longBreakMinutes * 60
  }, [settings])

  useEffect(() => {
    if (!running) setSecondsLeft(getDuration(mode))
  }, [settings, mode, getDuration, running])

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft(s => {
          if (s <= 1) {
            clearInterval(intervalRef.current)
            handleComplete()
            return 0
          }
          return s - 1
        })
      }, 1000)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [running, mode])

  function handleComplete() {
    setRunning(false)
    if (settings.soundEnabled) {
      beep(880, 400)
      setTimeout(() => beep(660, 400), 500)
      setTimeout(() => beep(440, 600), 1000)
    }

    if (mode === 'work') {
      const next = pomodoroCount + 1
      setPomodoroCount(next)

      if (selectedTask) {
        setTasks(prev => prev.map(t =>
          t.id === selectedTask ? { ...t, pomodoros: t.pomodoros + 1 } : t
        ))
      }

      window.electron?.notify('🍅 番茄鐘完成！', '休息一下吧～')
      const nextMode = next % settings.longBreakAfter === 0 ? 'longBreak' : 'shortBreak'
      switchMode(nextMode)
    } else {
      window.electron?.notify('⏰ 休息結束', '繼續努力！')
      switchMode('work')
    }
  }

  function switchMode(newMode) {
    setMode(newMode)
    setSecondsLeft(getDuration(newMode))
    setRunning(false)
  }

  function reset() {
    setRunning(false)
    setSecondsLeft(getDuration(mode))
  }

  const minutes = Math.floor(secondsLeft / 60).toString().padStart(2, '0')
  const seconds = (secondsLeft % 60).toString().padStart(2, '0')
  const total = getDuration(mode)
  const progress = ((total - secondsLeft) / total) * 100
  const circumference = 2 * Math.PI * 110

  return (
    <div className="timer-view">
      <div className="mode-tabs">
        {Object.entries(MODES).map(([key, label]) => (
          <button
            key={key}
            className={mode === key ? 'active' : ''}
            onClick={() => { if (!running) switchMode(key) }}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="timer-ring-wrap">
        <svg width="260" height="260" viewBox="0 0 260 260">
          <circle cx="130" cy="130" r="110" className="ring-bg" />
          <circle
            cx="130" cy="130" r="110"
            className={`ring-progress ${mode}`}
            strokeDasharray={circumference}
            strokeDashoffset={circumference - (circumference * progress) / 100}
            transform="rotate(-90 130 130)"
          />
        </svg>
        <div className="timer-display">
          <div className="time-text">{minutes}:{seconds}</div>
          <div className="mode-label">{MODES[mode]}</div>
        </div>
      </div>

      <div className="pomodoro-dots">
        {Array.from({ length: settings.longBreakAfter }).map((_, i) => (
          <span key={i} className={`dot ${i < (pomodoroCount % settings.longBreakAfter) ? 'filled' : ''}`} />
        ))}
      </div>

      <div className="timer-controls">
        <button className="btn-secondary" onClick={reset}>重置</button>
        <button className="btn-primary" onClick={() => setRunning(r => !r)}>
          {running ? '暫停' : '開始'}
        </button>
      </div>

      {tasks.length > 0 && (
        <div className="task-select">
          <select value={selectedTask} onChange={e => setSelectedTask(e.target.value)}>
            <option value="">選擇任務（選填）</option>
            {tasks.filter(t => !t.done).map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>
      )}

      <div className="stats">
        今日完成：<strong>{pomodoroCount}</strong> 個番茄鐘
      </div>
    </div>
  )
}
