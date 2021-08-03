import { app, BrowserWindow } from 'electron'
import { ipcMain } from 'electron'
import store from '../renderer/store'

ipcMain.on('close-app', () => {
  if (mainWindow) {
    mainWindow.close()
  }
})
ipcMain.on('min-app', () => {
  mainWindow.minimize()
})
ipcMain.on('fetched', (event,arg) => {
  console.log('[fetched server info]:', arg)
})
ipcMain.on('fetched-room', (event, arg) => {
  console.log(`[fetched-room info]:`,arg)
})
ipcMain.on('showMsg', (event, arg) => {
  console.log('[DEBUG]:',arg)
})
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    useContentSize: true,
    frame: false,
    width:960,
    height:602,
    minWidth: 960,
    transparent: true,
    backgroundColor:'#00000000',
    minHeight:602,
    maxWidth:960,
    maxHeight: 602,
    webPreferences: {
      webSecurity: false
    }
  })
  mainWindow.loadURL(winURL)
   mainWindow.setMenu(null)
  mainWindow.setMaximizable(false)
  mainWindow.setResizable(false)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}
app.on('ready', () => {
  createWindow();
})

app.on('window-all-closed', () => {
  store.commit('resetServer');
  store.commit('resetSetting');
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
