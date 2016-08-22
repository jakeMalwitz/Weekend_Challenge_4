$(document).ready(function () {

  getTasks();

  $('#task-submit').on('click', postTask);
  $('#task-list').on('click', '.complete', putTask);
  $('#task-list').on('click', '.delete', deleteTask);
  $('#completed').on('click', '.delete', deleteTask);

});

function getTasks() {
  $.ajax({
    type: 'GET',
    url: '/tasks',
    success: function (tasks) {
      appendTasks(tasks);
    },

    error: function (response) {
    console.log('Error @ GET', response)
    },
  });
}

  function appendTasks(tasks){
tasks.forEach(function (task) {
  console.log(task);
  var $el = $('<div></div>');

  var taskProperties = ['task', 'status'];

  taskProperties.forEach(function(property){
    var inputType ='text';
    var $input = $('<input type="text" id="' + property + '"name="' + property + '"/>');
    $input.val(task[property]);
    console.log(task[property]);
    $el.append($input);
  });

$el.data('taskId', task.id);
$el.append('<button class="complete">Complete</button>');
$el.append('<button class="delete">Delete</button>');


if(task.status == true){
  $('#completed').append($el);
  $('.complete').remove();
} else {
  $('#task-list').append($el);
}
});
}

function postTask() {
  event.preventDefault();

  var task = {};

  $.each($('#task-form').serializeArray(), function (i, field) {
    task[field.name] = field.value;
  });

  $.ajax({
    type: 'POST',
    url: '/tasks',
    data: task,
    success: function () {

      $('#task-list').empty();
      $('#completed').empty();
      getTasks();
    },

    error: function (response) {
      console.log('ERROR @ POST', response);
    },
  });
}

  function putTask(){
    var task = {};
    var inputs = $(this).parent().children().serializeArray();
    $.each(inputs, function(i, field){
      task[field.name] = field.value;
    });

var taskId = $(this).parent().data('taskId');

$.ajax({
  type: 'PUT',
  url: '/tasks/' + taskId,
  data: task,
  success: function(){
    $('#task-list').empty();
    $('#completed').empty();
    getTasks();
  },
  error: function(){
  console.log("ERROR @ PUT", taskId);
  }
});
}

function deleteTask(){

  if(confirm("ARE YOU SURE YOU WANT TO DELETE THIS ELEMENT?")) {
  var taskId = $(this).parent().data('taskId');
  $.ajax({
    type: 'DELETE',
    url: '/tasks/' + taskId,
    success: function(){
      console.log('Success');
      $('#task-list').empty();
      $('#completed').empty();
      getTasks();
    },
    error: function(){
      console.log("FAILURE");
    }
  });
}
}
