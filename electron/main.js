const { app, BrowserWindow } = require('electron')
const path = require('path')

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  // In development, load from the Vite dev server
  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL)
  } else {
    // In production, load the index.html file
    win.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  // Handle window close event
  win.on('close', (e) => {
    const choice = require('electron').dialog.showMessageBoxSync(win, {
      type: 'question',
      buttons: ['Yes', 'No'],
      title: 'Confirm',
      message: 'Are you sure you want to quit?'
    })
    if (choice === 1) {
      e.preventDefault()
    }
  })

  // Cleanup when window is closed
  win.on('closed', () => {
    // Clean up database connections if needed
    if (global.database) {
      global.database.close()
    }
    // Clean up Telegram bot instance
    if (global.telegram && global.telegram.bot) {
      global.telegram.bot.stopPolling()
    }
    app.quit()
  })
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})