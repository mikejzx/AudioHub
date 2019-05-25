const StereoAnalyserNode = require("stereo-analyser-node");

var audioanalyser;
var audFreqDataL;
var audFreqDataR;

const vptcount = 64; // Number of visualiser points, must be multiple of 2, min is 16
var vpoints_l = []; // The actual point elements (left)
var vpoints_r = []; // The actual point elements (right)
var vptstyles = []; // Their 'embedded' styles

// Initialise the visualiser
function initialise_vis() {
    var ctx = new AudioContext();
    audioanalyser = new StereoAnalyserNode(ctx); //ctx.createAnalyser();
    var audiosrc = ctx.createMediaElementSource(audio);
    audiosrc.connect(audioanalyser);
    audiosrc.connect(ctx.destination);
    
    // Todo: check out analyser options here...
    audioanalyser.fftSize = vptcount * 8;

    audFreqDataL = new Uint8Array(audioanalyser.frequencyBinCount);
    audFreqDataR = new Uint8Array(audioanalyser.frequencyBinCount);

    // Create the visualiser points for left
    var visl = document.getElementById("vis-left");
    var visr = document.getElementById("vis-right");
    for (var i = 0; i < vptcount; ++i) {
        var pt = document.createElement("div");
        pt.setAttribute("class", "visualiser-point-left");

        var ptstyle 
            = "width: calc(var(--visualiser-pt-width) / " + vptcount + ");"
            + "left: calc(var(--visualiser-pt-width) / " + vptcount + " * " + i + ");";
        pt.setAttribute("style", ptstyle);
        visl.appendChild(pt);
        vpoints_l.push(pt);
        vptstyles.push(ptstyle);
    }
    // and right... (styles are reused)
    for (var i = 0; i < vptcount; ++i) {
        var pt = document.createElement("div");
        pt.setAttribute("class", "visualiser-point-right");
        pt.setAttribute("style", vptstyles[i]);
        visr.appendChild(pt);
        vpoints_r.push(pt);
    }

    // Start the visualiser
    setInterval(visualise, 1.0 / 60.0);
}

function visualise() {
    if (audio == null || !playing) {
        return; 
    }

    // Get frequencies.
    audioanalyser.getByteFrequencyData(audFreqDataL, audFreqDataR);
    
    for (var i = 0; i < vptcount; ++i) {
        // Left
        var hl = (audFreqDataL[i] / 255.0) * 90.0 * currentvolume;
        vpoints_l[i].setAttribute("style", vptstyles[i] + " height: " + hl + "% !important;");
        // Right
        var hr = (audFreqDataR[i] / 255.0) * 90.0 * currentvolume;
        vpoints_r[i].setAttribute("style", vptstyles[i] + " height: " + hr + "% !important;");
    }
}