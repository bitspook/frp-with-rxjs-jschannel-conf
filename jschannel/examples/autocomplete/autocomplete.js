// Search Wikipedia for a given term
'use strict';

function searchWikipedia(term) {
  return $.ajax({
    url: 'http://en.wikipedia.org/w/api.php',
    dataType: 'jsonp',
    data: {
      action: 'opensearch',
      format: 'json',
      search: window.encodeURI(term)
    }
  }).promise();
}

var $input = $('#textInput'),
    $results = $('#results');

// Get all distinct key up events from the input and only fire if long enough and distinct
var keyup = Rx.Observable.fromEvent($input, 'keyup').map(function (e) {
  return e.target.value;
}).filter(function (text) {
  return text.length > 2;
}).debounce(200 /* Pause for 200ms */).distinctUntilChanged(); // Only if the value has changed

var searcher = keyup.flatMapLatest(searchWikipedia);

var subscription = searcher.subscribe(function (data) {
  var res = data[1];

  // Append the results
  $results.empty();

  $.each(res, function (_, value) {
    $('<li>' + value + '</li>').appendTo($results);
  });
}, function (error) {
  // Handle any errors
  $results.empty();

  $('<li>Error: ' + error + '</li>').appendTo($results);
});
