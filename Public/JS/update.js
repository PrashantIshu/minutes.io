$("#inviteesEmail").click(function() {
  addinvitees();
  $("#inviteesEmail").html(" ");
});

function addinvitees() {
  $("#p1").append('<input type="text" class="form-control a" id="inputEmail3" name="updatein" placeholder="name and email addresses" autocomplete="off" pattern="^[\W]*([\w+\-.%]+@[\w\-.]+\.[A-Za-z]{2,4}[\W]*,{1}[\W]*)*([\w+\-.%]+@[\w\-.]+\.[A-Za-z]{2,4})[\W]*$">' +
    '<button type="submit" class="click btn btn-sm btn-light" name="button" value="invitees">Update</button>');
};

$("#date").click(function() {
  addDate();
  $("#date").html(" ");
});

function addDate() {
  $("#p5").append('<input type="date" class="form-control date" id="inputEmail3" name="updateda" placeholder="enter date" autocomplete="off">' +
    '<button type="submit" class="click btn btn-sm btn-light" name="dt" value="date">Update</button>');
};

$("#agenda").click(function() {
  addAgenda();
  $("#agenda").html(" ");
});

function addAgenda() {
  $("#p2").append('<input type="text" class="form-control agenda" id="inputEmail3" name="updateag" placeholder="about the meeting" autocomplete="off">' +
    '<button type="submit" name="ag" class="click btn btn-sm btn-light" value="agenda">Update</button>');
};

$("#venue").click(function() {
  addVenue();
  $("#venue").html(" ");
});

function addVenue() {
  $("#p3").append('<input type="text" class="form-control agenda" name="update" placeholder="enter venue" autocomplete="off">' +
    '<button type="submit" name="ve" class="click btn btn-sm btn-light" value="venue">Update</button>');
};

$("#time").click(function() {
  addTime();
  $("#time").html(" ");
});

function addTime() {
  $("#p4").append('<input type="time" class="form-control time" id="inputEmail3" name="updateyi" placeholder="enter time" autocomplete="off">' +
    '<button type="submit" name="ti" class="click btn btn-sm btn-light" value="time">Update</button>');
};
