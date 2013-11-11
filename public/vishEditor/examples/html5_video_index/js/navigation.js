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

var nearBall = function(){
		if(nextBall-prevNextBall < RANGE){
			//falta
		}else{
			video[0].play();
		}
}


$(document).ready(function(){

	video = $("#videoBox video");

	video.on("loadedmetadata", function(){
		init();
	});
	if (video.readyState >= video.HAVE_METADATA) {
	  	init.app+
	  	ly(video); // missed the event
	}

	video.on("timeupdate", function(){
		curTimeUpdate();
	});

	_getNextBall(2);

 //--------------------------------------------------------------
	video.on("timeupdate", function(){
	var times= video[0].currentTime;
	// console.log(video.currentTime);
	// llamo a la función con times de parametro
	//si el array de bolas no esta vacio hago cosas y si no no.

	var ballsForTime = _getBallsForTime(times);

	if (ballsForTime.length > 0){
		video[0].pause();
		$(ballsForTime).each(function(index,ball){
			// Comprobar la ultima vez que se mostro la bola para no mostrar dos veces seguidas la misma
			if(!ball.showed){
				ball.showed = true;
				console.log/
				popUp(probando,index);
				cont = false;
				return false;
			}else {
				video[0].pause();
			}
		});
	}
	});


	$('#play').on("click", togglePlay);
	$('#transportbar').on("click", seek);





	$('#duration').html(video[0].duration.toFixed(2));
	duracion = video[0].duration.toFixed(2);

   	_getBalls();
	paintBalls();
	paintIndex();


});

	$(window).resize(function() {
	eraseBalls();
	paintBalls();
	});



var _getBallsForTime = function(t){
	var ballsForTime = [];
	//balls variable con las bolas que tienen ya parametros minTime y maxTime

	var times = video[0].currentTime;
		if ((times >= nextBall-RANGE) && (times <= nextBall + RANGE)) {
			ballsForTime.push(nextBall);

		}	

	return ballsForTime;
}



function init(evt) {
}



var _getBalls = function(){

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
	}
}


var _getNextBall = function (time){
	var pTime = video[0].duration;
	for (i = 0; i < vquiz_sample.pois.length; i++) {
		if(parseFloat(vquiz_sample.pois[i].time) < pTime){ 
			if(parseFloat(vquiz_sample.pois[i].time) > time){
			pTime = parseFloat(vquiz_sample.pois[i].time);
		}
		}
	}
			nextBall = pTime; //realmente lo que nos interesa es el tiempo de la bola.
			console.log(nextBall);
}



var togglePlay = function() {
	if (video[0].paused == false) {
		video[0].pause();
		play.style.backgroundPosition = '0 0';
	} else {
		video[0].play();
		play.style.backgroundPosition = '0 -75px';
	}
}


var paintIndex = function(){
	var screen = document.getElementById('chapters');
	for (i = 0; i < vquiz_sample.pois.length; i++) {
		console.log(vquiz_sample.pois.length);
		var item = document.createElement('li');
		item.id = vquiz_sample.pois[i].id;
		var link = document.createElement('a');
		link.setAttribute('ident', vquiz_sample.pois[i].id);
		link.setAttribute('time', vquiz_sample.pois[i].time);
		link.innerHTML = vquiz_sample.pois[i].id + ': ' + vquiz_sample.pois[i].slide_id + ' ---> '+  vquiz_sample.pois[i].time;
		item.appendChild(link);
		screen.appendChild(item);
	}
		$("#chapters li a").on("click", function(event){
		video[0].currentTime = $(event.target).attr("time");
	    popUp(probando,$(event.target).attr("ident")); //migrated to JQuery working
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
for (i = 0; i < vquiz_sample.pois.length; i++) {
		paintBall(i);
	}
}
function paintBall(indice){
	var ball = document.createElement('li');
	var marker = document.createElement('div');
	var segments = 	document.getElementById('segments');
	var position = document.getElementById('transportbar');
	position.appendChild(marker);
	segments.appendChild(ball);
	marker.className = 'marker';
	ball.className = 'ball';
	console.log(ball);
	var time = vquiz_sample.pois[indice].time; 
   	var duration = parseFloat(video[0].duration);
   	var bar_width = document.getElementById('positionview').offsetWidth;
   	var perc = bar_width / duration;
   	ball.style.left = ((Math.round((time * perc) - 0.5) - 10)*100)/($('#segments').width()) + '%';
   	marker.style.left =((Math.round((time * perc) - 0.5) - 2)*100)/($('#transportbar').width()) + '%';
   	ball.onclick = function () {
			video[0].currentTime = time;
			popUp(probando,indice);
	}
	times.sort();
}

function eraseBalls(){
	$("#transportbar").html('');
	$("#segments").html('');
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
		_getNextBall(video[0].currentTime + RANGE);
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
	var tiemp = video[0].currentTime.toFixed(2);
	$("#curTime").html(tiemp);
	$("#position").width((Math.round(bar_width*video[0].currentTime/video[0].duration) + "px")); //for the html to draw
	//video.currentTime to know the exact time of the video playing
	//video.duration speaks by itself.

}



// seek on transport bar
var seek = function(evt) {
	var bar_width = document.getElementById('positionview').offsetWidth; // "!it calculates the size of bar_width dinamically, even when you resize the navigation window.
	var clickpos = evt.pageX - this.offsetLeft;
	var clickpct = clickpos / bar_width;
	video[0].currentTime = clickpct * video[0].duration;
	console.log(video[0].currentTime);
	_getNextBall(video[0].currentTime);

	// clear chapter selection
	for (i = 0; i < cues.length; i++) {
		var segid = "segment" + i;
		var segment = document.getElementById(segid);
		segment.style.backgroundColor = "";
	}
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