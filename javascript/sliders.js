
function slidersInitialise() {
    var sliderVol = document.getElementById("slider-volume-ctrl");
    sliderVol.oninput = () => {
        var t0 = document.getElementById("slider-volume-ctrl");
        var x = t0.value / 100.0;

        // TODO: Allow user to select a volume 
        // scale curve (linear, logarithmic)
        audio.volume = x * x;
        currentvolume = audio.volume;

        // Style fill-bar
        //var y = (100 * Math.pow(x, 0.75)) + "% !important";
        var y = t0.value + "% !important;"
        var t1 = document.getElementById("slider-volume");
        // Adjust colour from volume.
        var h = 150.0 - 100.0 * x; // Green to red
        var hsv = "hsl(" + h + ", 80%, 50%) !important";
        // Apply
        var fill = t1.getElementsByClassName("slider-fill")[0];
        fill.setAttribute("style", "width: " + y + "; background-color: " + hsv);
        
        // Move thumb
        t1.getElementsByClassName("slider-thumb")[0].setAttribute("style", "left: " + y);
    
        // Set volume label
        document.getElementById("slider-volume-label").innerHTML = t0.value + " % volume";
    };
    // Force update the initial width.
    sliderVol.oninput();

    var sliderPlayb = document.getElementById("slider-playback-ctrl");
    sliderPlayb.oninput = () => {
        if (opened) {
            var t0 = document.getElementById("slider-playback-ctrl");
            // Change playback pos based on this.
            var frac = clamp(t0.value, 0.0, 1000.0) / 1000.0;
            audio.currentTime = frac * audio.duration;
        }
        else {
            audio.currentTime = 0;
        }
        refreshPlaybackPos();
    };
    sliderPlayb.oninput();
}

function clamp(v, min, max) {
    return v < min ? min : v > max ? max : v;
}

// Called every few ms to update the playback bar position in real-time
function sliderCallback() {
    // Only applied to opened song
    if (!opened) { return; }

    // Update playback bar
    var t0 = document.getElementById("slider-playback-ctrl");
    if (t0 != null) {
        var completion = (audio.currentTime / audio.duration) * 1000.0;
        t0.value = completion;
        refreshPlaybackPos();
    }

    // Skip to next song if current is finished
    // (Greater than will add an additional check but it's safer :P)
    if (audio.currentTime >= audio.duration) {
        trackNext();
    }
}

function refreshPlaybackPos() {
    var t0 = document.getElementById("slider-playback-ctrl");
    var t1 = document.getElementById("slider-playback");
    var y = t0.value / 10.0 + "% !important;"
    t1.getElementsByClassName("slider-fill")[0].setAttribute("style", "width: " + y);
    t1.getElementsByClassName("slider-thumb")[0].setAttribute("style", "left: " + y);
}