
function slidersInitialise() {
    var sliderVolume = document.getElementById("slider-volume-ctrl");
    sliderVolume.oninput = function () {
        audio.volume = this.value / 100;
    }
}