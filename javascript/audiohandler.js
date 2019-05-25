
const jsmediatags = require("jsmediatags");
const defaultImgPath = "\"./img/albumart-default.png\"";
var playing = false; // CLick event in jsmain.js
var opened = false;
var audio = document.getElementById("audio_player");
var queue = []; // All tracks in the queue
var queueDisplays = []; // Every track's visual display
var queueIdx = 0;
var playState = "Play";
var currentvolume = 0;

// TODO: Prevent duplicate blobs
// Check if url is same and if so point to the originally-generated blob

function setOpened(t) {
    opened = t;

    // Set playback bar state based on t
    var pbSlider = document.getElementById("slider-playback-ctrl");
    pbSlider.disabled = t ^ true;
}

// Open a file
function audioOpen (fileName) {
    // Read ID3 tags
    new jsmediatags.Reader(fileName)
        .setTagsToRead(["title", "artist", "album", "picture", "year"])
        .read({
        onSuccess: function(tag) {
            setOpened(true);
            var tags = tag.tags;

            console.log("Successfully opened audio, tit:" + tags.title + " art:" + tags.artist + " alb:" + tags.album);
            addToQueue({
                filepath: fileName,
                fileNAME: getFileNameFromPath(fileName),
                title: tags.title == null ? "Untitled" : tags.title,
                artist: tags.artist == null ? "Unknown Artist" : tags.artist,
                album: tags.album == null ? "Unknown Album" : tags.album,
                image: getImageURL(tags.picture),
                year: tags.year
                // TODO: song length, etc
            });
        },
        onError: function(error) {
            console.log('Error reading tags: ', error.type, error.info);

            addToQueue({
                filepath: fileName,
                fileNAME: getFileNameFromPath(fileName),
                title: "Untitled",
                artist: "Unknown Artist",
                album: "Unknown Album",
                image: defaultImgPath,
                year: 0
                // TODO: song length, etc
            });
        }
    });
}

// Gets the name of the file from the path.
function getFileNameFromPath(path) {
    // -2 just incase path ends with a slash
    var len = path.length;
    for (var i = len - 2; i > -1; --i) {
        // Linux seems to use '/' while Windows has the escaped '\'
        if (path[i] == '/' || path[i] == '\\') {
            return path.substring(i + 1, len);
        }
    }
    return path;
}

// Return the image formatted as a base64 url from raw data
function getImageURL(img) {
    if (img == null) {
        return defaultImgPath;
    }

    // More memory efficient than concatenating a string
    var b64str = [];
    for (var i = 0; i < img.data.length; i++) {
        b64str.push(String.fromCharCode(img.data[i]));
    }
    /*var b64 = "url(data:" + img.format + ";base64," + window.btoa(b64str.join("")) + ")";
    return b64;*/

    var url = "data:" + img.format + ";base64," + window.btoa(b64str.join(""));
    var blob = dataToBlobURL(url);
    return blob;
}

// Create a blob. Remember to call URL.revokeObjectURL
// https://stackoverflow.com/questions/36285268/how-to-embed-a-large-image-with-data-uri
function dataToBlobURL (url) {
    var parts = url.split(",", 2);
    var mime = parts[0].substr(5).split(";")[0];
    var blob = base64toBlob(parts[1], mime); // base64toBlob defined in lib/methods.js
    var res = URL.createObjectURL(blob);

    console.log("Creating blob url:" + " mime:" + mime + " blob:" + blob + " res: " + res);

    return res;
}


// Play the audio
function audioPlay() {
    playState = "Pause";
    document.getElementById('btn_playpause').setAttribute('value', playState);
    audio.play();
    playing = true;
}

// Pause hte audio
function audioPause () {
    playState = "Play";
    document.getElementById('btn_playpause').setAttribute('value', playState);
    audio.pause();
    playing = false;
}

