
var express = require('express');
var app = require('express')();
app.use(express.static('public'));

var http = require('http').Server(app);

const mqtt = require('mqtt');
const client = mqtt.connect('http://localhost:1883');

var io = require('socket.io')(http);
var scanner = io.of('/'); 

var toClient="";

var mongoClient = require('mongodb').MongoClient;
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
app.get('/light', function(req, res){
	res.sendFile(__dirname + "/" + "light.html");
});
app.get('/camera', function(req, res){
	res.sendFile(__dirname + "/" + "cam.html");
});

client.on('connect', () =>{
	client.subscribe('defi/temperature');
	console.log('Client mqtt connect');
});
client.on('message', (topic, message) =>{
	console.log(topic.toString());
	console.log('%s', message);
	var msg = JSON.parse(message.toString());
	if(msg != "undefined"){
		toClient = msg;
		console.log(msg.temp.outSide);
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
	    getPhotos("Fait")	    
	  }
	  else if(msg == "light-off")
	    client.publish('defi/tempResp', '0');
	});
	
	socket.on('disconnect', function() {
        console.log('Scanner Disconnected');
    });

});

http.listen(8080, function(){
	console.log('Server is listening on port : 8080');
});

// To be continue
// ================
function getPhotos(path){
  var spawn = require("child_process").spawn; 
  var process = spawn('python',["./script.py", path] ); 
  console.log("OK !");
  process.stdout.on('data', function(data) { 
        //res.send(data.toString()); 
        console.log("Voila");
        console.log(data.toString());
  });
}