// REMEMBER to call this on window body load.
function checkbox_initialise () {
    var boxes = document.getElementsByClassName("checkbox");
    for (var i = 0; i < boxes.length; ++i) {
        init_cbox(boxes[i]);
    }
}

function check_checkbox (box) {
    box.toggleAttribute("checked");
}

// Initialise the new checkbox passed in
function init_cbox(box) {
    if (box.hasAttribute("onclick")) {
        var orig = box.getAttribute("onclick");
        var semi = orig[orig.length - 1] == ";" ? "" : ";";
        box.setAttribute("onclick", orig + semi + " check_checkbox(this);");
    }
    else {
        box.setAttribute("onclick", "check_checkbox(this);");
    }
    var tick = document.createElement("div");
    tick.setAttribute("class", "checkbox-tick");
    box.appendChild(tick);
}

function toggle_visualiser(box) {
    //remote.getGlobal("bShowVisualiser") = box.hasAttribute("checked");
    ipcRenderer.send("toggle_visualiserstate", box.hasAttribute("checked"));
}