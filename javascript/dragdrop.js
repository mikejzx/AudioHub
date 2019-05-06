/*
    Handles files being dragged into the window such
    as a file.
*/

// Was useful:
// https://www.htmlgoodies.com/html5/javascript/drag-files-into-the-browser-from-the-desktop-HTML5.html
function initialiseDragDrop () {
    if (window.FileReader) {
        console.log("FileReader is supported");

        // For the queue
        var dropZone = document.getElementById("tracklist-main");
        function cancel(e) {
            if (e.preventDefault) { e.preventDefault(); }
            return false;
        }

        // Tell browser that this target is droppable
        dropZone.addEventListener("dragover", cancel);
        dropZone.addEventListener("dragenter", cancel);

        dropZone.addEventListener("drop", (e) => {
            if (e.preventDefault) { e.preventDefault(); }
            console.log("drop");

            var files = e.dataTransfer.files;
            for (var i = 0; i < files.length; ++i) {
                var reader = new FileReader();

                // Open the files into the queue
                for (let file of e.dataTransfer.files) {
                    console.log("Dragged on: " + file.path);
                    audioOpen(file.path);
                }

                reader.readAsDataURL(files[i]);
            }
            return false;
        });
    }
    else {
        console.log("FileReader not supported...");
    }
}