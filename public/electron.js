const { app, BrowserWindow, session, ipcMain } = require("electron");
const path = require("path");
const ProtocolRegistry = require("protocol-registry");

let mainWindow;
let loginWindow;
const isDev = !app.isPackaged;

const loginState = {
  state: "success",
  isLoggedIn: false,
};

const createLoginWindow = () => {
  loginWindow = new BrowserWindow({
    width: 400,
    height: 200,
    webPreferences: {
      preload: path.join(
        app.getAppPath(),
        isDev ? "./public/preload.js" : "./build/preload.js"
      ),
      contextIsolation: true,
    },
    titleBarStyle: "hidden",
    resizable: false,
    movable: true,
  });

  loginWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );

  if (isDev) {
    loginWindow.webContents.on("did-frame-finish-load", () => {
      loginWindow?.webContents.openDevTools({ mode: "detach" });
    });
  }

  loginWindow.on("closed", () => {
    loginWindow = null;
  });
};

const createMainWindow = (state) => {
  mainWindow = new BrowserWindow({
    width: 600,
    height: 600,
    webPreferences: {
      preload: path.join(
        app.getAppPath(),
        isDev ? "./public/preload.js" : "./build/preload.js"
      ),
      contextIsolation: true,
    },
  });

  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );

  mainWindow.webContents.on("did-finish-load", () => {
    mainWindow.webContents.send("loginState", state.res);
  });

  if (isDev) {
    mainWindow.webContents.on("did-frame-finish-load", () => {
      mainWindow?.webContents.openDevTools({ mode: "detach" });
    });
  }
};

app.setPath(
  "userData",
  path.join(isDev ? app.getAppPath() : process.resourcesPath, "userdata/")
);

app.whenReady().then(async () => {
  createLoginWindow();

  if (isDev) {
    try {
      await session.defaultSession.loadExtension(
        path.join(__dirname, "../userdata/extensions/react-dev-tools")
      );
      console.log("Dev Tools Loaded");
    } catch (err) {
      console.log(err);
    }
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    return;
  }

  if (isDev) {
    createDevProtocol();
  } else {
    createProtocol();
  }

  if (BrowserWindow.getAllWindows().length === 0) {
    createLoginWindow();
  }
});

// Handle all the IPC events here
app.on("ready", () => {
  ipcMain.handle("checkLoginState", async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return loginState;
  });

  ipcMain.handle("login", (data, args) => {
    if (args.username === "admin" || args.password === "admin") {
      loginState.isLoggedIn = true;
      loginState.state = "success";
    } else {
      loginState.isLoggedIn = false;
      loginState.state = "error";
    }
    return loginState;
  });

  ipcMain.handle("redirectToMainApp", (event, args) => {
    if (args.res.state === "success") {
      createMainWindow(args);
      loginWindow.close();
    }
  });

  ipcMain.handle("exitProgram", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

process.on("uncaughtException", (error) => {
  console.log(`Exception: ${error}`);
  if (process.platform !== "darwin") {
    app.quit();
  }
});

const createProtocol = () => {
  if (!app.isDefaultProtocolClient("buuradminsystem")) {
    app.setAsDefaultProtocolClient("buuradminsystem");
  }
};

const createDevProtocol = () => {
  ProtocolRegistry.register({
    protocol: "buuradminsystem",
    command: `"${process.execPath}" "${path.resolve(process.argv[1])}" $_URL_`,
    override: true,
    script: true,
    terminal: isDev,
  })
    .then(() => console.log("Protocol Registered"))
    .catch((err) => console.log(err));
};
