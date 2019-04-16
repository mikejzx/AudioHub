
const jsmediatags = require("jsmediatags");
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
            queue.push({
                filepath: fileName,
                title: tags.title == null ? "Untitled" : tags.title,
                artist: tags.artist == null ? "Unknown Artist" : tags.artist,
                album: tags.album == null ? "Unknown Album" : tags.album,
                image: tags.picture,
                year: tags.year
                // TODO: song length, etc
            });
            queueUpdated();
        },
        onError: function(error) {
            console.log('Error reading tags: ', error.type, error.info);

            queue.push({
                filepath: fileName,
                title: "Untitled",
                artist: "Unknown Artist",
                album: "Unknown Album",
                image: null,
                year: 0
                // TODO: song length, etc
            });
            queueUpdated();
        }
    });
}

// Play the audio
function audioPlay() {
    audio.play();
}

// Pause hte audio
function audioPause () {
    audio.pause();
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
    if (img) {
        // More memory efficient than concatenating a string
        var b64str = [];
        for (var i = 0; i < img.data.length; i++) {
            b64str.push(String.fromCharCode(img.data[i]));
        }
        var b64 = "url(data:" + img.format + ";base64," + window.btoa(b64str.join("")) + ") !important";
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
function updateTitleText(newTitle) {newTitle + " : AudioPlayerJS"
    var cap = newTitle + " : AudioPlayerJS";
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