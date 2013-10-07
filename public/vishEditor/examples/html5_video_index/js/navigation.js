var video, track;
var cues = [];
var xhr;

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

  // grab chapters out of <track>
  retrieve(track.getAttribute('src'));

  // display chapters in list and transport bar
	displayChapters();
	paintChapterbar();
}

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

// update transport bar time display
function curTimeUpdate(evt) {
	var bar_width = document.getElementById('positionview').offsetWidth;
	curTime.innerHTML = video.currentTime.toFixed(2);
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

// seek chapters
function seekChapter(chapter) {
	if (chapter) {
		video.currentTime = parseFloat(cues[chapter].start);
		for (i = 0; i < cues.length; i++) {
			var segid = "segment" + i;
			var segment = document.getElementById(segid);
			if (i == parseInt(chapter)) {
				segment.style.backgroundColor = "green";
			} else {
				segment.style.backgroundColor = "";
			}
		}
	}		
}

// pause on chapter end
function endChapter(evt) {
	var curChapter = video.getAttribute('data-chapter');
	if (video.currentTime >= cues[curChapter] && !video.paused) togglePlay();
}

// retrieve chapters via xhr and process them
function retrieve(url) {
	xhr = new XMLHttpRequest();
	if (xhr != null) {
		xhr.open("GET", url, false /* sync */);
		xhr.setRequestHeader('Content-Type', 'text/text; charset=utf-8');
		
		xhr.onreadystatechange = function() {
		  if (xhr.readyState == 4 /* complete */) {
  			if (xhr.status != 200) {
  				alert('Unable to retrieve file.');
  			} else {
  				cues = parseWebVTT(xhr.responseText);
  			}
		  }
		}
		xhr.send();
	} else {
		alert('Error retrieving file.');
	}
}

// display chapter list on screen
function displayChapters() {
	// create navigation list on right
	var chapters = document.getElementById('chapters');
	for (i=0; i < cues.length; i++) {
		var item = document.createElement('li');
		item.id = cues[i].id;
		var link = document.createElement('a');
		link.href = '#videoBox';
		link.innerHTML = cues[i].id + ': ' + cues[i].content;
		link.setAttribute('data-chapter', i);
		link.addEventListener('keydown', videoPlayPause, false);
		link.onclick = function () {
			seekChapter(this.getAttribute('data-chapter'));
		}
		item.appendChild(link);
		chapters.appendChild(item);
	}
}

// paint chapters into chapter bar
function paintChapterbar() {
	// create time segments under transportbar
	var duration = parseFloat(video.duration);
	var segments = document.getElementById('segments');
	var bar_width = document.getElementById('positionview').offsetWidth;
// TODO: bug - the offsetWidth is unknown at load state
var_width = 558;
  
	var perc = bar_width / duration;

	for (i=0; i < cues.length && duration > 0; i++) {    
		var segment = document.createElement('li');
		var start = parseFloat(cues[i].start);
		var end = parseFloat(cues[i].end);
		segment.id = "segment" + i;
		segment.className = "segment";
		segment.title = cues[i].content + "\npress enter to navigate, space to toggle play";
		segment.style.left = Math.round((start * perc) - 0.5) + 'px';
		segment.style.width = Math.round((end - start) * perc) + 'px';
		segment.setAttribute('data-chapter', i);
		segment.setAttribute('tabindex', '0');
		segment.setAttribute('role', 'button');
		segment.onclick = function () {
			seekChapter(this.getAttribute('data-chapter'));
		}
		segment.addEventListener('keydown', videoPlayPause, false);
		segments.appendChild(segment);
	}
}

// Function to parse webvtt file
function parseWebVTT(data) {
	var srt;
	// check WEBVTT identifier
	if (data.substring(0,6) != "WEBVTT") {
		alert("Missing WEBVTT header: Not a WebVTT file - trying SRT.");
		srt = data;
	} else {
		// remove WEBVTT identifier line
		srt = data.split('\n').slice(1).join('\n');
	}

	// clean up string a bit
	srt = srt.replace(/\r+/g, ''); // remove dos newlines
	srt = srt.replace(/^\s+|\s+$/g, ''); // trim white space start and end

	//    srt = srt.replace(/<[a-zA-Z\/][^>]*>/g, ''); // remove all html tags for security reasons

	// parse cues
	var cuelist = srt.split('\n\n');
	for (i = 0; i < cuelist.length; i++) {
		var cue = cuelist[i];
		var content = "", start, end, id = "";
		var s = cue.split(/\n/);
		var t = 0;
		// is there a cue identifier present?
		if (!s[t].match(/(\d+):(\d+):(\d+)/)) {
			// cue identifier present
			id = s[0];
			t = 1;
		}
		// is the next line the time string
		if (!s[t].match(/(\d+):(\d+):(\d+)/)) {
			// file format error: next cue
			continue;
		}
		// parse time string
		var m = s[t].match(/(\d+):(\d+):(\d+)(?:.(\d+))?\s*--?>\s*(\d+):(\d+):(\d+)(?:.(\d+))?/);
		if (m) {
			start =
			(parseInt(m[1], 10) * 60 * 60) +
			(parseInt(m[2], 10) * 60) +
			(parseInt(m[3], 10)) +
			(parseInt(m[4], 10) / 1000);
			end =
			(parseInt(m[5], 10) * 60 * 60) +
			(parseInt(m[6], 10) * 60) +
			(parseInt(m[7], 10)) +
			(parseInt(m[8], 10) / 1000);
		} else {
			// Unrecognized timestring: next cue
			continue;
		}

		// concatenate text lines to html text
		content = s.slice(t+1).join("<br>");

		// add parsed cue
		cues.push({id: id, start: start, end: end, content: content});
	}
	return cues; //JSON
	// Estructura por slide:
		// content: "Example with paint-on captions"
		// end : 1327.466
		// id:  "Slide 15"
		// start: 1180.7
}
