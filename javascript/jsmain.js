
const electron = require('electron');
const remote = electron.remote;
const win = remote.getCurrentWindow();
const dialog = remote.dialog;

setInterval(sliderCallback, 100);

// When the window completes loading
function windowLoaded () {
    remote.getGlobal("share").openFileDialog = openFileDialog;

    console.log("window loaded");
    slidersInitialise(); // in sliders.js
    initialiseDragDrop (); // in dragdrop.js
    initialise_vis(); // in visualiser.js
}

// For window close button
function onWindowClose() { 
    console.log('window close');
    
    // Clear the queue to revoke blobs.
    for (var i = 0; i < queue.length; i++) {
        removeFromQueue(0);
    }
    
    win.close();
}

// For window restore button
function onWindowRestore() { 
    console.log('window restore'); 
    
    if (win.isMaximized()) {
        win.unmaximize();
    }
    else {
        win.maximize();
    }
}

// For window minimise button
function onWindowMinimise() { 
    console.log('window minimise'); 
    win.minimize();
}

function openDevTools() {
    win.openDevTools();
}

function openPreferences() {
    remote.getGlobal("wndshow_pref")();
}

// On click of the play/pause button
function trackPlayPause() {
    // Can't play/pause no song !
    if (!opened) {
        return;
    }

    playing ^= true;
    if (playing) {
        console.log("track play");
        audioPlay();
    }
    else {
        console.log("track pause");
        audioPause();
    }
}

// On click of 'previous' button
// (This will only goto the previous track
// If the current is less than 3 seconds in,
// any more and it will just restart it.)
function trackPrevious() {
    // Previous if less than 3
    if (audio.currentTime < 3) {
        trackPreviousActual();
    }
    else {
        // Replay current track
        audio.currentTime = 0;
    }
}

// Actually go back a track.
function trackPreviousActual() {
    var i = queueIdx - 1;
    if (i > -1) {
        queueIdxChange(i);
        console.log("prev track");
    }
    else {
        console.log("no previous songs");
        // Goto end of queue if more than 1 song
        if (queue.length > 1) {
            queueIdxChange(queue.length - 1);
        }
        else {
            // TODO: REPLAY IF THE REPLAY/LOOP OPTION IS SELECTED!!! -------------------
            // For now just stop the only song
            audio.currentTime = 0;
            audioPause();
        }
    }
}

// On click of the 'next track' button
function trackNext() {
    var i = queueIdx + 1;
    if (i < queue.length) {
        queueIdxChange(i);
        console.log("next track");
    }
    else {
        console.log("no more songs in queue");

        // TODO: Restart if 'repeat queue'
        if (queue.length > 1) {
            // Goto start of queue if more than 1 song
            queueIdxChange(0);
        }
        else {
            // TODO: REPLAY IF THE REPLAY/LOOP OPTION IS SELECTED!!! -------------------
            // For now just stop the only song
            audio.currentTime = 0;
            audioPause();
        }
    }
}

function openFileDialog () {
    dialog.showOpenDialog({
        title: 'Open file',
        properties: [
            'openFile',
            'multiSelections',
        ],
        filters: [
            { name: 'MP3', extensions: ['mp3'] },
            { name: 'Wave', extensions: ['wav'] },
            { name: 'Ogg Vorbis', extensions: ['ogg']},
            { name: 'VLC Playlist', extensions: ['xspf'] }
        ]
    }, function(filePaths, bookmarks) {
        if (filePaths == null) { return; }
        for (var i = 0; i < filePaths.length; ++i) {
            audioOpen(filePaths[i]);
        }
    });
}