function addToQueue(a) {
    // Push to list
    queue.push(a);

    // Create new node to add to the display
    var list = document.getElementById("tracklist-main");
    
    // Create the node
    var e = document.createElement("div");
    e.setAttribute("class", "tracklist-item");
    e.setAttribute("onclick", "queueIdxChange(" + (queue.length - 1) + ")");
    
    // Create sub elements
    // Cover
    var ecover = document.createElement("div");
    ecover.setAttribute("class", "tracklist-item-cover");
    ecover.setAttribute("style", "background-image: url(" + a.image + ")");
    e.appendChild(ecover);
    // Title
    var etitle = document.createElement("a");
    etitle.setAttribute("class", "tracklist-item-title");
    etitle.innerHTML = a.title;
    e.appendChild(etitle);
    // Artist
    var eartist = document.createElement("a");
    eartist.setAttribute("class", "tracklist-item-artist");
    eartist.innerHTML = a.artist;
    e.appendChild(eartist);
    // File name
    var efname = document.createElement("a");
    efname.setAttribute("class", "tracklist-item-filename");
    efname.innerHTML = a.fileNAME;
    e.appendChild(efname);

    // Push to the display list
    queueDisplays.push(e);
    // Display it
    list.appendChild(e);

   
    if (queue.length < 2) {
        // Force update queue index to zero if only in list
        _queueIdxChange(0, true);
    }
    // Remove 'no tracks' label if needed
    if (queue.length > 0) {
        document.getElementById("tracklist-nofiles").setAttribute("class", "tracklist-nofiles-disable");
    }
    else {
        document.getElementById("tracklist-nofiles").setAttribute("class", "");
    }

    // Queue was changed
    queueUpdated();
}

function queueIdxChange(newIdx) {
    _queueIdxChange(newIdx, false);
}

// Change of queue indexNodeProject
function _queueIdxChange(newidx, force) {
    if (newidx == queueIdx && !force) {
        console.log("already at idx " + newidx);
        return;
    }
    if (force) {
        console.log("forcing idx to " + newidx);
    }

    var oldidx = queueIdx;
    queueIdx = newidx;
    currentSongUpdate();

    // Play audio if not already playing
    if (playing) {
        audioPlay();
    }

    // TODO: May make use of classList instead
    queueDisplays[oldidx].setAttribute("class", "tracklist-item");
    queueDisplays[newidx].setAttribute("class", "tracklist-item tracklist-item-playing");
}

function removeFromQueue(idx) {
    console.log("revoking blob at " + idx);
    var cur = queue[idx];
    URL.revokeObjectURL(cur.image);
    queue.splice(idx, 1); // Remove from array.
}

function queueUpdated() {
    // First song added, open it
    if (queue.length == 1) {
        queueIdxChange(0);
    }
}

// Update the current song, change bg to cover, title change etc.
function currentSongUpdate() {
    var cur = queue[queueIdx];
    updateTitleText(cur.artist + " - " + cur.title);
    audio.setAttribute("src", cur.filepath);
    document.getElementById("track-title").innerHTML = cur.title;
    document.getElementById("track-artist").innerHTML = "by " + cur.artist;

    // Set player background image to the cover art.
    var imgUrl = cur.image;
    var img = "url(" + imgUrl + ")";
    var b64 = img + "!important";
    if (imgUrl != defaultImgPath) {
        document.getElementById("ctrl-bar-bottom-cover").pseudoStyle("before", "background-image", b64);
    }
    else {
        console.log("null image");
        // Set player bg to nothing
        // url(./img/albumart-default.png) for actual cover
        document.getElementById("ctrl-bar-bottom-cover").pseudoStyle("before", "background-image", "none !important");
    }
    // Set the current cover art
    document.getElementById("track-cover").setAttribute("style", "background-image: " + b64);
}

// Title should be formatted as:
// Artist name - Track title
function updateTitleText(newTitle) {
    var cap = newTitle + " : AudioHub";
    document.getElementsByTagName("title")[0].innerHTML = cap;
    document.getElementById("captionbar-title").innerHTML = cap;
}

// NOTES/SAVED DOCUMENTATION FOR OFFLINE DEVELOPMENT
/* ------------------------------------------ **
        ID3v2 tag example:
{
  type: "ID3",
  version: "2.4.0",
  major: 4,
  revision: 0,
  tags: {
    artist: "etc",
    album: "etc",
    track: "12",
    TPE1: {
      id: "TPE1",
      size: 14,
      description: "Lead performer(s)/Soloist(s)",
      data: "Sam, The Kid"
    },
    TALB: {
      id: "TALB",
      size: 16,
      description: "Album/Movie/Show title",
      data: "Pratica(mente)"
    },
    TRCK: {
      id: "TRCK",
      size: 3,
      description: "Track number/Position in set",
      data: "12",
    }
  },
  size: 34423,
  flags: {
    unsynchronisation: false,
    extended_header: false,
    experimental_indicator: false,
    footer_present: false
  }
}
** ------------------------------------------ */