var video, track;
var cues = []; //empty array
var xhr;
var duracion;

var balls = [];
var RANGE = 250; //ms around the ball where we should stop

// get video element, track, and duration element
video = document.getElementsByTagName('video')[0]; //<video preload="metadata" style="width:100%" poster="videos/webvtt_talk.png">
track = video.querySelectorAll('track')[0]; //<track id="nav" srclang="en" kind="chapters" src="videos/webvtt_talk_navigation.vtt">
duration = document.getElementById('duration');

// display duration and chapters once video is loaded
video.addEventListener("loadedmetadata", init, false);
if (video.readyState >= video.HAVE_METADATA) {
  init.apply(video); // missed the event
}





// update transport bar while playing
position = document.getElementById('position');
curTime  = document.getElementById('curTime');


/////// here we update the video time progress while playing
video.addEventListener("timeupdate", curTimeUpdate, false); 



/*
video.addEventListener("timeupdate", function() {
var min = Math.min(balls[0].time,balls[1].time,balls[2].time);
if (video.currentTime >= min) {
	video.pause();
	var numBalls = balls.length;
	for (i = 0; i < numBalls; i++) {
		if(min == balls[i].time){
			popUp(i);
		}

	}
console.log(video.currentTime);
}}, false);

*/


/////////////////////////////////////////////////////////////


/////// here we add the play- pause functionality to the button - togglePlay function

// play/pause button
play = document.getElementById('play');
play.addEventListener('click', togglePlay, false);


/////////////////////////////////////////////////////////////


// click on transport bar sets playback position
transportbar = document.getElementById('transportbar');
transportbar.addEventListener("click", seek, false);

// pause video when current chapter is finished
video.addEventListener("timeupdate", endChapter, false);


// display duration and chapters
function init(evt) {
	// update duration display
	duration.innerHTML = video.duration.toFixed(2); //video has a property called duration. we can
	duracion = video.duration.toFixed(2);

   // display chapters in list and transport bar
	paintBalls();
	paintIndex();
	console.log(balls);

	/*nana.onclick = function () {
			video.currentTime = balls[1].time;
	}*/
}


/*With this method we generate balls with random numbers and random time between 0 and video.duration
*/

// pause/play button
function togglePlay() {
	if (video.paused == false) {
		video.pause();
		play.style.backgroundPosition = '0 0';
	} else {
		video.play();
		play.style.backgroundPosition = '0 -75px';
	}
}


function paintIndex(){
	var screen = document.getElementById('navigation');
	for (i = 0; i < vquiz_sample.pois.length; i++) {
		console.log(vquiz_sample.pois.length);
		var item = document.createElement('li');
		item.id = vquiz_sample.pois[i].id;
		var link = document.createElement('a');
		link.setAttribute('ident', vquiz_sample.pois[i].id);
		link.setAttribute('time', vquiz_sample.pois[i].time);
		link.innerHTML = vquiz_sample.pois[i].id + ': ' + vquiz_sample.pois[i].slide_id;
		link.onclick = function () {
			video.currentTime = this.getAttribute('time');
			var id = this.getAttribute('ident');
			popUp(id);
		}
		item.appendChild(link);
		screen.appendChild(item);
	}
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
for (i = 0; i < vquiz_sample.pois.length; i++) {
		paintBall(i);
	}
}
function paintBall(indice){

	var ball = document.createElement('li');
	document.getElementById('segments').appendChild(ball);
	ball.className = 'ball';
	console.log(ball);
	var time = vquiz_sample.pois[indice].time; 
   	var duration = parseFloat(video.duration);
   	var bar_width = document.getElementById('positionview').offsetWidth;
   	var perc = bar_width / duration;
   	ball.style.left = Math.round((time * perc) - 0.5) - 5 + 'px';
   	ball.onclick = function () {
			video.currentTime = time;
			popUp(indice);
	}
}

function popUp(indice){
		var slide;
		var content = vquiz_sample.pois[indice].slide_id;
		for (i = 0; i < vquiz_sample.slides.length; i++) {
		if(vquiz_sample.slides[i].id == content){
			slide = JSON.stringify(vquiz_sample.slides[i]);
		}
	}
		//var message = vquiz_sample.pois[indice].slide_id;
		alert(slide);
}


// update transport bar time display
function curTimeUpdate(evt) {
	var bar_width = document.getElementById('positionview').offsetWidth;
	var tiemp = video.currentTime.toFixed(2);
	curTime.innerHTML = tiemp;
	position.style.width = Math.round(bar_width*video.currentTime/video.duration) + "px"; //for the html to draw
	//video.currentTime to know the exact time of the video playing
	//video.duration speaks by itself.

}


// seek on transport bar
function seek(evt) {
	var bar_width = document.getElementById('positionview').offsetWidth;
	var clickpos = evt.pageX - this.offsetLeft;
	var clickpct = clickpos / bar_width;
	video.currentTime = clickpct * video.duration;
	// clear chapter selection
	for (i = 0; i < cues.length; i++) {
		var segid = "segment" + i;
		var segment = document.getElementById(segid);
		segment.style.backgroundColor = "";
	}
}



// pause on chapter end
function endChapter(evt) {
	var curChapter = video.getAttribute('data-chapter');
	if (video.currentTime >= cues[curChapter] && !video.paused) togglePlay();
}



