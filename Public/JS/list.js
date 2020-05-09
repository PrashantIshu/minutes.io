
$("#inviteesEmail").click(function(){
  addOne();
});

var a=0;
function addOne() {
  if(a===0){
  $("#p1").append('<div class="form-group row">' +
    '<label for="inputEmail3" class="col-sm-2 col-form-label">Invitees Email</label>' +
    '<div class="col-sm-10">' +
      '<input type="text" class="form-control a" id="inputEmail3" name="updateInvitees" placeholder="name and email addresses" autocomplete="off" pattern="^[\W]*([\w+\-.%]+@[\w\-.]+\.[A-Za-z]{2,4}[\W]*,{1}[\W]*)*([\w+\-.%]+@[\w\-.]+\.[A-Za-z]{2,4})[\W]*$"> <i class="fas fa-times delete"></i> ' +
    '</div>' +
  '</div>');
    a++;}
    else{
      alert("Cannot append similar input type field more than once");
    }

};

$("#agenda").click(function(){
  addTwo();
});

var b=0;
function addTwo() {
  if(b === 0){
  $("#p2").append('<div class="form-group row">' +
    '<label for="inputEmail3" class="col-sm-2 col-form-label">Agenda</label>' +
    '<div class="col-sm-10">' +
      '<input type="text" class="form-control agenda" id="inputEmail3" name="updateAgenda" placeholder="about the meeting" autocomplete="off"> <i class="fas fa-times delete"></i> ' +
    '</div>' +
  '</div>');
  b++;
  }
  else{
    alert("Cannot append similar input type field more than once");
  }

};

$("#venue").click(function(){
  addThree();
});

var c=0;
function addThree() {
  if(c === 0){
  $("#p3").append('<div class="form-group row">' +
    '<label for="inputEmail3" class="col-sm-2 col-form-label">Venue</label>' +
    '<div class="col-sm-10">' +
      '<input type="text" class="form-control venue" id="inputEmail3" name="updateVenue" placeholder="enter venue" autocomplete="off"> <i class="fas fa-times delete"></i>  ' +
    '</div>' +
  '</div>');
    c++;
  }
  else{
    alert("Cannot append similar input type field more than once");
  }
};

$("#time").click(function(){
  addFour();
});

var d=0;
function addFour() {
  if(d===0){
  $("#p4").append('<div class="form-group row">' +
    '<label for="inputEmail3" class="col-sm-2 col-form-label">Time</label>' +
    '<div class="col-sm-10">' +
      '<input type="time" class="form-control time" id="inputEmail3" name="updateTime" placeholder="enter time" autocomplete="off"> <i class="fas fa-times delete"></i>  ' +
    '</div>' +
  '</div>');
  d++
  }
  else{
    alert("Cannot append similar input type field more than once");
  }
};

$("#date").click(function(){
  addFive();
});

var e = 0;

function addFive() {
  if(e===0){
  $("#p5").append('<div class="form-group row">' +
    '<label for="inputEmail3" class="col-sm-2 col-form-label">Date</label>' +
    '<div class="col-sm-10">' +
      '<input type="date" class="form-control date" id="inputEmail3" name="updateDate" placeholder="enter date" autocomplete="off">' +
    ' <i class="fas fa-times delete"></i></div>' +
  '</div>');

  e++;
  }
  else{
    alert("Cannot append similar input type field more than once");
  }
};
