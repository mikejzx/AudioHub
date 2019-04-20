
function slidersInitialise() {
    document.getElementById("slider-volume-ctrl").oninput = () => {
        var x = this.value / 100.0;
        // TODO: Allow user to select a volume 
        // scale curve (linear, logarithmic)
        audio.volume = x * x;
    }

    document.getElementById("slider-playback-ctrl").oninput = () => {
        // TODO: Change playback pos based on this.
    }
}