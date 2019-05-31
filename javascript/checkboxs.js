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
        box.setAttribute("onclick", "check_checkbox(this); " + orig);
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
    console.log("toggling to " + box.hasAttribute("checked"));
    ipcRenderer.send("toggle_visualiserstate", box.hasAttribute("checked"));
}

function toggle_nativetitlebar (box) {
    ipcRenderer.send("toggle_nativetitlebar", box.hasAttribute("checked"));
}