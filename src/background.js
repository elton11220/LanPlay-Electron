'use strict'

import { app, protocol, BrowserWindow } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
// import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
const isDevelopment = process.env.NODE_ENV !== 'production'

import store from './store'
import { ipcMain } from 'electron'
ipcMain.on('close-app', () => {
  if (win)
    win.close()
})
ipcMain.on('min-app', () => {
  if(win)
    win.minimize()
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

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

let win;
async function createWindow() {
  // Create the browser window.
  require('@electron/remote/main').initialize()
  win = new BrowserWindow({
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
      webSecurity:false,
      nodeIntegration:true,
      contextIsolation: false,
      enableRemoteModule: true
    }
  })
  win.setMenu(null)
  win.setMaximizable(false)
  win.setResizable(false)
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  store.commit('resetServer');
  store.commit('resetSetting');
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  // if (isDevelopment && !process.env.IS_TEST) {
  //   // Install Vue Devtools
  //   try {
  //     await installExtension(VUEJS_DEVTOOLS)
  //   } catch (e) {
  //     console.error('Vue Devtools failed to install:', e.toString())
  //   }
  // }
  createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
