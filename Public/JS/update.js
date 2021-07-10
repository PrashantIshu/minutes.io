function addtaker(val) {
  $("#p0").append(`<input type="text" name="taker" value=${val} pattern="^[\W]*([\w+\-.%]+@[\w\-.]+\.[A-Za-z]{2,4}[\W]*,{1}[\W]*)*([\w+\-.%]+@[\w\-.]+\.[A-Za-z]{2,4})[\W]*$">`);
};

function addinvitees(val) {
  $("#p1").append(`<input type="text" name="attendees" value=${val} pattern="^[\W]*([\w+\-.%]+@[\w\-.]+\.[A-Za-z]{2,4}[\W]*,{1}[\W]*)*([\w+\-.%]+@[\w\-.]+\.[A-Za-z]{2,4})[\W]*$">`);
};

function addDate(val) {
  $("#p5").append(`<input type="date" name="date" value=${val}`);
};

function addAgenda(val) {
  alert(val);
  $("#p2").append(`<input type="text" name="about" value=${val}>`);
};

function addVenue(val) {
  $("#p3").append(`<input type="text" name="note" value=${val}>`);
};

function addTime(val) {
  $("#p4").append(`<input type="time" name="initial" value=${val}>`);
};