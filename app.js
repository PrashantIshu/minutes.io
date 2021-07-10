
require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const nodeMailer = require('nodemailer');
const expressMailer = require('express-mailer');
const mongoose = require('mongoose');
const fs = require('fs');
const findOrCreate = require('mongoose-findorcreate');

let app = express();
app.use(express.static("Public"));
app.use(bodyParser.urlencoded({extended : true}));
app.set("view engine" , "ejs");

const DB = 'mongodb+srv://prashant:prashant21102001@cluster0-yfpqt.mongodb.net/meeting-app?retryWrites=true&w=majority';

mongoose.connect(DB , {
    useNewUrlParser : true,
    useCreateIndex : true,
    useFindAndModify : false,
    useUnifiedTopology: true ,
}).then(() => console.log("DB connection successfull"));

app.listen(10 , function(){
  console.log("A server is set upt port 10");
});

const meetingsSchema = new mongoose.Schema({
  taker: {
    type: String,
    // trim: true,
    // lowercase: true,
  },
  attendees: {
    type: String,
    // trim: true,
    // lowercase: true,
  },
  about: String,
  note: String,
  initial: String,
  date: String
});

const Meeting = new mongoose.model('Meeting', meetingsSchema);

app.get("/" , function(req , res){
  res.sendFile(__dirname + "/index.html");
});


app.post("/" , async function(req , res){
  const itemsThree = [];
  const c = req.body.attendees;
  itemsThree.push(c);

  const date = new Date(req.body.date);
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  if(day<10){
    day='0'+day;
  } 
  if(month<10){
    month='0'+month;
  } 
  const dateInDB = `${day}-${month}-${year}`;

  let output = `
    <h4>You are invited in a meeting</h4>
    <h3>Meeting Details : </h3><br>
    <ul>
      <li>Minute Taker : ${req.body.taker}</li>
      <li>Invitees : ${c}</li>
      <li>Agenda : ${req.body.about}</li>
      <li>Date : ${day}-${month}-${year}</li>
      <li>Time : ${req.body.initial}</li>
      <li>Venue : ${req.body.note}</li>
    </ul>
    <p>You are kindly requested to attend the meeting on the above mentioned date and time.</p>
    ;`

  let transporter = nodeMailer.createTransport({

    service: "gmail",
    host: 'smtp.gmail.com',                                
    secureConnection: true,                                
    port: 465,                                             
    transportMethod: 'SMTP',                               
    pool : true,
    auth: {
      user: 'myntrashekhar136@gmail.com',
      pass: 'prashant21102001',
    }
  });

  let mailOptions = {
    from : `${req.body.taker} <myntrashekhar136@gmail.com>`,
    to :    `${req.body.taker}, ${itemsThree}`,
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
      console.log(req.body);
      res.redirect("/");
    }
  });
  
  req.body.date = dateInDB;
  let doc = await Meeting.create(req.body);
  if(doc) {
    console.log(doc);
  }
});

app.get("/list" , async function(req , res){
    const meetings = await Meeting.find();
    // console.log(meetings);
    res.render("list" , {totalMeetings : meetings});
});

app.post("/list" , function(req , res){
  if(req.body.new === 'two') {
    res.redirect('/');
  }
  if(req.body.done === 'one') {
    res.sendFile(__dirname + '/success.html');
  }
});

app.get("/update/:id" , async function(req , res){
  if(req.body.done === "one")
  {
    res.sendFile(__dirname + "/success.html");
  }
  else if(req.body.new === "two"){
    res.redirect("/");
  } 
  else {
    const meeting = await Meeting.findOne({_id : req.params.id});
    res.render("update" , {id : req.params.id, meeting: meeting});
  }
});

app.post("/update/:id" , async function(req , res){
  if(req.body.mail === 'mail') {
    const updateMeeting = await Meeting.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});

    let outputUpdated = `
      <h4>Revised Meeting Details</h4>
      <h3>Meeting Details : </h3><br>
      <ul>
        <li>Minute Taker : ${updateMeeting.taker}</li>
        <li>Invitees : ${updateMeeting.attendees}</li>
        <li>Agenda : ${updateMeeting.about}</li>
        <li>Date : ${updateMeeting.date}</li>
        <li>Time : ${updateMeeting.initial}</li>
        <li>Venue : ${updateMeeting.note}</li>
      </ul>
      <p>You are kindly requested to attend the meeting on the above mentioned date and time.</p>
      ;`

    let transporter = nodeMailer.createTransport({

      service: "gmail",
      host: 'smtp.gmail.com',                                 
      secureConnection: true,                                 
      port: 465,                                              
      transportMethod: 'SMTP',                                
      pool : true,
      auth: {
        user: 'myntrashekhar136@gmail.com',
        pass: 'prashant21102001',
      }
    });

    let mailOptionsUpdated = {
      from : `${updateMeeting.taker} <myntrashekhar136@gmail.com>`,
      to :    `${updateMeeting.taker}, ${updateMeeting.attendees}`,
      subject : 'Minutes.io',
      text : 'Hello world',
      html : outputUpdated,
    };

    transporter.sendMail(mailOptionsUpdated, function(error,info){
      if(error){
        return console.log(error);
      }
      else {
        console.log('Email sent: ' + info.response);
        res.redirect("/list");
      }
    });
    res.redirect('/list');
  }
  else {
    const deletedMeeting = await Meeting.findByIdAndDelete(req.params.id);
    let outputDeleted = `
      <h4>Meeting Deleted</h4>
      <h3>Meeting Details : </h3><br>
      <ul>
        <li>Minute Taker : ${deletedMeeting.taker}</li>
        <li>Invitees : ${deletedMeeting.attendees}</li>
        <li>Agenda : ${deletedMeeting.about}</li>
        <li>Date : ${deletedMeeting.date}</li>
        <li>Time : ${deletedMeeting.initial}</li>
        <li>Venue : ${deletedMeeting.note}</li>
      </ul>
      <p>You are kindly requested to attend the meeting on the above mentioned date and time.</p>
      ;`

    let transporter = nodeMailer.createTransport({

      service: "gmail",
      host: 'smtp.gmail.com',                                 
      secureConnection: true,                                 
      port: 465,                                              
      transportMethod: 'SMTP',                                
      pool : true,
      auth: {
        user: 'myntrashekhar136@gmail.com',
        pass: 'prashant21102001',
      }
    });

    let mailOptionsDeleted = {
      from : `${deletedMeeting.taker} <myntrashekhar136@gmail.com>`,
      to :    `${deletedMeeting.taker}, ${deletedMeeting.attendees}`,
      subject : 'Minutes.io',
      text : 'Hello world',
      html : outputDeleted,
    };

    transporter.sendMail(mailOptionsDeleted, function(error,info){
      if(error){
        return console.log(error);
      }
      else {
        console.log('Email sent: ' + info.response);
        // console.log(req.body);
        res.redirect("/list");
      }
    });
    res.redirect('/list');
  }
});




