
const url = require('url');
const path = require('path');
const { Menu, app, BrowserWindow } = require('electron');

let mainwnd;

app.on('ready', () => {
    mainwnd = new BrowserWindow({
        width: 800,
        height: 512,
        minWidth: 800,
        minHeight: 400,
        frame: false,
        // Fixed missing shadow on Linux
        transparent: false,
        hasShadow: true,

        // Apparently this is unsafe (supposably RCE-prone)
        // but it's very much needed
        webPreferences: {
            nodeIntegration: true
        }
    });
    mainwnd.loadURL(url.format({
        pathname: path.join(__dirname, 'mainwnd.html'),
        protocol: 'file:',
        slashes: true
    }));
    mainwnd.on('close', () => {
        app.exit();
        mainwnd = null;
    });

    //mainwnd.openDevTools();

    const mainmenu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(mainmenu);
});

const menuTemplate = [
    // File menu
    {
        label: "File",
        submenu: [
            // File>Open
            {
                label: "Open...",
                click() {

                },
            },
            // File>Quit
            {
                label: "Quit",
                accelerator: process.platform == 'darwin' ? "Command + Q" : "Ctrl + Q",
                click() {
                    app.quit();
                },
            }
        ]
    },
    // Playback menu
    {
        label: "Playback",
        submenu: [
            // Play
            {
                label: "Play",
                click() {},
            }
        ]
    },
    // Debug
    {
        label: "Debug",
        submenu: [
            // Debug>Dev tools
            {
                label: "Developer tools",
                click() {
                    mainwnd.openDevTools();
                },
            }
        ]
    },
    // Help
    {
        label: "?",
        //submenu: []
    }
    // Still W.I.P
    // Not high-priority since it's a linux-only thing.
];