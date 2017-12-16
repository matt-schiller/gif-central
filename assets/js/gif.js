//When topic button is clicked, render divs
$(document).on("click", ".btn-primary", function() {
  //Hide alert placeholder
  $(".alert").remove();
  var selectedTopic = $(this).text();
  var queryURL = "https://api.giphy.com/v1/gifs/search?q=" +
  selectedTopic + "&api_key=dc6zaTOxFJmzC&limit=10";
  $.ajax({
    url: queryURL,
    method: "GET"
  })
  .done(function(response) {
    var results = response.data;
    //Add a separator before new section
    $("#gif-column").prepend($("<hr>"));
    //Create each div, with gif as background image
    for (var i = 0; i < Math.min(results.length,9); i++) {
      var gifDiv = $("<div class='gif'>");
      gifDiv.css({"background-image": "url('"+results[i].images.fixed_height_still.url+"')"});
      gifDiv.attr("data-still",results[i].images.fixed_height_still.url);
      gifDiv.attr("data-animate",results[i].images.fixed_height.url);
      gifDiv.attr("data-state","still");
      gifDiv.append($("<span class='label label-info'>").text(response.data[i].rating));
      var copyImg = $("<img class='small-icon' src='assets/images/copy.svg'>");
      gifDiv.append($("<span class='label label-primary' data-toggle='tooltip' data-placement='bottom' data-original-title='Copy to clipboard'>").append(copyImg));
      //Add to parent column
      $("#gif-column").prepend(gifDiv);
    };
    });
});

//When gif is clicked, 'play' or 'pause' depending on state
$(document).on("click", ".gif", function() {
  var toggle = $(this).attr('data-state');
  if (toggle === 'still') {
    var newSrc = $(this).attr('data-animate');
    $(this).css({"background-image": "url('"+newSrc+"')"});
    $(this).attr('data-state', 'animate');
  } else {
    var newSrc = $(this).attr('data-still');
    $(this).css({"background-image": "url('"+newSrc+"')"});
    $(this).attr('data-state', 'still');
  };
});

//Load any saved custom gifs from local storage
if (localStorage.customGifs == undefined) {
  //Create a blank array
  var customGifs = [];
} else {
  //Parse out into array
  var customGifs = JSON.parse(localStorage.customGifs);
  //Create buttons
  for (i=0;i<customGifs.length;i++) {
    var topic = customGifs[i];
    var topicElement = $("<a class='btn btn-primary'>").text(topic);
    topicElement.append($("<a class='close'>"));
    $("#custom-panel").append(topicElement);
  };
}

//When new topic is submitted, create button and save in local storage
$(document).on("click", "#submit", function(event) {
  event.preventDefault();
  var newTopic = $("#newTopic").val();
  if(newTopic!=="") {
    var newTopicElement = $("<a class='btn btn-primary'>").text(newTopic);
    newTopicElement.append($("<a class='close'>"));
    $("#custom-panel").append(newTopicElement);
    customGifs.push(newTopic);
    //Save in local storage
    localStorage.customGifs = JSON.stringify(customGifs);
    //Clear input box
    $("#newTopic").val("");
  }
});

//Copy to clipboard
$(document).on("click", ".label-primary", function copyTextToClipboard(text) {
  //Create a temporary element to allow clipboard copying
  var textArea = document.createElement("textarea");
  textArea.value = $(this).parent().attr("data-animate");
  document.body.appendChild(textArea);
  textArea.select();
  //Error handling
  try {
    var successful = document.execCommand('copy');
    var msg = successful ? 'successful' : 'unsuccessful';
    console.log('Copying text command was ' + msg);
  } catch (err) {
    console.log('Oops, unable to copy');
  }
  document.body.removeChild(textArea);
  //Display success modal
  $('#copy-modal').modal('show');
});

//Initialize popovers for clipboard copy
$(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip(); 
});

//Clear local storage
$(document).on("click", "#clear", function(event) {
  event.preventDefault();
  $("#custom-panel").empty();
  localStorage.clear();
});