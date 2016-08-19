$(document).ready(function () {
  getBooks();
  // add a book
  $('#book-submit').on('click', postBook);
  //update a book
  $('#book-list').on('click', '.update', putBook);
  //delte button
  $('#book-list').on('click', '.delete', deleteBook);
  //get specific genre of book
   $("#sort").on('click', function(){
    var tester = $("select.genre option:selected").val();

    console.log(tester);
    selectGenre(tester);
  });

  //$('.:selected').on('click', selectGenre("Action/Fantasy"));
});
/**
 * Retrieve books from server and append to DOM
 */
function getBooks() {
  $.ajax({
    type: 'GET',
    url: '/books',
    success: function (books) {
      console.log('GET /books returns:', books);
      //Want to use inputs
      appendBooks(books);
    },

    error: function (response) {
      console.log('GET /books fail. No books could be retrieved!');
    },
  });
}

  function appendBooks(books){
books.forEach(function (book) {
  var $el = $('<div></div>');

  var bookProperties = ['title', 'author', 'published', 'genre'];

  bookProperties.forEach(function(property){
    var inputType ='text';
    if(property == 'published'){
      inputType = 'date';
      book[property] = new Date(book[property]);
    }
    var $input = $('<input type="text" id="' + property + '"name="' + property + '"/>');
    $input.val(book[property]);
    $el.append($input);
  });

$el.data('bookId', book.id);
$el.append('<button class="update">Update</button>');
$el.append('<button class="delete">Delete</button>');

$('#book-list').append($el);
});
}
/**
 * Add a new book to the database and refresh the DOM
 */
function postBook() {
  event.preventDefault();

  var book = {};

  $.each($('#book-form').serializeArray(), function (i, field) {
    book[field.name] = field.value;
  });

  console.log('book: ', book);

  $.ajax({
    type: 'POST',
    url: '/books',
    data: book,
    success: function () {
      console.log('POST /books works!');
      $('#book-list').empty();
      getBooks();
    },

    error: function (response) {
      console.log('POST /books does not work...');
    },
  });
}

  function putBook(){
    var book = {};
    var inputs = $(this).parent().children().serializeArray();
    $.each(inputs, function(i, field){
      book[field.name] = field.value;
    });
    console.log("Hey");

var bookId = $(this).parent().data('bookId');

$.ajax({
  type: 'PUT',
  url: '/books/' + bookId,
  data: book,
  success: function(){
    $('#book-list').empty();
    getBooks();
  },
  error: function(){
  console.log("Error PUT /books/" + bookId);
  },
});
}

function deleteBook(){
  var bookId = $(this).parent().data('bookId');
  $.ajax({
    type: 'DELETE',
    url: '/books/' + bookId,
    success: function(){
      console.log('Success');
      $('#book-list').empty();
      getBooks();
    },
    error: function(){
      console.log("Failed");
    }
  });
}//deleteBook

function selectGenre(genre){

  $.ajax({
    type: 'GET',
    url: '/select/' + genre,
    success: function(book){
    console.log('Does this work?:', book);
    $('#book-list').empty();
    appendBooks(book);
  },
  error: function() {
    console.log("BLEEP");
  }
  });
}
