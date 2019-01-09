var socket = io('http://alexandresah.dlinkddns.com:8080/');
var slideIndex = 1;
var outSideValue = "";
var inSideValue = "";
var insideHumValue = 16;
var lightStatus = "Off";
var validPeriod = true;

function openNav() {
    document.getElementById("mySidenav").style.width = "200px";	
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}

socket.on('toclient', function(msg) {    
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
    while(tag.hasChildNodes()){
        tag.removeChild(tag.childNodes[0]);
    }
    let span = document.createElement("pre");
    span.setAttribute("style", "text-align:center;");
    var text = document.createTextNode(msg);
    span.appendChild(text);
    tag.appendChild(span);
    
});
setInterval(function(){
	socket.emit('fromclient', "update");
	if(document.getElementById("light-status")){
	  if(lightStatus == "1"){
	    document.getElementById("light-status").innerHTML = "On";
	    document.getElementById("light-status").setAttribute("class", "on");
	  }
	  else {
	    document.getElementById("light-status").innerHTML = "Off";
	    document.getElementById("light-status").setAttribute("class", "off");
	  }
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

function takePhoto(){
    if(validPeriod){
        socket.emit('fromclient', 'photo');
        validPeriod = false;
        setTimeout(function(){
            validPeriod = true;
        }, 3000);
    }
}

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
    while(tag.hasChildNodes()){
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
    if(emailIsValid (email.trim())){
      	socket.emit('email', email);
    }
    else if(!document.getElementById("email").hasAttribute("style")){  
    	console.log("Passe !");
    	document.getElementById("email").style.borderColor = "red";
    	
    	let tag = document.getElementById("appearForm");
    	let p = document.createElement("p");
    	p.setAttribute("style", "color: red;");
    	let text = document.createTextNode("Use valid syntaxe email please !");
    	p.appendChild(text);
    	tag.appendChild(p);
    }
}

function emailIsValid (email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}







