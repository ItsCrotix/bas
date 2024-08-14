import { ipcMain } from "electron";

ipcMain.handle("login", () => ({
  state: "success",
  isLoggedIn: true,
}));

ipcMain.handle("redirectToMainApp", (event, args) => {
  createMainWindow(args);
  loginWindow.close();
});

ipcMain.handle("exitProgram", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
