$(function () {

    var url = "https://southcentralus.api.cognitive.microsoft.com/customvision/v1.1/Prediction/cd6aa08e-e588-478a-a791-fc134595172f/image";
    var predictionKey = "a34ae72d4324428a85a4d2dc67a8e3bf";
    
    var fs = require("fs");
    var _ = require('underscore');

    // Store the value of a selected image for display
    var imageBytes;

    // Handle clicks of the Browse (...) button
    $("#select_button").click(function () {

        $('#analysisResults').html('');
        $('#analyze_button').prop('disabled', true);

        const electron = require('electron');
        const dialog = require('electron').dialog;

        var va = electron.remote.dialog.showOpenDialog();

        var contents = fs.readFileSync(va[0], "base64");
        imageBytes = fs.readFileSync(va[0]);

        $('#previewImage').html('<img width="240" src="data:image/png;base64,' + contents + '" />');
        $('#analyze_button').prop('disabled', false);

    });

    // Handle clicks of the Analyze button
    $("#analyze_button").click(function () {

        $.ajax({
            type: "POST",
            url: url,
            data: imageBytes,
            processData: false,
            headers: {
                "Prediction-Key": predictionKey,
                "Content-Type": "multipart/form-data"
            }
        }).done(function (data) {

            var predictions = data.Predictions;
            var hotDog = [predictions.find(o => o.Tag === 'hot dog')];
            var hotDogProb = hotDog[0].Probability;

            if (hotDogProb > .7) {
                $('#analysisResults').html('<div class="matchLabel">Hot Dog (' + (hotDogProb * 100).toFixed(0) + '%)' + '</div>');
            }
            else {
                $('#analysisResults').html('<div class="noMatchLabel">Not Hot Dog</div>');
            }

        }).fail(function (xhr, status, err) {
            alert(err);
        });

        $('#analyze_button').prop('disabled', true);
    });

});


