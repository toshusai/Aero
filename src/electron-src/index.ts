// Native
// Packages
import { app,BrowserWindow } from "electron";
import isDev from "electron-is-dev";
import prepareNext from "electron-next";
import { join } from "path";
import { format } from "url";

import { initReadFile } from "./ipc/readFile";
import { initReadFileUserDataDir } from "./ipc/readFileUserDataDir";
import { initWriteFile } from "./ipc/writeFile";
import { initWriteFileUserDataDir } from "./ipc/writeFileUserDataDir";

// Prepare the renderer once the app is ready
app.on("ready", async () => {
  await prepareNext("./src");

  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: false,
      preload: join(__dirname, "preload.js"),
      webSecurity: false,
    },
  });

  const url = isDev
    ? "http://localhost:8000/"
    : format({
        pathname: join(__dirname, "../../out/index.html"),
        protocol: "file:",
        slashes: true,
      });

  mainWindow.loadURL(url);
});

// Quit the app once all windows are closed
app.on("window-all-closed", app.quit);

initReadFileUserDataDir();
initWriteFile();
initWriteFileUserDataDir();
initReadFile();
