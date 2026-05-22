const { app, BrowserWindow, Tray, Menu, nativeImage, ipcMain, Notification } = require('electron')
const path = require('path')

let mainWindow
let tray
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 420,
    height: 620,
    resizable: false,
    frame: false,
    transparent: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    },
    icon: path.join(__dirname, '../assets/icon.png')
  })

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173')
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  mainWindow.on('close', (e) => {
    e.preventDefault()
    mainWindow.hide()
  })
}

function createTray() {
  const icon = nativeImage.createEmpty()
  tray = new Tray(icon)

  const contextMenu = Menu.buildFromTemplate([
    { label: '顯示番茄鐘', click: () => mainWindow.show() },
    { type: 'separator' },
    { label: '退出', click: () => { app.exit(0) } }
  ])

  tray.setToolTip('番茄鐘')
  tray.setContextMenu(contextMenu)
  tray.on('click', () => {
    mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show()
  })
}

app.whenReady().then(() => {
  createWindow()
  createTray()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

ipcMain.on('notify', (_, { title, body }) => {
  new Notification({ title, body }).show()
})

ipcMain.on('window-minimize', () => mainWindow.minimize())
ipcMain.on('window-close', () => mainWindow.hide())
