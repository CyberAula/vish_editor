var video, track;
var cues = []; //empty array
var xhr;
var duracion;
var cont = true;
var balls = []; //Array de bolas ordenadas por tiempo
var nextBall;
var prevNextBall;
var RANGE = 0.300; //s around the ball where we should stop
var bol = true;



$(document).ready(function(){

	//Events
	// video = document.getElementById("myvideo");
	video = $("#myvideo")[0];

	$(video).on("loadedmetadata", function(){
		init();
	});

	$(video).on("timeupdate", function(){
		curTimeUpdate();
		var time = video.currentTime;

		if(typeof nextBall == "object"){
			if(Math.abs(time - nextBall.time) < RANGE){
				if(nextBall.showed == false){
					popUp(onCloseSubslide,nextBall);
				}
			}
		}
	});

	$('#play').on("click", togglePlay);
	$('#transportbar').on("click", seek);

	//Vars
	$('#duration').html(video.duration.toFixed(2));
	duracion = video.duration.toFixed(2);
	if (video.readyState >= video.HAVE_METADATA) {
	  	// init.app+ly(video); // missed the event
	}
   	_getBalls();
   	_getNextBall(0);
	paintBalls();
	paintIndex();
});


$( window ).resize(function() {
	eraseBalls();
	paintBalls();
	/*var videoHeigth= $('#myvideo').height();
	var videoWidth= $('#myvideo').width();
	var videoBoxWidth = $('#videoBox').width();
	var appHeigth = $('#application').height();
	console.log("videoHeigth: " + videoHeigth);
	console.log("appHeigth: " + appHeigth);
	var wWidth= $(window).width();
	var wWidth2= wWidth - (0.6*wWidth);

	var aspectRatio = $('#myvideo').width()/$('#myvideo').height();
	var parent = $("#videoBox").parent();
	var parentWidth = $(parent).width();
	var parentHeigth = $(parent).height();
	if(bol == true){
	if(videoHeigth => appHeigth){
		console.log("he entrado");
		//height limit
		var aa = (aspectRatio * appHeigth);
		var aaa = (aa*100)/parentWidth;
		console.log(aaa);
		$('#myvideo').css("width", aa + "px");
		bol = false;
	}else if((videoBoxWidth) => wWidth2)){
		console.log("no cabe");
	}
}*/
});




var onCloseSubslide = function(){
	var prevNextBall = nextBall;
	_getNextBall(video.currentTime);
	if(nextBall-prevNextBall < RANGE){
		popUp(onCloseSubslide,nextBall);		
	} else {
		video.play();
	}
}


function init(evt) {
}


var _getBalls = function(){
	for (i = 0; i < vquiz_sample.pois.length; i++) {
		var ball = {};
		ball.id = vquiz_sample.pois[i].id;
		ball.time = parseFloat(vquiz_sample.pois[i].time);
		ball.slide_id = vquiz_sample.pois[i].slide_id;
		ball.showed = false;
		ball.minTime = ball.time - RANGE;
		ball.maxTime = ball.time + RANGE;
		balls.push(ball);
	}

	balls.sort(function(A,B){
    	return A.time>B.time;
	});
}


var _getNextBall = function(time){
	if(typeof time != "number"){
		return null;
	}

	var myNextball;
	var pTime = video.duration;
	for (i = 0; i < balls.length; i++) {
		var ball = balls[i];
		var ballTime = parseFloat(ball.time);
		if((ballTime < pTime)&&(ballTime > 0)&&(ballTime > time)){
			if(ball != nextBall){
				myNextball = ball;
				break;
			}
		}
	}
	if(myNextball){
		nextBall = myNextball;
	} else {
		nextBall = undefined;
	}
	return nextBall;
}

var togglePlay = function() {
	if (video.paused == false) {
		video.pause();
		$("#play").attr("src","images/play.png");
	} else {
		video.play();
		$("#play").attr("src","images/pause.png");
	}
}


