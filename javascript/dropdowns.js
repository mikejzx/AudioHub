
function initialiseDropdowns () {
    var btns = document.querySelectorAll(".dropdown-btn"),
    
    eachButton = function(callback) {
        Array.prototype.forEach.call(btns, function(e) {
            callback.call(this, e);
        });
    },
    initListener = function(e, b) {
        e.preventDefault();
        e.stopPropagation();
        eachButton((btn) => {
            btn.classList.remove("dropdown-open");
        });
        b.classList.toggle("dropdown-open");
    },
    hideAll = function() {
        eachButton((btn) => {
            btn.classList.remove("dropdown-open");
        });
    };

    // Show dropdown on button click
    eachButton((btn) => {
        btn.addEventListener("click", (e) => {
            initListener.call(this, e, btn);
        });
    });
    // Hide dropdowns when clicked
    document.addEventListener("click", hideAll);
}