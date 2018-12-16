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
    //var msg = JSON.parse(msgs);
	console.log(msg);
    if(msg.from == "filePhotoName"){
        appearPhoto(msg.fileName);
    }
    else if(msg.from == "device"){
	outSideValue = msg.temp.outSide;
	inSideValue = msg.temp.inSide;
	insideHumValue = msg.hum;
	lightStatus = msg.lampStatus;
	console.log(msg.temp.outSide);
	console.log(msg.temp.inSide);
	console.log(insideHumValue);
    }
});
socket.on('toclientMail',function(msg){
    let tag = document.getElementById("appearForm");
    if(tag.hasChildNodes()){
        tag.removeChild(tag.childNodes[0]);
    }
    let span = document.createElement("span");
    span.setAttribute("style", "text-align:center;");
    var text = document.createTextNode(msg);
    span.appendChild(text);
    tag.appendChild(span);
    
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
    
});

function appearPhoto(fileName){
    let tag = document.getElementById("appear");
    let src = "http://alexandresah.dlinkddns.com:8080/photos/" + fileName;
    let div = document.createElement("div");
    div.setAttribute("class", "img-container");
    let img = document.createElement("img");
    img.setAttribute("src", src);
    img.setAttribute("alt", "Can not appear !");
    img.setAttribute("class", "imgPhotos");
    div.appendChild(img);
    tag.appendChild(div);
    let br = document.createElement("br");
    tag.appendChild(br);
}
function formForEmail(){
    let tag = document.getElementById("appearForm");
    if(tag.hasChildNodes()){
        tag.removeChild(tag.childNodes[0]);
    }
    let div = document.createElement("div");
    let text = document.createTextNode("E-mail : ");
    div.appendChild(text);
    let input = document.createElement("input");
    input.setAttribute("type", "email");
    input.setAttribute("for","email");
    input.setAttribute("id","email");
    div.appendChild(input);
    let submit = document.createElement("button");
    text = document.createTextNode("Submit");
    submit.appendChild(text);
    submit.setAttribute("onclick", "sendEmail()");
    div.appendChild(submit);
    tag.appendChild(div);
    let br = document.createElement("br");
    tag.appendChild(br);    
}

function sendEmail(){
    var email = document.getElementById("email").value;
    console.log(email);
    socket.emit('email', email);
}








