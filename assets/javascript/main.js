// 
//
//
// 
// ^ Creating space for better readability


$(document).ready(function () { 
    
    // Firebase configuration
    var firebaseConfig = {
        apiKey: "AIzaSyCSnGhcwoJ88vyCbV75vFtp0UWoDkg8LNY",
        authDomain: "train-schedule-77f87.firebaseapp.com",
        databaseURL: "https://train-schedule-77f87.firebaseio.com",
        projectId: "train-schedule-77f87",
        storageBucket: "train-schedule-77f87.appspot.com",
        messagingSenderId: "652141792916",
        appId: "1:652141792916:web:ecb44d73bfaedde8316e81"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    var database = firebase.database();  
 
    // Button for adding train
    $("#add-train-btn").on("click", function (event) {
        // Keeps the page from refreshing (and resetting) when button is clicked
        event.preventDefault();
        // Resets clock so that it shows the current time
        clearInterval(setIntervalId);
        // Grabs user input
        var trainName = $("#train-name-input").val().trim();
        var trainDestination = $("#destination-input").val().trim();
        var trainStart = moment($("#start-input").val().trim(), "HH:mm").format("HH:mm");
        var trainFrequency = $("#frequency-input").val().trim();
        // Creates local "temporary" object for holding train data
        var newTrain = {
            name: trainName,
            destination: trainDestination,
            start: trainStart,
            frequency: trainFrequency
        };
        // Makes sure that the entry isn't empty
        if (trainName.length > 0 && trainDestination.length > 0 && trainStart.length > 0 && trainFrequency.length > 0) {
            // Uploads train data to the database
            database.ref().push(newTrain);
            $("tbody").empty();
            displayTime();
        }
        // Clears all of the text-boxes
        $("#train-name-input").val("");
        $("#destination-input").val("");
        $("#start-input").val("");
        $("#frequency-input").val("");
    });
    // Create Firebase event for adding employee to the database and a row in the html when a user adds an entry
    function displayTrain() {
        database.ref().on("child_added", function (childSnapshot) {
            // Stores database info into a variable.
            var trainName = childSnapshot.val().name;
            var trainDestination = childSnapshot.val().destination;
            var trainStart = childSnapshot.val().start;
            var trainFrequency = childSnapshot.val().frequency;
            //  Math for time until next train
            var firstTime = moment(trainStart, "HH:mm").format("hh:mm a");
            var tFrequency = parseInt(trainFrequency);
            // Difference between the times
            var diffTime = moment().diff(moment(trainStart, "HH:mm"), "minutes");
            // Time apart (remainder)
            var tRemainder = diffTime % tFrequency;
            // Minute Until Train
            var tMinutesTillTrain = tFrequency - tRemainder;
            // Next Train
            var nextTrain = moment().add(tMinutesTillTrain, "minutes").format("hh:mm a");
            // Creates the new row
            var newRow = $("<tr>")
            // creation for x to delete
            var removeX = $("<td>");
            removeX.attr("class", "delete")
            removeX.attr("data-key", childSnapshot.key)
            // if the train started before the current time... 
            if (diffTime > 0) {
                newRow.append(
                    $("<td>").text(trainName),
                    $("<td>").text(trainDestination),
                    $("<td>").text(firstTime),
                    $("<td>").text(trainFrequency + " mins"),
                    $("<td>").text(nextTrain),
                    $("<td>").text(tMinutesTillTrain + " mins"),
                    removeX.html("&#9746;")

                );
                newRow.attr("data-value", trainName);
                newRow.attr("class", trainName);
                $("#train-table > tbody").append(newRow);
            }
            // if the train is starting in a future time
            else {
                newRow.append(
                    $("<td>").text(trainName),
                    $("<td>").text(trainDestination),
                    $("<td>").text(firstTime),
                    $("<td>").text(trainFrequency + " mins"),
                    $("<td>").text(firstTime),
                    $("<td>").text(-1 * diffTime + " mins"),
                    removeX.html("&#9746;")
                );
                newRow.attr("data-value", trainName);
                newRow.attr("class", trainName);
                $("#train-table > tbody").append(newRow);
            }
        });
    };
    // delete button function
    $(document).on("click", ".delete", function () {
        var snapshotKey = $(this).attr("data-key");
        database.ref().child(snapshotKey).remove();
        displayTime();
    });
    // initialize the page
    $("#currentTime").html("<span>" + moment().format("hh:mm a") + "</span>")
    displayTrain();
    // updating the page to check most current time
    var setIntervalId = setInterval(displayTime, 10 * 1000);

    // updates all the times on the page
    function displayTime() {
        $("tbody").empty();
        setInterval(displayTime, 10 * 1000);
        $("#currentTime").html("<span>" + moment().format("hh:mm a") + "</span>");
        displayTrain();
    };
});