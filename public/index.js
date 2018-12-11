var socket = io('http://alexandresah.dlinkddns.com:8080/');
var slideIndex = 1;
var outSideValue = "";
var inSideValue = "";
var insideHumValue = "";
var lightStatus = "Off";
function openNav() {
    document.getElementById("mySidenav").style.width = "200px";	
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}

socket.on('toclient', function(msg) {
	console.log(msg);
	outSideValue = msg.temp.outSide;
	inSideValue = msg.temp.inSide;
	insideHumValue = msg.temp.humidity;
	lightStatus = msg.temp.lampStatus;
	console.log(msg.temp.outSide);
	console.log(msg.temp.inSide);
	console.log(insideHumValue);
});

setInterval(function(){
	socket.emit('fromclient', "update");
	if(document.getElementById("light-status")){
	  if(lightStatus == "1")
	    document.getElementById("light-status").innerHTML = "On";
	  else 
	    document.getElementById("light-status").innerHTML = "Off";
	}
}, 1000);

function sendLight(){
  var status = document.getElementById("light-status").innerHTML;
  if(status == "Off")
    socket.emit('fromclient', "light-on"); 
  else
    socket.emit('fromclient', "light-off"); 
  console.log(status);
}

$(document).ready(function(){ 
  
  
  $("a").click(function(){    
    closeNav();    				
  });
  $(".light-button").click(function(){ 
    
    //$("#light-status")
  });
});
