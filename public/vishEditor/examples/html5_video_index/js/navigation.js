var video; 
var duracion;
var balls = []; // Ball array time-ordered
var nextBall; 
var prevNextBall; 
var RANGE = 0.300; //seconds around the ball where we should stop

$(document).ready(function(){

	//Events
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


/*
 *	When resizing the window, we have to erase all balls and then paint them again
 *	(in order to calculate marker and ball positions again)
*/


$( window ).resize(function() {
	eraseBalls();
	paintBalls();
});

/*
 * Function executed when closing pop-up. We play the video or directly show next slide
 * depending on the time of next ball.
 *
*/


var onCloseSubslide = function(){
	var prevNextBall = nextBall;
	_getNextBall(video.currentTime);
	if(nextBall-prevNextBall < RANGE){
		popUp(onCloseSubslide,nextBall);		
	} else {
		video.play();
	}
}

/*
 * Init function
 *
*/


function init(evt) {
}


/*
 * With _getBalls we parse the JSON and add the balls ordered by time to 
 * balls array.
*/


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


/*
 * Get nextBall of the array ball
 *
*/


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


/*
 *	Play/Pause controls (image replacement)
 *
*/


var togglePlay = function() {
	if (video.paused == false) {
		video.pause();
		$("#play").attr("src","images/play.png");
	} else {
		video.play();
		$("#play").attr("src","images/pause.png");
	}
}

/*
 * With paintIndex method, we paint the list of balls added by the 
 * final user in a box (including id, name and time). 
 * When we click in a list element, the video goes to the time 
 * when the ball is defined and shows the info associated.
 *
*/



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


/*
 * Using space bar and enter key to control the  video.
 *
*/


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


/*
 * We paint all balls defined in ball array.
 *
*/


function paintBalls(){
	for (i = 0; i < balls.length; i++) {
		paintBall(balls[i]);
	}
}

/*
 * With paintBall method we paint the ballJSON.
 * On click of the ball, we show the info associated to the element.
 *
*/

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
   	ball.style.left = ((Math.round((bar_width*time/video.duration) - 10 ) * 100)/($('#segments').width())) - 1.3 + "%"; //we add 8 to adjust the ball
   	marker.style.left =((Math.round((bar_width*time/video.duration)) * 100)/($('#transportbar').width())) - 1.63 + "%";
   	ball.onclick = function () {
		video.currentTime = time;
		popUp(onCloseSubslide,ballJSON);
	}
}

/*
 * In order to recalculate the marker and ball position, with eraseBalls
 * we erase balls and markers of the time bar.
 *
*/


function eraseBalls(){
	$("#segmentDiv").html('');
	$("#segments").html('');
}

/*
 * The element showed when a ball is clicked.
 *
*/

var popUp = function(callback, ball){
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


/*
 * curTimeUpdate updates the time div and draws the yellow progress bar.
 *
*/



// update transport bar time display
var curTimeUpdate = function(evt) {
	var bar_width = document.getElementById('positionview').offsetWidth;
	var tiemp = video.currentTime.toFixed(2);
	$("#curTime").html(tiemp);
	var wid = (Math.round((bar_width*video.currentTime/video.duration) - 10) * 100)/($('#transportbar').width()) + "%";
	$("#position").width(wid); //for the html to draw
	console.log($('#position').width);
}



/*
 * If you click in a specific time in video progress bar, seek function jumps the video to 
 * that time.
 *
*/


// seek on transport bar
var seek = function(evt) {
	var bar_width = document.getElementById('positionview').offsetWidth; // "!it calculates the size of bar_width dinamically, even when you resize the navigation window.
	var clickpos = evt.pageX - this.offsetLeft;
	var clickpct = clickpos / bar_width;
	video.currentTime = clickpct * video.duration;

	nextBall = null;
	_getNextBall(video.currentTime);
	_resetShowParams();
}

/*
 * Reset ball.showed parameter in every ball.
 *
*/


var _resetShowParams = function(){
	$(balls).each(function(index,ball){
		ball.showed = false;
	});	
}


/*
 * hide the transcriptBox in which the ball index is defined
 *
*/

var hide = function(){
	$('#transcriptBox').hide();
	$('#hide_button2').show();
	$('#videoBox').css("width", '90%');
	$("#videoDiv").css("width", '100%');
	$('#controls').css("width", '100%');
	eraseBalls();
	paintBalls();
}

/*
 * shows the transcriptBox in which the ball index is defined
 *
*/

var show = function(){
	$('#videoBox').css("width", '60%');
	eraseBalls();
	paintBalls();
	$('#transcriptBox').show();
	$('#hide_button2').hide();
}