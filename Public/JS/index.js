

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

var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1;
var yyyy = today.getFullYear();
if(dd<10){
  dd='0'+dd
} 
if(mm<10){
  mm='0'+mm
} 

today = yyyy+'-'+mm+'-'+dd;
document.getElementById("datefield").setAttribute("min", today);
