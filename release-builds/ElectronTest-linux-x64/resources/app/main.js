const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let path = require('path');

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    height: 400,
    width: 400,
    icon: path.join(__dirname, './icons/png/64x64.png'),
  })

  // load the local HTML file
  let url = require('url').format({
    protocol: 'file',
    slashes: true,
    pathname: path.join(__dirname, 'index.html')
  })
  console.log(url)
  mainWindow.loadURL(url)
})
