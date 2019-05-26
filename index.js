
const url = require('url');
const path = require('path');
const { Menu, app, BrowserWindow } = require('electron');

let mainwnd; // Main window
let prefwnd; // Preferences window

app.on('ready', () => {
    wndinit_main();

    //mainwnd.openDevTools();

    const mainmenu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(mainmenu);
});

// Initialise the main window
function wndinit_main () {
    mainwnd = new BrowserWindow({
        width: 800, height: 512,
        minWidth: 800, minHeight: 400,
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
        pathname: path.join(__dirname, 'wndmain.html'),
        protocol: 'file:',
        slashes: true
    }));
    mainwnd.on('close', () => {
        app.exit();
        mainwnd = null;
    });
}

global.wndshow_pref = () => {
    prefwnd = new BrowserWindow({
        width: 400, height: 200,
        minWidth: 400, minHeight: 200,
        frame: false, 
        transparent: false, hasShadow: true,

        webPreferences: {
            nodeIntegration: true
        }
    });
    prefwnd.loadURL(url.format({
        pathname: path.join(__dirname, "wndpref.html"),
        protocol: 'file:',
        slashes: true
    }));
    prefwnd.on('close', () => {
        prefwnd = null;
    });
}

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