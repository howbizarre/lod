const { app, BrowserWindow, Menu, globalShortcut } = require("electron");
const path = require("path");

const isMac = process.platform === "darwin";

const template = [
    {
        label: "File",
        submenu: [isMac ? { role: "close" } : { role: "quit" }],
        accelerator: isMac ? "Command+Q" : "Ctrl+Q",
    },
    {
        role: "help",
        submenu: [
            {
                label: "Learn More",
                click: async () => {
                    const { shell } = require("electron");
                    await shell.openExternal("https://electronjs.org");
                },
            },
        ],
    },
];

const menu = Menu.buildFromTemplate(template);

const createWindow = () => {
    const win = new BrowserWindow({
        width: 400,
        height: 550,
    });

    win.loadFile("index.html");
};

app.whenReady().then(() => {
    createWindow();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });

    globalShortcut.register("Alt+W", () => app.quit());

    Menu.setApplicationMenu(menu);
});

if (isMac) {
    template.unshift({});
}

app.on("window-all-closed", () => {
    if (!isMac) {
        app.quit();
    }
});
