
function slidersInitialise() {
    var sliderVol = document.getElementById("slider-volume-ctrl");
    sliderVol.oninput = () => {
        var t0 = document.getElementById("slider-volume-ctrl");
        var x = t0.value / 100.0;

        // TODO: Allow user to select a volume 
        // scale curve (linear, logarithmic)
        audio.volume = x * x;

        // Move fill
        var y = t0.value + "% !important;"
        //var y = (100 * Math.pow(x, 0.75)) + "% !important";
        var t1 = document.getElementById("slider-volume");
        t1.getElementsByClassName("slider-fill")[0].setAttribute("style", "width: " + y);
        
        // Move thumb
        t1.getElementsByClassName("slider-thumb")[0].setAttribute("style", "left: " + y);
    };
    // Force update the initial width.
    sliderVol.oninput();

    var sliderPlayb = document.getElementById("slider-playback-ctrl");
    sliderPlayb.oninput = () => {
        var t0 = document.getElementById("slider-playback-ctrl");
        refreshPlaybackPos();
        // Change playback pos based on this.
        var frac = clamp(t0.value, 0.0, 1000.0) / 1000.0;
        audio.currentTime = frac * audio.duration;
    };
    sliderPlayb.oninput();
}

function clamp(v, min, max) {
    return v < min ? min : v > max ? max : v;
}

// Called every few ms to update the playback bar position in real-time
function sliderCallback() {
    var t0 = document.getElementById("slider-playback-ctrl");
    if (opened && t0 != null) {
        var completion = (audio.currentTime / audio.duration) * 1000.0;
        t0.value = completion;
        refreshPlaybackPos();
    }
}

function refreshPlaybackPos() {
    var t0 = document.getElementById("slider-playback-ctrl");
    var t1 = document.getElementById("slider-playback");
    var y = t0.value / 10.0 + "% !important;"
    t1.getElementsByClassName("slider-fill")[0].setAttribute("style", "width: " + y);
    t1.getElementsByClassName("slider-thumb")[0].setAttribute("style", "left: " + y);
}