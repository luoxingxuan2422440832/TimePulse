// Modules to control application life and create native browser window


const {app, BrowserWindow, Tray, Menu} = require('electron')
const path = require('node:path')

const NODE_ENV = process.env.NODE_ENV
process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";
function createWindow() {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 960,
        height: 960,
        icon: path.join(__dirname,'time.ico'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            webSecurity: false,
        }
    })

    // and load the index.html of the app.
    mainWindow.loadURL(
        NODE_ENV === 'development' ?
            "http://localhost:3000" :
            `file://${path.join(__dirname, "../dist/index.html")}`);
    // mainWindow.loadFile('index.html')

    // Open the DevTools.
    // mainWindow.webContents.openDevTools()
}
let tray = null

app.commandLine.appendSwitch('lang', 'zh-CN'); // 放在app ready前 app.on('ready', ...)
app.whenReady().then(() => {
    createWindow()
    // create_tray()
    tray = new Tray('time.ico')
    app.on('activate', function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})
Menu.setApplicationMenu(null)
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
