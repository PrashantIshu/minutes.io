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
const FacebookStrategy = require('passport-facebook').Strategy;
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

passport.use(new FacebookStrategy({
    clientID: process.env.APP_ID,
    clientSecret: process.env.APP_SECRET,
    callbackURL: "http://localhost:10/auth/facebook/index"
  },
  function(accessToken, refreshToken, profile, cb) {
    Meeting.findOrCreate({ facebookId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

mongoose.connect("mongodb://localhost:27017/minutesDB" , {useNewUrlParser : true});
mongoose.connect("mongodb://localhost:27017/minuteUserDB" , {useNewUrlParser : true});
mongoose.set('useCreateIndex' , true);

let a;
let b,c,p,q,d;
let z,deletedEmail;
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
    email : {
      type : String,
    },
    password : {
      type : String,
    },
    googleId : String,
    facebookId : String,
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

app.get('/auth/facebook',
  passport.authenticate('facebook'));

app.get('/auth/facebook/index' ,
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/index');
});

app.get("/list" , function(req , res){
  if(req.isAuthenticated()){
    if(req.user.username === 'user@admin.com'){
      Minuteuser.find(function(err , meetings){
        if(!err){
          if(meetings.length === 0){
            res.redirect("/index");
          }
          else{
           //res.render("list" , {itemList : itemsOne , itemTakerEmail : minuteTakerEmail , itemAttendeesEmail : itemsThree , totalMeetings : meetings});
           res.render("list" , {totalMeetings : meetings});
         }
       }
     });
    }
    else{
      Minuteuser.find({key: req.user.id} , function(err , meetings){
        if(!err){
          if(meetings.length === 0){
            res.redirect("/index");
          }
          else{
           //res.render("list" , {itemList : itemsOne , itemTakerEmail : minuteTakerEmail , itemAttendeesEmail : itemsThree , totalMeetings : meetings});
           res.render("list" , {totalMeetings : meetings});
         }
       }
     });
    }
  }
  else{
    res.redirect("/login");
  }

});

app.get("/" , function(req , res){
  res.render("home");
});

app.get("/copy" , function(req , res){
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

  //var t = console.log(x.toISOString().slice(0,10));
                                                    // y = (req.body.initial+'T00:00:00-0500');
                                                    // console.log(Math.floor(new Date("2020-01-01").getTime()/1000));
  y=Math.floor(new Date(req.body.initial).getTime()/1000);
  z=Math.floor(new Date(x.toISOString().slice(0,10)).getTime()/1000);
                                                    // console.log(Date.parse(y) + " " + Date.now());
   console.log(y + " " + z);


  if(y < Date.now())
  {
                                                  // res.sendFile(__dirname + "/over.html");
    //console.log("Hello");
  }
  else
  {
      //console.log("world");

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
  //console.log(sender);
  //console.log(itemsThree);
//
//
  let output = `
    <h4>You are invited in a meeting</h4>
    <h3>Meeting Details : </h3><br>
    <ul>
      <li>Invitees : ${c}</li>
      <li>Agenda : ${req.body.about}</li>
      <li>Date : ${req.body.date}</li>
      <li>Time : ${req.body.initial}</li>
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

  //console.log(req.user.id);
  Meeting.findById(req.user.id , function(err , foundUser){
    if(err){
      console.log(err);
    } else {
      if(foundUser){
        //console.log("User Found");
        // foundUser.minuteTakerEmail = 'prashantshekhar21102001@gmail.com';
        // foundUser.invitedEmail = c;
        // foundUser.Agenda = p;
        // foundUser.Venue = q;
        // foundUser.Date = a;
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

var testEmail;
var testAgenda;
var testDate;
var testVenue;
var testInvitees;
var testTime;

app.post("/list" , function(req,res){
  var meetingId = req.body.checkbox;
  updateId = req.body.updateButton;
  //console.log(meetingId);
  //console.log(updateId);
  if(req.body.doneone === "one")
  {
    res.sendFile(__dirname + "/success.html");
  }
  else if(req.body.donetwo === "two"){
    res.redirect("/index");
  }

  else{

    Minuteuser.findOne({_id : updateId} , function(err , meeting){
      if(err){
        console.log(err);
      }
      else{
        if(meeting){
          //testEmail=meeting.invitedEmail;
          testAgenda=meeting.Agenda;
          testDate=meeting.Date;
          testVenue=meeting.Venue;
          testInvitees=meeting.invitedEmail;
          //testTime;
        }
      }
    });
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

// app.get("/venue" , function(req , res){
//   res.sendFile(__dirname + "/updatevenue.html");
// });
//
//
// app.post("/venue" , function(req , res){
//   testVenue = req.body.update;
//   Minuteuser.updateOne({key: req.user.id , _id : updateId} , {Venue : testVenue} , function(err){
//     if(err){
//       console.log(err);
//     }
//     else{
//       console.log("Successfully Updated");
//       res.redirect("/update");
//     }
//   });
// });

// app.get("/agenda" , function(req , res){
//   res.sendFile(__dirname + "/updateagenda.html");
// });
//
// app.post("/agenda" , function(req , res){
//   testAgenda = req.body.updateag;
//   Minuteuser.updateOne({key: req.user.id , _id : updateId} , {Agenda : testAgenda} , function(err){
//     if(err){
//       console.log(err);
//     }
//     else{
//       console.log("Successfully Updated");
//       res.redirect("/update");
//     }
//   });
// });

// app.get("/time" , function(req , res){
//   res.sendFile(__dirname + "/updatetime.html");
// });
//
// app.post("/time" , function(req , res){
//   testTime = req.body.updateti;
//   Minuteuser.updateOne({key: req.user.id , _id : updateId} , {Time : testTime} , function(err){
//     if(err){
//       console.log(err);
//     }
//     else{
//       console.log("Successfully Updated");
//       res.redirect("/update");
//     }
//   });
// });

// app.get("/date" , function(req , res){
//   res.sendFile(__dirname + "/updatedate.html");
// });
//
// app.post("/date" , function(req , res){
//   testDate = req.body.updateda;
//   Minuteuser.updateOne({key: req.user.id , _id : updateId} , {Date : testDate} , function(err){
//     if(err){
//       console.log(err);
//     }
//     else{
//       console.log("Successfully Updated");
//       res.redirect("/update");
//     }
//   });
// });

// app.get("/invitees" , function(req , res){
//   res.sendFile(__dirname + "/updateinvitees.html");
// });
//
// app.post("/invitees" , function(req , res){
//   testInvitees = req.body.updatein;
//   Minuteuser.updateOne({key: req.user.id , _id : updateId} , {invitedEmail : testInvitees} , function(err){
//     if(err){
//       console.log(err);
//     }
//     else{
//       console.log("Successfully Updated");
//       res.redirect("/update");
//     }
//   });
// });

console.log(testInvitees);
let em , ag , da,ti,ve;

app.post("/update" , function(req , res){

  if(req.body.updateDelete === 'delete'){
      Minuteuser.findOne({_id : updateId} , function(err , meeting){
        deletedEmail = meeting.invitedEmail;
        console.log(deletedEmail);
      let outputDelete = `
        <h2>Your meeting on has been canceled. </h2><br>
        <h4>Stay tuned for further update</h4>
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
          to : deletedEmail,
          subject : 'Minutes.io',
          text : 'Hello world',
          html : outputDelete,
        };



      transporter.sendMail(mailOptions, function(error,info){
        if(error){
          return console.log(error);
        }
        else {
          console.log('Email sent: ' + info.response);
        }
      });
    });

      Minuteuser.findByIdAndDelete({_id : updateId} , function(err , meeting){
        if(err){
          console.log(err);
        }
        else{
          if(meeting){
            deletedEmail = meeting.invitedEmail;
            res.redirect("/list");

          }
        }
      });
    }


    // else if(req.body.i === 'jyoti'){
    //     //res.redirect("/venue");
    //     testVenue = req.body.update;
    //     Minuteuser.updateOne({key: req.user.id , _id : updateId} , {Venue : testVenue} , function(err){
    //       if(err){
    //         console.log(err);
    //       }
    //       else{
    //         console.log("Successfully Updated");
    //         res.redirect("/update");
    //       }
    //     });
    //   }
      // else if(req.body.h === 'raj'){
      //   //res.redirect("/agenda");
      //   testAgenda = req.body.updateag;
      //   Minuteuser.updateOne({key: req.user.id , _id : updateId} , {Agenda : testAgenda} , function(err){
      //     if(err){
      //       console.log(err);
      //     }
      //     else{
      //       console.log("Successfully Updated");
      //       res.redirect("/update");
      //     }
      //   });
      // }
      // else if(req.body.j === 'anshu'){
      //   //res.redirect("/time");
      //   testTime = req.body.updateti;
      //     Minuteuser.updateOne({key: req.user.id , _id : updateId} , {Time : testTime} , function(err){
      //       if(err){
      //         console.log(err);
      //       }
      //       else{
      //         console.log("Successfully Updated");
      //         res.redirect("/update");
      //       }
      //     });
      // }
      // else if(req.body.k === 'ishu'){
      //   //res.redirect("/date");
      //   testDate = req.body.updateda;
      //   Minuteuser.updateOne({key: req.user.id , _id : updateId} , {Date : testDate} , function(err){
      //     if(err){
      //       console.log(err);
      //     }
      //     else{
      //       console.log("Successfully Updated");
      //       res.redirect("/update");
      //     }
      //   });
      // }
      //else if(req.body.g === 'aman'){
        //res.redirect("/invitees");




// Minuteuser.findOne({key: req.user.id , _id : updateId} , function(err , foundMeetings){
//     if(err){
//       console.log(err);
//     }
//     else{
//         if(foundMeetings){
//           em = foundMeetings.invitedEmail;
//           ag = foundMeetings.Agenda;
//           da = foundMeetings.Date;
//           ti = foundMeetings.Time;
//           ve = foundMeetings.Venue;
//         }
          //console.log(ag);

    else if(req.body.mail === 'submit'){
      let outputUpdated = `
        <h4>Your previous meeting has been updated</h4>
        <h3>Meeting Details : </h3><br>
        <ul>
          <li>Invitees : ${testInvitees}</li>
          <li>Agenda : ${testAgenda}</li>
          <li>Date : ${testDate}</li>
          <li>Venue : ${testVenue}</li>
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
  console.log(testInvitees);
  let mailOptions = {
    from : '"Prashant" <prashantshekhar21102001@gmail.com>',
    to : testInvitees,
    // testEmail,
    subject : 'Minutes.io',
    text : 'Hello world',
    html :  outputUpdated,
  };

  transporter.sendMail(mailOptions, function(error,info){
      if(error){
        return console.log(error);
      }
      else {
        console.log('Email sent: ' + info.response);
        res.redirect("/list")
      }
    });
  }

// else{
//   res.redirect("/list");
// }
else{

  if(req.body.button === "invitees"){
    testInvitees = req.body.updatein;
    console.log(testInvitees);
    Minuteuser.updateOne({_id : updateId} , {invitedEmail : testInvitees} , function(err){
      if(err){
        console.log(err);
      }
      else{
        console.log("Successfully Updated");
        res.redirect("/update");
      }
    });
  }


  else if(req.body.dt === "date"){
    testDate = req.body.updateda;
    Minuteuser.updateOne({_id : updateId} , {Date : testDate} , function(err){
      if(err){
        console.log(err);
      }
      else{
        console.log("Successfully Updated");
        res.redirect("/update");
      }
    });
  }

  else if(req.body.ve === "venue"){
    testVenue = req.body.update;
    Minuteuser.updateOne({_id : updateId} , {Venue : testVenue} , function(err){
      if(err){
        console.log(err);
      }
      else{
        console.log("Successfully Updated");
        res.redirect("/update");
      }
    });
  }

  else if(req.body.ag === "agenda"){
    testAgenda = req.body.updateag;
    Minuteuser.updateOne({_id : updateId} , {Agenda : testAgenda} , function(err){
      if(err){
        console.log(err);
      }
      else{
        console.log("Successfully Updated");
        res.redirect("/update");
      }
    });
  }

  else if(req.body.ti === "time"){
    testTime = req.body.updateti;
      Minuteuser.updateOne({_id : updateId} , {Time : testTime} , function(err){
        if(err){
          console.log(err);
        }
        else{
          console.log("Successfully Updated");
          res.redirect("/update");
        }
      });
  }
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
