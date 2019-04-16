
// Allows changing the pseudo style of an element
(function() {
    a = {
        _b: 0,
        c: function() {
            this._b++;
            return this.b;
        }
    };
    HTMLElement.prototype.pseudoStyle = function(d, e, f) {
        var g = "pseudoStyles";
        var h = document.head || document.getElementsByTagName('head')[0];
        var i = document.getElementById(g) || document.createElement('style');
        i.id = g;
        var j = "pseudoStyle" + a.c();
        if (!this.classList.contains(j)) {
            this.className += " " + j;
        }
        i.innerHTML += " ." + j + ":" + d + "{" + e + ":" + f + "}";
        h.appendChild(i);
        return this;
    };
})();

// https://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript/16245768#16245768
const base64toBlob = (b64Data, contentType = '', sliceSize = 512) => {
    const byteChars = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteChars.length; offset += sliceSize) {
        const slice = byteChars.slice(offset, offset + sliceSize);
        let len = slice.length;
        const byteNums = new Array(len);
        for (let i = 0; i < len; i++ ) {
            byteNums[i] = slice.charCodeAt(i);
        }
        byteArrays.push(new Uint8Array(byteNums));
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
}