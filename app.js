//jshint esversion : 6
require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const nodeMailer = require('nodemailer');
const expressMailer = require('express-mailer');
const mongoose = require('mongoose');
const fs = require('fs');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const session = require('express-session');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate');
//const bcrypt = require('bcrypt');
//const saltRounds = 10;
//const md5 = require('md5');
// const request = require('request');

let app = express();
app.use(express.static("Public"));
app.use(bodyParser.urlencoded({extended : true}));
app.set("view engine" , "ejs");

app.use(session({
  secret : "This is our little secret.",
  resave : false,
  saveUninitialized : false,
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:10/auth/google/index",
    userProfileUrl: "https://www.googleapis.com/oauth2/v3/userinfo",
  },
  function(accessToken, refreshToken, profile, cb) {
    Meeting.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

mongoose.connect("mongodb://localhost:27017/minutesDB" , {useNewUrlParser : true});
mongoose.connect("mongodb://localhost:27017/minuteUserDB" , {useNewUrlParser : true});
mongoose.set('useCreateIndex' , true);

let a;
let b,c,p,q,d;
let itemsOne = [];
let itemsTwo = [];
let itemsThree = [];
let itemsFour = [];
let itemsFive = [];
let itemsSix = [];
let sender;

app.listen(10 , function(){
  console.log("A server is set upt port 10");
});

// app.get("/" , function(req , res){
//   res.sendFile(__dirname + "/index.html");
//
// });
const meetingsSchema = new mongoose.Schema({
  minuteTakerEmail: {
    type: String,
    trim: true,
    lowercase: true,
    // unique: true,
    //required: 'Email address is required',
  },
  invitedEmail: {
    type: String,
    trim: true,
    lowercase: true,
    // unique: true,
    //required: 'Email address is required',
  },
  Agenda: String,
  Venue: String,

  Date: {
    type: Date,
    min: 2020-03-01,
  },


    email : {
      type : String,
    },
    password : {
      type : String,
    },
    googleId : String,

});

const minuteUserSchema = new mongoose.Schema({
  minuteTakerEmail: {
    type: String,
    trim: true,
    lowercase: true,
    // unique: true,
    //required: 'Email address is required',
  },
  invitedEmail: {
    type: String,
    trim: true,
    lowercase: true,
    // unique: true,
    //required: 'Email address is required',
  },
  Agenda: String,
  Venue: String,

  Date: {
    type: Date,
    min: 2020-03-01,
  },
  key : String,
  user : String,
});

meetingsSchema.plugin(passportLocalMongoose);
meetingsSchema.plugin(findOrCreate);

const Meeting = mongoose.model("Meeting" , meetingsSchema);
const Minuteuser = mongoose.model("Minuteuser" , minuteUserSchema);

passport.use(Meeting.createStrategy());
passport.serializeUser(function(user, done) {
  done(null, user.id);
});
passport.deserializeUser(function(id, done) {
  Meeting.findById(id, function(err, user) {
    done(err, user);
  });
});

app.post("/register" , function(req , res){
  // bcrypt.hash(req.body.pass , 10 , function(err, hash) {
  //   const anyUser = new User({
  //     email : req.body.email,
  //     password : hash,
  //   });
  //   anyUser.save(function(err){
  //     if(!err){
  //         res.redirect("/index");
  //     }
  //     else{
  //       console.log(err);
  //     }
  //   });
  // });
  Meeting.register({username : req.body.username} , req.body.password , function(err , user){
    if(err){
      console.log(err);
      res.redirect("/register");
    }
    else{
        passport.authenticate("local")(req , res , function(){
        res.redirect("/index");
      });
    }
  });
});

app.post("/login" , function(req , res){
  // User.findOne({email : req.body.email} , function(err , userItem){
  //   if(!err){
  //     if(userItem){
  //       bcrypt.compare(req.body.password , userItem.password , function(err , result) {
  //
  //           if(result === true){
  //             res.redirect("/index");
  //             }
  //             else{
  //               res.redirect("/login");
  //             }
  //
  //         });
  //   }
  // }
  // });
  const user = new Meeting({
    username : req.body.username,
    password : req.body.password,
  });

  req.login(user , function(err){
    if(err){
      console.log(err);
    }
    else{
      passport.authenticate("local")(req , res , function(){
        res.redirect("/index");
      });
    }
  });
});

app.get("/logout" , function(req , res){
  req.logout();
  res.redirect("/home");
});

app.get("/auth/google",
  passport.authenticate('google', { scope: ["profile"] }));

app.get("/auth/google/index",
  passport.authenticate("google" , { failureRedirect: "/login" }),
  function(req, res) {
    res.redirect("/index");
  });


app.get("/list" , function(req , res){
  if(req.isAuthenticated()){
    Minuteuser.find({key: req.user.id} , function(err , meetings){
      if(!err){
      if(meetings.length === 0){
        res.redirect("/copy");
      }
      else{
         //res.render("list" , {itemList : itemsOne , itemTakerEmail : minuteTakerEmail , itemAttendeesEmail : itemsThree , totalMeetings : meetings});
      res.render("list" , {totalMeetings : meetings});
      }
    }
  });
  }

  else{
    res.redirect("/login");
  }

});

app.get("/" , function(req , res){
  res.sendFile(__dirname + "/copy.html");
});

app.get("/index" , function(req , res){
  if(req.isAuthenticated()){
    res.sendFile(__dirname + "/index.html");
  }
  else{
    res.redirect("/login");
  }
});

app.post("/" , function(req , res){
  if(req.body.free === 'x'){

    res.redirect("/home");                                                      // res.redirect("/index");

  }
  else{
    res.sendFile(__dirname + "/over.html");
    app.post("/copy" , function(req , res){
      res.redirect("/");
    });

  }
});

app.get("/home" , function(req , res){
  res.render("home");
});

app.post("/home" , function(req , res){
  if(req.body.register === "register"){
    res.redirect("/register");
  }
  else{
    res.redirect("/login");
  }
});

app.get("/register" , function(req , res){
  res.render("register");
});

app.get("/login" , function(req , res){
  res.render("login");
});

app.post("/index" , function(req , res){

  var x = new Date();

  var t = console.log(x.toISOString().slice(0,10));
                                                    // y = (req.body.initial+'T00:00:00-0500');
                                                    // console.log(Math.floor(new Date("2020-01-01").getTime()/1000));
  y=Math.floor(new Date(req.body.initial).getTime()/1000);
  z=Math.floor(new Date(x.toISOString().slice(0,10)).getTime()/1000);
                                                    // console.log(Date.parse(y) + " " + Date.now());
   console.log(y + " " + z);


  if(y < Date.now())
  {
                                                  // res.sendFile(__dirname + "/over.html");
    console.log("Hello");
  }
  else
  {
      console.log("world");

  }
  a = req.body.date;
  itemsOne.push(a);
  b = req.body.taker;
  itemsTwo.push(b);
  c = req.body.attendees;
  itemsThree.push(c);
  d = req.body.initial;
  itemsFour.push(d);

  sender = req.body.taker;
  console.log(sender);
  console.log(itemsThree);
//
//
  let output = `
    <h4>You are invited in a meeting</h4>
    <h3>Meeting Details : </h3><br>
    <ul>
      <li>Invitees : ${c}</li>
      <li>Agenda : ${req.body.about}</li>
      <li>Date : ${req.body.date}</li>
      <li>Time : ${itemsFour}</li>
      <li>Venue : ${req.body.note}</li>
    </ul>
    <p>You are kindly requested to attend the meeting on the above mentioned date and time.</p>
    ;`

  let transporter = nodeMailer.createTransport({

    service: "gmail",
    host: 'smtp.gmail.com',                                 // hostname
    secureConnection: true,                                 // use SSL
    port: 465,                                              // port for secure SMTP
    transportMethod: 'SMTP',                                // default is SMTP. Accepts anything that nodemailer accepts
    pool : true,
    auth: {
      user: 'prashantshekhar21102001@gmail.com',
      pass: process.env.Password,
    }
  });

  let mailOptions = {
    from : '"Prashant" <prashantshekhar21102001@gmail.com>',
    to :    c,
    subject : 'Minutes.io',
    text : 'Hello world',
    html : output,
  };

  transporter.sendMail(mailOptions, function(error,info){
    if(error){
      return console.log(error);
    }
    else {
    console.log('Email sent: ' + info.response);
  }
                                                              // console.log("Message sent : %s",info.messageId);
                                                              // console.log("preview URL : %s",nodeMailer.getTestMessageUrl(info));
  });



  p = req.body.about;
  itemsFive.push(p);
  q = req.body.note;
  itemsSix.push(q);

  console.log(req.user.id);
  Meeting.findById(req.user.id , function(err , foundUser){
    if(err){
      console.log(err);
    } else {
      if(foundUser){
        console.log("User Found");
        foundUser.minuteTakerEmail = 'prashantshekhar21102001@gmail.com';
        foundUser.invitedEmail = c;
        foundUser.Agenda = p;
        foundUser.Venue = q;
        foundUser.Date = a;
        foundUser.save();
        // function(){
        //   res.redirect("/index");
        // });
      }
    }
    });
        const meetingOne = new Minuteuser({
            key: req.user.id,
           minuteTakerEmail: 'prashantshekhar21102001@gmail.com',
           invitedEmail: c,
           Agenda: p,
           Venue: q,
           Date: a,
           user: req.user.username,
        });

         //function(){
         //    res.redirect("/index");
         //  });
         if(req.body.file === 'submit'){
           meetingOne.save();
           res.redirect("/index");
         }

         // else if(req.body.button === 'publish'){
         else{
            res.redirect("/list");
        }

        });


        //});
      //   const meetingOne = new Minuteuser({
      //   minuteTakerEmail: 'prashantshekhar21102001@gmail.com',
      //   invitedEmail: c,
      //   Agenda: p,
      //   Venue: q,
      //   Date: a,
      // });
       //meetingOne.save();



  //
  // if(req.isAuthenticated()){
  //
  // else{
  //   res.redirect("/login");
  // }


var updateId;
app.post("/list" , function(req,res){
  var meetingId = req.body.checkbox;
  updateId = req.body.updateButton;
  console.log(meetingId);
  console.log(updateId);
  if(req.body.doneone === "one")
  {
    res.sendFile(__dirname + "/success.html");
  }
  else if(req.body.donetwo === "two"){
    res.redirect("/index");
  }

  else{
    res.redirect("/update");
  }
  });

app.get("/update" , function(req , res){
  if(req.isAuthenticated()){
    res.sendFile(__dirname + "/update.html");
  }
  else{
    res.redirect("/login");
  }

});

var testEmail;
var testAgenda;
var testDate;
var testVenue;
let em , ag , da,ti,ve;
app.post("/update" , function(req , res){
//     testEmail = req.body.updateInvitees;
//     testAgenda = req.body.updateAgenda;
//     testDate = req.body.updateDate;
//     testTime = req.body.updateTime;
//     testVenue = req.body.updateVenue;
//     // data = data.toString().replace(/\{\{someVal\}\}/, 'your value here');
//
    if(req.body.updateDelete === 'delete'){
      // Meeting.findOne({_id : updateId} , function(err , foundMeetings){
      //     if(err){
      //       console.log(err);
      //     }
      //     else{
      //         if(!foundMeetings){
      //           console.log("Doesn't Exists");
      //
      //         }
      //         else{
      //           console.log("Exists");
      //           // res.render("list", {listTitle: foundList.name, newListItems: foundList.items});
      //           da = foundMeetings.Date;
      //           em = foundMeetings.invitedEmail;
      //         }
      //     }
      // });

        let outputDelete = `
          <h4>Your meeting on has been canceled. </h4><br>
          <h2>Stay tuned for further update</h2>
          ;`

        let transporter = nodeMailer.createTransport({
                                                                  // from: 'prashantshekhar28102001@gmail.com',
          service: "gmail",
          host: 'smtp.gmail.com',                                 // hostname
          secureConnection: true,                                 // use SSL
          port: 465,                                              // port for secure SMTP
          transportMethod: 'SMTP',                                // default is SMTP. Accepts anything that nodemailer accepts
          pool : true,
          auth: {
            // type: "OAuth2",
            user: 'prashantshekhar21102001@gmail.com',
            pass: 'prashantshekhar28102001'
          }
        });

                                                                // hitmanshekhar28102001@gmail.com
        let mailOptions = {
            from : '"Prashant" <prashantshekhar21102001@gmail.com>',
            to : "hitmanshekhar28102001@gmail.com",
            // testEmail,
            subject : 'Minutes.io',
            text : 'Hello world',
            html : outputDelete,
          };


      Minuteuser.deleteOne({key: req.user.id , _id : updateId} , function(err){
        if(err){
          console.log(err);
        }
        else{

          res.redirect("/list");
        }
          });
    }

    else{
      if(req.body.i === 'jyoti'){
        res.redirect("/venue");
      }
      else if(req.body.h === 'raj'){
        res.redirect("/agenda");
      }
      else if(req.body.j === 'anshu'){
        res.redirect("/time");
      }
      else if(req.body.k === 'ishu'){
        res.redirect("/date");
      }
      else if(req.body.g === 'aman'){
        res.redirect("/invitees");
      }
      else{
        res.redirect("/list");
      }
    }




app.get("/venue" , function(req , res){
  res.sendFile(__dirname + "/updatevenue.html");
});


app.post("/venue" , function(req , res){
  testVenue = req.body.update;
  Minuteuser.updateOne({key: req.user.id , _id : updateId} , {Venue : testVenue} , function(err){
    if(err){
      console.log(err);
    }
    else{
      console.log("Successfully Updated");
      res.redirect("/update");
    }
  });
});

app.get("/agenda" , function(req , res){
  res.sendFile(__dirname + "/updateagenda.html");
});

app.post("/agenda" , function(req , res){
  testAgenda = req.body.updateag;
  Minuteuser.updateOne({key: req.user.id , _id : updateId} , {Agenda : testAgenda} , function(err){
    if(err){
      console.log(err);
    }
    else{
      console.log("Successfully Updated");
      res.redirect("/update");
    }
  });
});

app.get("/time" , function(req , res){
  res.sendFile(__dirname + "/updatetime.html");
});

app.post("/time" , function(req , res){
  testTime = req.body.updateti;
  Minuteuser.updateOne({key: req.user.id , _id : updateId} , {Time : testTime} , function(err){
    if(err){
      console.log(err);
    }
    else{
      console.log("Successfully Updated");
      res.redirect("/update");
    }
  });
});

app.get("/date" , function(req , res){
  res.sendFile(__dirname + "/updatedate.html");
});

app.post("/date" , function(req , res){
  testDate = req.body.updateda;
  Minuteuser.updateOne({key: req.user.id , _id : updateId} , {Date : testDate} , function(err){
    if(err){
      console.log(err);
    }
    else{
      console.log("Successfully Updated");
      res.redirect("/update");
    }
  });
});

app.get("/invitees" , function(req , res){
  res.sendFile(__dirname + "/updateinvitees.html");
});

app.post("/invitees" , function(req , res){
  testInvitees = req.body.updatein;
  Minuteuser.updateOne({key: req.user.id , _id : updateId} , {invitedEmail : testInvitees} , function(err){
    if(err){
      console.log(err);
    }
    else{
      console.log("Successfully Updated");
      res.redirect("/update");
    }
  });
});

Minuteuser.findOne({key: req.user.id , _id : updateId} , function(err , foundMeetings){
    if(err){
      console.log(err);
    }
    else{
        if(!foundMeetings){
          console.log("Doesn't Exists");

        }
        else{
          console.log("Exists");
          // res.render("list", {listTitle: foundList.name, newListItems: foundList.items});
          em = foundMeetings.invitedEmail;
          ag = foundMeetings.Agenda;
          da = foundMeetings.Date;
          ti = foundMeetings.Time;
          ve = foundMeetings.Venue;
          console.log(ag);
        }
    }
});

let outputUpdated = `
  <h4>Your previous meeting has been updated</h4>
  <h3>Meeting Details : </h3><br>
  <ul>
    <li>Invitees : ${em}</li>
    <li>Agenda : ${ag}</li>
    <li>Date : ${da}</li>

    <li>Venue : ${ve}</li>
  </ul>
  <p>You are kindly requested to attend the meeting on the above mentioned date and time.</p>
  ;`


let transporter = nodeMailer.createTransport({

  service: "gmail",
  host: 'smtp.gmail.com',                                 // hostname
  secureConnection: true,                                 // use SSL
  port: 465,                                              // port for secure SMTP
  transportMethod: 'SMTP',                                // default is SMTP. Accepts anything that nodemailer accepts
  pool : true,
  auth: {
    // type: "OAuth2",
    user: 'prashantshekhar21102001@gmail.com',
    pass: process.env.Password,
  }
});

                                                      
let mailOptions = {
    from : '"Prashant" <prashantshekhar21102001@gmail.com>',
    to : em,
    // testEmail,
    subject : 'Minutes.io',
    text : 'Hello world',
    html :  outputUpdated,
  };

if(req.body.mail === 'submit'){
  transporter.sendMail(mailOptions, function(error,info){
    if(error){
      return console.log(error);
    }
    else {
      console.log('Email sent: ' + info.response);
    }
  });
}
});


// *********************************************authenticate*********************************************************


// mongoose.connect("mongodb://localhost:27017/user" , {useNewUrlParser : true});
// mongoose.set('useCreateIndex' , true);

// const userSchema = new mongoose.Schema({
//
// });

// meetingsSchema.plugin(passportLocalMongoose);
// meetingsSchema.plugin(findOrCreate);

//const User = new mongoose.model("User" , userSchema);
//
// passport.use(Meeting.createStrategy());
// passport.serializeUser(function(user, done) {
//   done(null, user.id);
// });
// passport.deserializeUser(function(id, done) {
//   Meeting.findById(id, function(err, user) {
//     done(err, user);
//   });
// });
//
// app.post("/register" , function(req , res){
//   // bcrypt.hash(req.body.pass , 10 , function(err, hash) {
//   //   const anyUser = new User({
//   //     email : req.body.email,
//   //     password : hash,
//   //   });
//   //   anyUser.save(function(err){
//   //     if(!err){
//   //         res.redirect("/index");
//   //     }
//   //     else{
//   //       console.log(err);
//   //     }
//   //   });
//   // });
//   Meeting.register({username : req.body.username} , req.body.password , function(err , user){
//     if(err){
//       console.log(err);
//       res.redirect("/register");
//     }
//     else{
//         passport.authenticate("local")(req , res , function(){
//         res.redirect("/index");
//       });
//     }
//   });
// });
//
// app.post("/login" , function(req , res){
//   // User.findOne({email : req.body.email} , function(err , userItem){
//   //   if(!err){
//   //     if(userItem){
//   //       bcrypt.compare(req.body.password , userItem.password , function(err , result) {
//   //
//   //           if(result === true){
//   //             res.redirect("/index");
//   //             }
//   //             else{
//   //               res.redirect("/login");
//   //             }
//   //
//   //         });
//   //   }
//   // }
//   // });
//   const user = new Meeting({
//     username : req.body.username,
//     password : req.body.password,
//   });
//
//   req.login(user , function(err){
//     if(err){
//       console.log(err);
//     }
//     else{
//       passport.authenticate("local")(req , res , function(){
//         res.redirect("/index");
//       });
//     }
//   });
// });
//
// app.get("/logout" , function(req , res){
//   req.logout();
//   res.redirect("/home");
// });
//
// app.get("/auth/google",
//   passport.authenticate('google', { scope: ["profile"] }));
//
// app.get("/auth/google/index",
//   passport.authenticate("google" , { failureRedirect: "/login" }),
//   function(req, res) {
//     res.redirect("/index");
//   });
