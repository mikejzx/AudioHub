
const { ipcRenderer, remote } = require('electron');
const win_prefs = remote.getCurrentWindow();

function onWindowLoad_pref() {}

// For window close button
function onWindowClose_pref() { 
    console.log('window close');
    win_prefs.close();
}

// For window restore button
function onWindowRestore_pref() { 
    console.log('window restore'); 
    
    if (win_prefs.isMaximized()) {
        win_prefs.unmaximize();
    }
    else {
        win_prefs.maximize();
    }
}

// For window minimise button
function onWindowMinimise_pref() { 
    console.log('window minimise'); 
    win_prefs.minimize();
}