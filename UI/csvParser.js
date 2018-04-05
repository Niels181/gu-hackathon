    var csvData;
    window.onload = function() {
        var fileInput = document.getElementById('fileInput');
        var fileDisplayArea = document.getElementById('fileDisplayArea');

        fileInput.addEventListener('change', function(e) {
            var file = fileInput.files[0];
            var textType = /text.*/;

            var reader = new FileReader();

            reader.onload = function(e) {
                fileDisplayArea.innerText = reader.result;
                csvData = $.csv.toObjects(reader.result);
                console.log(csvData);
            }

            console.log(file);
            reader.readAsText(file); 
        });
    }