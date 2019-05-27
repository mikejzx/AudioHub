
// REMEMBER to call this on window body load.
function checkbox_initialise () {
    var boxes = document.getElementsByClassName("checkbox");
    for (var i = 0; i < boxes.length; ++i) {
        boxes[i].setAttribute("onclick", "check_checkbox(this);");
    }
}

function check_checkbox (box) {
    box.toggleAttribute("checked");
}