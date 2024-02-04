const { app, BrowserWindow } = require("electron");
const { updateElectronApp, UpdateSourceType } = require("update-electron-app");

updateElectronApp({
  type: UpdateSourceType.ElectronPublicUpdateService,
  repo: "YashwanthReddyVeesarapu/ToDo",
  updateInterval: "1 hour",
});

let appWindow;

function createWindow() {
  appWindow = new BrowserWindow({
    width: 800,
    height: 800,
    icon: "src/assets/icon.png",
    webPreferences: {
      nodeIntegration: true,
    },
  });

  appWindow.loadFile("dist/todo/browser/index.html");

  appWindow.on("closed", () => {
    appWindow = null;
  });
}

app.whenReady().then(createWindow);
