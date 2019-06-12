
const url = require('url');
const path = require('path');
const { Menu, app, BrowserWindow, ipcMain } = require('electron');

let mainwnd; // Main window
let prefwnd; // Preferences window
let lWindows = []; // All windows.

app.on('ready', () => {
    global.bShowVisualiser = false;
    global.bNativeTitlebar = true;
    global.share = {
        openFileDialog: null,
        setAudioLogLin: null // For setting logarithmic/linear between windows.
    };
    global.bLogarithmicVol = true;
    
    // Initialise functions that need ipc
    ipcMain.on("toggle_visualiserstate", (event, newval) => { global.bShowVisualiser = newval; });
    ipcMain.on("toggle_nativetitlebar", (event, act) => {
        for (var i = 0; i < lWindows.length; ++i) {
            lWindows[i].frame = act;
        }
    });
    ipcMain.on("toggle_logarithmicvol", (event, newval) => { global.bLogarithmicVol = newval; });

    wndinit_main();
    //global.wndshow_pref();

    //mainwnd.openDevTools();

    // Mac users only get the main menu :/
    if (process.platform == 'darwin') {
        const mainmenu = Menu.buildFromTemplate(menuMainWnd);
        Menu.setApplicationMenu(mainmenu);
    }
});

// Initialise the main window
function wndinit_main () {
    mainwnd = new BrowserWindow({
        width: 800, height: 512,
        minWidth: 800, minHeight: 400,
        frame: global.bNativeTitlebar,

        // Can't seem to get shadows on Linux :/
        // Maybe should leave native title bar for Linux users?
        transparent: false,
        hasShadow: true,

        // Apparently this is unsafe (supposably RCE-prone)
        // but it's very much needed
        webPreferences: { nodeIntegration: true }
    });
    mainwnd.loadURL(url.format({
        pathname: path.join(__dirname, 'wndmain.html'),
        protocol: 'file:',
        slashes: true
    }));
    mainwnd.on('close', () => {
        // Remove from windows array
        lWindows.splice(lWindows.indexOf(mainwnd), 1);
        // Exit application etc
        app.exit();
        mainwnd = null;
    });

    // Add menu
    mainwnd.setMenu(Menu.buildFromTemplate(menuMainWnd));

    // Push to the windows list
    lWindows.push(mainwnd);
}

global.wndshow_pref = () => {
    prefwnd = new BrowserWindow({
        width: 700, height: 350,
        minWidth: 400, minHeight: 200,
        frame: global.bNativeTitlebar,
        transparent: false, hasShadow: true,

        webPreferences: { nodeIntegration: true }
    });
    prefwnd.loadURL(url.format({
        pathname: path.join(__dirname, "wndpref.html"),
        protocol: 'file:',
        slashes: true
    }));
    prefwnd.on('close', () => {
        // Push to the windows list
        lWindows.splice(lWindows.indexOf(prefwnd), 1);
        prefwnd = null;
    });

    prefwnd.openDevTools();

    // Add menu
    prefwnd.setMenu(null);
    prefwnd.setMenuBarVisibility(false);

    // Push to the windows list
    lWindows.push(mainwnd);
}

const menuMainWnd = [
    // File menu
    {
        label: "File",
        submenu: [
            // File > Open
            {
                label: "Open...",
                click() {
                    global.share.openFileDialog();
                },
            },
            // File > Save as playlist
            {
                label: "Save as playlist...",
                click() {}
            },
            // File > Preferences
            {
                label: "Option",
                click () { global.wndshow_pref(); }
            },
            // File > Quit
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
            // Debug > Dev tools
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
        submenu: [
            // Help > About
            {
                label: "About",
                click() {}
            }
        ]
    }
    // Still W.I.P
];