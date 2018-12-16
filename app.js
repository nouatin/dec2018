
var express = require('express');
var app = require('express')();
app.use(express.static('public'));

var http = require('http').Server(app);

const mqtt = require('mqtt');
const client = mqtt.connect('http://localhost:1883');

var io = require('socket.io')(http);
var scanner = io.of('/'); 
var fs = require('fs');
var str2json = require('string-to-json');
var dateFormat = require('format-datetime');
var date = new Date();

var toClient="";

var manageTimer = true;
var beginTimer;

var fileIndex = 0;
var fileName = "";

var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'sahnotifications@gmail.com',
    pass: 'google1976'
  }
});



var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/defi";

app.get('/', function(req, res){
	res.sendFile(__dirname + "/" + "index.html");
});
app.get('/temperature', function(req, res){
	res.sendFile(__dirname + "/" + "temp.html");
});
app.get('/humidity', function(req, res){
	res.sendFile(__dirname + "/" + "hum.html");
});
app.get('/control', function(req, res){
	res.sendFile(__dirname + "/" + "ctrl.html");
});
app.get('/contact', function(req, res){
	res.sendFile(__dirname + "/" + "contact.html");
});

client.on('connect', () =>{
	client.subscribe('defi/temperature');
	console.log('Client mqtt connect');
});
client.on('message', (topic, message) =>{
	console.log(topic.toString());
	if(msg != "undefined"){
	    console.log('%s', message);
	    var msg = JSON.parse(message.toString());	
  	    toClient = msg;	    
	}
});



scanner.on('connection', function(socket) {
	console.log('Scanner Connected');
	
	socket.on('fromclient', function(msg) {
	  console.log(msg);
	  if(msg == "update")
	      scanner.emit('toclient', toClient);
	  else if(msg == "light-on"){
	      client.publish('defi/tempResp', '1');	    
	  }
	  else if(msg == "light-off")
	      client.publish('defi/tempResp', '0');
	  else if(msg == "photo"){
	      fileIndex += 1;
	      fileName = "photo_" + fileIndex + ".jpg";
	      getPhotos(fileName);
	      //sendMail();
	      var delay = setTimeout(function(){	        
         	var newName = "/home/pi/defi_2018/public/photos/" + fileName;
	        fs.rename(fileName, newName, function(err){
	            if(err) throw err;
	            console.log("File rename complete");	            
	            var msgFileName = '{\"from\":\"filePhotoName\",\"fileName\":\"';
	            msgFileName += fileName + '\"}';
	            var msgFile = str2json.convert({"from":"filePhotoName","fileName":fileName});
	            scanner.emit('toclient', msgFile);   
	            console.log(msgFile);
	        });
	      }, 2000);
	  }
	});
	socket.on('email', function(adr){
	    adr += "\n";
	    fs.appendFile('forEmail.txt', adr, function(err){
	        if(err) throw err;	    
	    });
	    var textToSend = emailTextBuilder();
	    sendMail(adr, textToSend);
	    scanner.emit('toclientMail', textToSend);
	});
	
	socket.on('disconnect', function() {
        console.log('Scanner Disconnected');
    });

});


http.listen(8080, function(){
	console.log('Server is listening on port : 8080');
});

function emailTextBuilder(){    
    var status;
    if(toClient.lampStatus == 0) 
        status = "OFF";
    else status = "ON";
    //var msg = "All value at "+dateFormat(date, "yyyy-MM-dd,hh:mm:ss") + "\n";
    var msg = "All value at " + date.toString() + "\n";
    msg += "Outside temperature : " + toClient.temp.outSide + "*C;" + "\n";
    msg += "Inside temperature : " + toClient.temp.inSide + "*C;" + "\n";
    msg += "Inside humidity : " + toClient.hum + "%;" + "\n";
    msg += "Light status : " + status + ".\n";
    msg += "\n\n" + "Contact sahlegrand@gmail.com for suggestions and advices";
    return msg;
}

function getPhotos(fileName){
  let spawn = require("child_process").spawn; 
  let process = spawn('python',["./public/photos/script.py", fileName] ); 
  console.log("Photo OK !");
 
  process.stdout.on('data', function(data) { 
        //res.send(data.toString()); 
        //console.log("Voila");
        //console.log(data.toString());        
  });
}

function sendMail(addressEmail, textToSend){
    var mailOptions = {
      from: 'sahnotifications@gmail.com',
      to: addressEmail,
      subject: 'Current values from all devices',
      text: textToSend
    };


    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}
