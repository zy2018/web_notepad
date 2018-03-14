/*! Minimalist Web Notepad | https://github.com/pereorga/minimalist-web-notepad */

function uploadContent() {

    if (content !== textarea.value) {
        document.getElementById('saved').style.display='none';
        // Text area value has changed.
        var temp = textarea.value;
        var data = temp;
        var request = new XMLHttpRequest();
        request.open('POST', window.location.href, true);
        if(data.length > 50){
            data = pako.gzip(data, {to: "string"});
            data = btoa(data);
            request.setRequestHeader('Content-Encoding','gzip');
        }
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');

        request.onload = function() {

            if (request.readyState === 4) {

                // Request has ended, check again after 1 second.
                content = temp;
                setTimeout(uploadContent, 1000);
            }

            document.getElementById('saved').style.display='';
        }

        request.onerror = function() {

            // On connection error, try again after 1 second.
            setTimeout(uploadContent, 1000);
        }

        // Send the request.
        request.send('data=' + encodeURIComponent(data));

        // Make the content available to print.
        printable.removeChild(printable.firstChild);
        printable.appendChild(document.createTextNode(data));
    }
    else {

        // Content has not changed, check again after 1 second.
        setTimeout(uploadContent, 1000);
    }
}

var textarea = document.getElementById('content');
var printable = document.getElementById('printable');
var content = textarea.value;

// Make the content available to print.
printable.appendChild(document.createTextNode(content));

// Enable TABs to indent. Based on https://stackoverflow.com/a/14166052/1391963
textarea.onkeydown = function(e) {
    if (e.keyCode === 9 || e.which === 9) {
        e.preventDefault();
        var s = this.selectionStart;
        this.value = this.value.substring(0, this.selectionStart) + '\t' + this.value.substring(this.selectionEnd);
        this.selectionEnd = s + 1;
    }
}

textarea.focus();

uploadContent();
