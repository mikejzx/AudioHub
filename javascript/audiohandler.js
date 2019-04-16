
const jsmediatags = require("jsmediatags");
const defaultImgPath = "url(\"./img/albumart-default.png\")";
var audio = document.getElementById("audio_player");
var queue = []; // All tracks in the queue
var queueIdx = 0;

// Open a file
function audioOpen (fileName) {
    // Read ID3 tags
    new jsmediatags.Reader(fileName)
        .setTagsToRead(["title", "artist", "album", "picture"])
        .read({
        onSuccess: function(tag) {
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
                image: null,
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
        if (path[i] == '/') {
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
    var b64 = "url(data:" + img.format + ";base64," + window.btoa(b64str.join("")) + ")";
    return b64;
}

// Play the audio
function audioPlay() {
    audio.play();
}

// Pause hte audio
function audioPause () {
    audio.pause();
}

function addToQueue(a) {
    queue.push(a);

    // Remove 'no tracks' label if needed
    if (queue.length == 0) {
        document.getElementById("tracklist-nofiles").setAttribute("class", "");
    }
    else {
        // Disable
        document.getElementById("tracklist-nofiles").setAttribute("class", "tracklist-nofiles-disable");
    }

    // Create new node to add to the display
    var list = document.getElementById("tracklist-main");
    
    // Create the node
    var e = document.createElement("div");
    e.setAttribute("class", "tracklist-item");
    
    // Create sub elements
    // Cover
    var ecover = document.createElement("div");
    ecover.setAttribute("class", "tracklist-item-cover");
    ecover.setAttribute("style", "background-image: " + a.image);
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


    list.appendChild(e);

    queueUpdated();
}

// Change of queue indexNodeProject
function queueIdxChange(newidx) {
    queueIdx = newidx;
    currentSongUpdate();
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
    var img = cur.image;
    // Check lengths first to avoid the string comparison as im not sure how expensive it is :D
    if (img.length != defaultImgPath.length && img != defaultImgPath) {
        var b64 = cur.image + "!important";
        document.getElementById("ctrl-bar-bottom-cover").pseudoStyle("before", "background-image", b64);
    }
    else {
        console.log("null image");
        // Set player bg to nothing
        // url(./img/albumart-default.png) for actual cover
        document.getElementById("ctrl-bar-bottom-cover").pseudoStyle("before", "background-image", "none");
    }
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