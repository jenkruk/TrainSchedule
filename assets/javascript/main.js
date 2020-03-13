// Steps to complete:

// 1. Initialize Firebase
// 2. Create button for adding new trains - then update the html + update the database
// 3. Create a way to retrieve trains from the train database.
// 4. Create a way to calculate the months worked. Using difference between start and current time.
//    Then use moment.js formatting to set difference in months.
// 5. Calculate Total billed

// 1. Initialize Firebase
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

// 2. Button for adding trains
$("#add-train-btn").on("click", function (event) {
  event.preventDefault();

  // Grabs user input
  var trainName = $("#train-name-input").val().trim();
  var destination = $("#destination-input").val().trim();
  var firtsTrainDeparts = moment($("#firstTrain-input").val().trim(), "MM/DD/YYYY").format("X");
  var departsEvery = $("#every-input").val().trim();

  // Creates local "temporary" object for holding train data
  var newTrain = {
    name: trainName,
    destination: trainDest,
    first: firstTime,
    departs: departsEvery,
  };

  // Uploads train data to the database
  database.ref().push(newTrain);

  // Logs everything to console
  console.log(newTrain.name);
  console.log(newTrain.destination);
  console.log(newTrain.first);
  console.log(newTrain.departs);

  alert("train successfully added");

  // Clears all of the text-boxes
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#first-input").val("");
  $("#departs-input").val("");
});

// 3. Create Firebase event for adding train to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function (childSnapshot) {
  console.log(childSnapshot.val());

  // Store everything into a variable.
  var trainName = childSnapshot.val().name;
  var trainDest = childSnapshot.val().destination;
  var firstTime = childSnapshot.val().first;
  var departsEvery = childSnapshot.val().departs;

  // train Info
  console.log(trainName);
  console.log(trainDest);
  console.log(firstTime);
  console.log(departsEvery);

  // Prettify the train firstTime result
  var firstTimePretty = moment.unix(firstTime).format("MM/DD/YYYY"); ///!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

  // Calculate the months worked using hardcore math
  // To calculate the months worked
  var empMonths = moment().diff(moment(firstTime, "X"), "months"); //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  console.log(empMonths);

  // 
  //var empBilled = empMonths * departsEvery; //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  // console.log(empBilled);

  // Create the new row
  var newRow = $("<tr>").append(
    $("<td>").text(trainName),
    $("<td>").text(trainDest),
    //$("<td>").text(firstTimePretty),
    //$("<td>").text(empMonths),
    $("<td>").text(departsEvery),
    //$("<td>").text(empBilled)
  );

  // Append the new row to the table
  $("#train-table > tbody").append(newRow);
});

// Example Time Math
// -----------------------------------------------------------------------------
// Assume train start date of January 1, 2015
// Assume current date is March 1, 2016

// We know that this is 15 months.
// Now we will create code in moment.js to confirm that any attempt we use meets this test case