
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
        var t1 = document.getElementById("slider-playback");
        var y = t0.value + "% !important;"
        t1.getElementsByClassName("slider-fill")[0].setAttribute("style", "width: " + y);
        t1.getElementsByClassName("slider-thumb")[0].setAttribute("style", "left: " + y);

        // TODO: Change playback pos based on this.
    };
    sliderPlayb.oninput();
}