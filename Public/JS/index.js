$(".others").click(function() {
  add();
  $(".others").html(" ");
});

// $(".about").click(function() {
//   adds();
//   $(".about").html(" ");
// });

function add() {
  $("#formone").append('<div class="form-group row">' +
    '<label for="inputEmail3" class="col-sm-2 col-form-label">Others</label>' +
    '<div class="col-sm-10">' +
      '<input type="text" class="form-control" id="inputEmail3" placeholder="name and email addresses" required autocomplete="off" pattern="^[\W]*([\w+\-.%]+@[\w\-.]+\.[A-Za-z]{2,4}[\W]*,{1}[\W]*)*([\w+\-.%]+@[\w\-.]+\.[A-Za-z]{2,4})[\W]*$">' +
    '</div>' +
  '</div>');
};

// <tr> <td> <label for="others">Others</label> </td> <td><input type="email" name="others" placeholder="Email"></td></tr>

// function adds() {
//   $("#formone").append('<div class="form-group row">' +
//     '<label for="inputEmail3" class="col-sm-2 col-form-label">Agenda</label>' +
//     '<div class="col-sm-10">' +
//       '<input type="email" class="form-control" id="inputEmail3" placeholder="about this meeting" autocomplete="off">' +
//     '</div>' +
//   '</div>');
// };
setInterval(function(){
let today = new Date();
let options = {
  // weekday : "long",
  month : "long",
  day : "numeric",
  year : "numeric",
  hour : "numeric",
  minute : "numeric",
  second : "numeric",
};
let day = today.toLocaleDateString("en-US" , options);
$(".current-time").html(day);
},1000);

var counter = 1;
$(".add").click(function() {
  // alert($("this").index()+1 + "" + $(".T-two tr").length-1);
  adding();
  counter++;
});


function adding() {

  $(".T-two-" + 1).append('<tr> <td>' +
      '<div class="dropdown">' +
      '<button class="btn btn-secondary dropdown-toggle btn-sm" type="button" id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
        'Todo' +
        '</button>' +
        '<div class="dropdown-menu" aria-labelledby="dropdownMenu2">' +
        '<button class="dropdown-item" type="button">AGENDA</button>' +
        '<button class="dropdown-item" type="button">DECISION</button>' +
        '<button class="dropdown-item" type="button">DONE</button>' +
        '<button class="dropdown-item" type="button">INFO</button>' +
        '<button class="dropdown-item" type="button">IDEA</button>' +
        '<button class="dropdown-item" type="button">TODO</button>' +
      '</div>' +
      '</div>' +
    '</td>' +

    '<td>' +
      '<div class="input-group input-group-sm mb-3">' +
      '<input type="text" class="form-control input-two" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" name="note">' +
      '</div>' +
    '</td>' +
// others
// about
// about
    '<td>' +
      '<div class="input-group input-group-sm mb-3">' +
      '<input type="time" class="form-control input-two" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" name="initial">' +
      '</div>' +
    '</td>' +

    '<td>' +
      // '<input type="date" class="due" name="cal">' +
      '<div class="input-group input-group-sm mb-3">' +
      '<input type="date" class="form-control input-two" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" name="date" min="2020-03-01">' +
      '</div>' +
    '</td>' +


   '</tr>');
};
var i =1;
$(".delete").click(function(){
  if(counter==1){
    return false;
  }
  $("tr").eq(counter).remove();
  counter--;
 });

$(".b").click(function(){
  value=$(this).val();
  $(".dropdown-toggle").val(value);
});

$(".dt").click(function(){
  x=$(".dt").val($(this).slice(0,11));
  alert(x);
});

//});
