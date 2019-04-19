
function slidersInitialise() {
    var sliderVolume = document.getElementById("slider-volume-ctrl");
    sliderVolume.oninput = function () {
        var x = this.value / 100.0;
        // TODO: Allow user to select a volume 
        // scale curve (linear, logarithmic)
        audio.volume = x * x;
    }
}