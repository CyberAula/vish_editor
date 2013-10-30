var video, track;
var cues = []; //empty array
var xhr;
var duracion;
var cont = true;
var times = [];
var nextBall;
var prevNextBall;

var balls = [];
var RANGE = 0.300; //s around the ball where we should stop


$(document).ready(function(){

	/* ------- DOM manipulations ------ */
	var probando = function(){
		if(nextBall-prevNextBall < RANGE){
			//falta
		}else{
			video.play();
		}
}


	video = document.getElementsByTagName('video')[0]; 
	track = video.querySelectorAll('track')[0]; 
	duration = document.getElementById('duration');


	position = document.getElementById('position');
	curTime  = document.getElementById('curTime');



	video.addEventListener("loadedmetadata", init, false);
	if (video.readyState >= video.HAVE_METADATA) {
	  	init.apply(video); // missed the event
	}

	video.addEventListener("timeupdate", curTimeUpdate, false); 

	_getNextBall(2);

 //--------------------------------------------------------------
	video.addEventListener("timeupdate", function(){
	var times= video.currentTime;
	// console.log(video.currentTime);
	// llamo a la función con times de parametro
	//si el array de bolas no esta vacio hago cosas y si no no.

	var ballsForTime = _getBallsForTime(times);

	if (ballsForTime.length > 0){
		video.pause();
		$(ballsForTime).each(function(index,ball){
			// Comprobar la ultima vez que se mostro la bola para no mostrar dos veces seguidas la misma
			if(!ball.showed){
				ball.showed = true;
				popUp(probando,index);
				cont = false;
				return false;
			}else {
				video.pause();
			}
		});
		}
	},false);

// -----------------------------------------------------



	play = document.getElementById('play');
	play.addEventListener('click', togglePlay, false);

	transportbar = document.getElementById('transportbar');
	transportbar.addEventListener("click", seek, false);

	/* ------ end of DOM manipulations --------*/





	duration.innerHTML = video.duration.toFixed(2); //video has a property called duration. we can
	duracion = video.duration.toFixed(2);

   // display chapters in list and transport bar
  	_getBalls();
	paintBalls();
	paintIndex();


});



// display duration and chapters once video is loaded



var _getBallsForTime = function(t){
	var ballsForTime = [];
	//balls variable con las bolas que tienen ya parametros minTime y maxTime

	var times = video.currentTime;
		if ((times >= nextBall-RANGE) && (times <= nextBall + RANGE)) {
			ballsForTime.push(nextBall);
			console.log("me ejecuto");

		}	

	return ballsForTime;
}


// display duration and chapters
function init(evt) {
}

function _getBalls(){

	for (i = 0; i < vquiz_sample.pois.length; i++) {
			var ballo=  [];
		var time = vquiz_sample.pois[i].time;
		ballo.id = vquiz_sample.pois[i].id;
		ballo.time = parseFloat(vquiz_sample.pois[i].time);
		times.push(ballo.time);
		ballo.slide_id = vquiz_sample.pois[i].slide_id;
		ballo.showed = false;
		var ntime = parseFloat(time);
		ballo.minTime = ntime - RANGE;
		ballo.maxTime = ntime + RANGE;
		balls.push(ballo);
		console.log(balls);
	}
}


var _getNextBall = function (time){
	var pTime = video.duration;
	for (i = 0; i < vquiz_sample.pois.length; i++) {
		if(parseFloat(vquiz_sample.pois[i].time) < pTime){ 
			if(parseFloat(vquiz_sample.pois[i].time) > time){
			pTime = parseFloat(vquiz_sample.pois[i].time);
		}
		}
	}
			nextBall = pTime; //realmente lo que nos interesa es el tiempo de la bola.
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
		link.innerHTML = vquiz_sample.pois[i].id + ': ' + vquiz_sample.pois[i].slide_id + ' ---> '+  vquiz_sample.pois[i].time;
		link.onclick = function () {
			video.currentTime = this.getAttribute('time');
			var id = this.getAttribute('ident');
				popUp(probando,id);
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
	var marker = document.createElement('div');
	var segments = 	document.getElementById('segments');
	var position = document.getElementById('position');
	position.appendChild(marker);
	segments.appendChild(ball);
	marker.className = 'marker';
	ball.className = 'ball';
	console.log(ball);
	var time = vquiz_sample.pois[indice].time; 
   	var duration = parseFloat(video.duration);
   	var bar_width = document.getElementById('positionview').offsetWidth;
   	var perc = bar_width / duration;
   	ball.style.left = Math.round((time * perc) - 0.5) - 10 + 'px';
   	marker.style.left = Math.round((time * perc) - 0.5) - 2  + 'px';
   	ball.onclick = function () {
			video.currentTime = time;
			popUp(probando,indice);
	}
	times.sort();
}

var popUp = function(callback, indice){
		var slide;
		var content = vquiz_sample.pois[indice].slide_id;
		for (i = 0; i < vquiz_sample.slides.length; i++) {
		if(vquiz_sample.slides[i].id == content){
			slide = JSON.stringify(vquiz_sample.slides[i]);
		}
	}
		//var message = vquiz_sample.pois[indice].slide_id;
		prevNextBall = nextBall;
		console.log(prevNextBall);
		_getNextBall(video.currentTime + RANGE);
		console.log(nextBall);
		var a = confirm(slide);
	if(a){
		if(typeof callback == "function"){
			callback();
		}
	}
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
	_getNextBall(video.currentTime);
	console.log("seeeeek");
	console.log(nextBall);
	// clear chapter selection
	for (i = 0; i < cues.length; i++) {
		var segid = "segment" + i;
		var segment = document.getElementById(segid);
		segment.style.backgroundColor = "";
	}
}