var paintIndex = function(){
	var screen = document.getElementById('chapters');
	for (i = 0; i < balls.length; i++) {
		var item = document.createElement('li');
		item.id = balls[i].id;
		var link = document.createElement('a');
		link.setAttribute('ident', balls[i].id);
		link.setAttribute('time', balls[i].time);
		link.innerHTML = balls[i].id + ': ' + balls[i].slide_id + ' ---> '+  balls[i].time;
		item.appendChild(link);
		screen.appendChild(item);
	}
		$("#chapters li a").on("click", function(event){
		video.currentTime = $(event.target).attr("time");
	    popUp(onCloseSubslide,balls[parseInt($(event.target).attr("ident"))]); //migrated to JQuery working
	});
}

// capture onkeydown on the navigation to allow space bar to toggle play/pause
function videoPlayPause(evt) {
	if (evt.keyCode == "32") { // space bar
		togglePlay();
	}
	if (evt.keyCode == "13") { // enter key
		seekChapter(this.getAttribute('data-chapter'));
		// stop event from bubbling
		evt = evt||event; /* get IE event ( not passed ) */
		evt.stopPropagation? evt.stopPropagation() : evt.cancelBubble = true;
	}
}


function paintBalls(){
	for (i = 0; i < balls.length; i++) {
		paintBall(balls[i]);
	}
}

function paintBall(ballJSON){
	console.log("paintBall ejecutada");
	var segmentDiv = document.getElementById("segmentDiv");
	var ball = document.createElement('li');
	var marker = document.createElement('div');
	var segments = 	document.getElementById('segments');
	var position = document.getElementById('transportbar');
	segmentDiv.appendChild(marker);
	segments.appendChild(ball);
	marker.className = 'marker';
	ball.className = 'ball';
	var time = parseFloat(ballJSON.time);
   	var duration = parseFloat(video.duration);
   	var bar_width = $('#positionview').width();
   	var perc = bar_width / duration;
   	ball.style.left = (Math.round((bar_width*time/video.duration) - 10 - 8) * 100)/($('#segments').width()) + "%"; //we add 8 to adjust the ball
   	marker.style.left =(Math.round((bar_width*time/video.duration) - 10) * 100)/($('#transportbar').width()) + "%";
   	ball.onclick = function () {
			video.currentTime = time;
			popUp(onCloseSubslide,ballJSON);
	}
}

function eraseBalls(){
	$("#segmentDiv").html('');
	$("#segments").html('');
}

var popUp = function(callback, ball){
	// var slide = $("#" + ball.slide_id);
	video.pause();
	var slide = ball.slide_id;
	ball.showed = true;
	var a = confirm(slide);
	if(a){
		if(typeof callback == "function"){
			callback();
		}
	}
}


// update transport bar time display
var curTimeUpdate = function(evt) {
	var bar_width = document.getElementById('positionview').offsetWidth;
	var tiemp = video.currentTime.toFixed(2);
	$("#curTime").html(tiemp);
	var wid = (Math.round((bar_width*video.currentTime/video.duration) - 10) * 100)/($('#transportbar').width()) + "%";
	$("#position").width(wid); //for the html to draw
	console.log($('#position').width);
}



// seek on transport bar
var seek = function(evt) {
	var bar_width = document.getElementById('positionview').offsetWidth; // "!it calculates the size of bar_width dinamically, even when you resize the navigation window.
	var clickpos = evt.pageX - this.offsetLeft;
	var clickpct = clickpos / bar_width;
	video.currentTime = clickpct * video.duration;

	nextBall = null;
	_getNextBall(video.currentTime);
	_resetShowParams();

	// clear chapter selection
	for (i = 0; i < cues.length; i++) {
		var segid = "segment" + i;
		var segment = document.getElementById(segid);
		segment.style.backgroundColor = "";
	}
}

var _resetShowParams = function(){
	$(balls).each(function(index,ball){
		ball.showed = false;
	});	
}

var hide = function(){
	$('#transcriptBox').hide();
	$('#hide_button2').show();
	$('#videoBox').css("width", '90%');
	eraseBalls();
	paintBalls();
}

var show = function(){
	$('#videoBox').css("width", '60%');
	eraseBalls();
	paintBalls();
	$('#transcriptBox').show();
	$('#hide_button2').hide();
}