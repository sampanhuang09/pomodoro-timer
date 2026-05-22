export default function Settings({ settings, setSettings }) {
  function update(key, val) {
    const num = parseInt(val)
    if (isNaN(num) || num < 1) return
    setSettings(prev => ({ ...prev, [key]: num }))
  }

  return (
    <div className="settings-view">
      <h2>時間設定（分鐘）</h2>

      <div className="setting-group">
        <label>專注工作時間</label>
        <div className="number-input">
          <button onClick={() => update('workMinutes', settings.workMinutes - 1)}>−</button>
          <input
            type="number" min="1" max="99"
            value={settings.workMinutes}
            onChange={e => update('workMinutes', e.target.value)}
          />
          <button onClick={() => update('workMinutes', settings.workMinutes + 1)}>+</button>
        </div>
      </div>

      <div className="setting-group">
        <label>短休息時間</label>
        <div className="number-input">
          <button onClick={() => update('shortBreakMinutes', settings.shortBreakMinutes - 1)}>−</button>
          <input
            type="number" min="1" max="99"
            value={settings.shortBreakMinutes}
            onChange={e => update('shortBreakMinutes', e.target.value)}
          />
          <button onClick={() => update('shortBreakMinutes', settings.shortBreakMinutes + 1)}>+</button>
        </div>
      </div>

      <div className="setting-group">
        <label>長休息時間</label>
        <div className="number-input">
          <button onClick={() => update('longBreakMinutes', settings.longBreakMinutes - 1)}>−</button>
          <input
            type="number" min="1" max="99"
            value={settings.longBreakMinutes}
            onChange={e => update('longBreakMinutes', e.target.value)}
          />
          <button onClick={() => update('longBreakMinutes', settings.longBreakMinutes + 1)}>+</button>
        </div>
      </div>

      <div className="setting-group">
        <label>幾個番茄後長休息</label>
        <div className="number-input">
          <button onClick={() => update('longBreakAfter', settings.longBreakAfter - 1)}>−</button>
          <input
            type="number" min="1" max="10"
            value={settings.longBreakAfter}
            onChange={e => update('longBreakAfter', e.target.value)}
          />
          <button onClick={() => update('longBreakAfter', settings.longBreakAfter + 1)}>+</button>
        </div>
      </div>

      <h2>其他設定</h2>

      <div className="setting-group toggle-group">
        <label>完成提示音</label>
        <button
          className={`toggle-btn ${settings.soundEnabled ? 'on' : 'off'}`}
          onClick={() => setSettings(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }))}
        >
          {settings.soundEnabled ? '開啟' : '關閉'}
        </button>
      </div>
    </div>
  )
}
