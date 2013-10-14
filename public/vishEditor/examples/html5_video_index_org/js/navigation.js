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
video.addEventListener("timeupdate", curTimeUpdate, false);

// play/pause button
play = document.getElementById('play');
play.addEventListener('click', togglePlay, false);

// click on transport bar sets playback position
transportbar = document.getElementById('transportbar');
transportbar.addEventListener("click", seek, false);

// pause video when current chapter is finished
video.addEventListener("timeupdate", endChapter, false);


// display duration and chapters
function init(evt) {
	// update duration display
	duration.innerHTML = video.duration.toFixed(2);

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
	position.style.width = Math.round(bar_width*video.currentTime/video.duration) + "px";
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
// Just to retrieve file with xhr format
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
			/*
				Slide 1
				00:00:00.000 --> 00:00:10.700
				Title Slide

				Slide 2
				00:00:10.700 --> 00:00:47.600
				Introduction by Naomi Black

				Slide 3
				00:00:47.600 --> 00:01:50.100
				Impact of Captions on the Web

				Slide 4
				00:01:50.100 --> 00:03:33.000
				Requirements of a Video text format

				Slide 5
				00:03:33.000 --> 00:04:57.766
				Simple WebVTT file

				Slide 6
				00:04:57.766 --> 00:06:16.666
				Styled WebVTT file

				Slide 7
				00:06:16.666 --> 00:07:37.900
				Internationalized WebVTT file

				Slide 8
				00:07:37.900 --> 00:09:45.600
				Positioning of WebVTT cues

				Slide 9
				00:09:45.600 --> 00:10:54.133
				Speaker semantics in cues

				Slide 10
				00:10:54.133 --> 00:12:07.333
				Audio descriptions in WebVTT

				Slide 11
				00:12:07.333 --> 00:12:43.466
				Navigation through chapters

				Slide 12
				00:12:43.466 --> 00:15:19.166
				HTML markup for captions

				Slide 13
				00:15:19.166 --> 00:17:08.166
				CSS for rich styling

				Slide 14
				00:17:08.166 --> 00:19:40.700
				Demo of roll-up captions

				Slide 15
				00:19:40.700 --> 00:22:07.466
				Example with paint-on captions

				Slide 16
				00:22:07.466 --> 00:23:27.566
				Concluding remarks

				Slide 17
				00:23:27.566 --> 00:24:35.466
				Question on line numbers

				Slide 18
				00:24:35.466 --> 00:27:14.166
				Question on hyperlinks

				Slide 19
				00:27:14.166 --> 00:28:52.866
				Questions on mixing kinds in a file

				Slide 20
				00:28:52.866 --> 00:31:47.833
				Question on where style sheets live

				Slide 21
				00:31:47.833 --> 00:32:41.466
				Question on justified text

				Slide 22
				00:32:41.466 --> 00:33:24.170
				Final thanks
			*/
	}

	// clean up string a bit
	srt = srt.replace(/\r+/g, ''); // remove dos newlines
	/*
				Slide 1
			00:00:00.000 --> 00:00:10.700
			Title Slide

			Slide 2
			00:00:10.700 --> 00:00:47.600
			Introduction by Naomi Black

			Slide 3
			00:00:47.600 --> 00:01:50.100
			Impact of Captions on the Web

			Slide 4
			00:01:50.100 --> 00:03:33.000
			Requirements of a Video text format

			Slide 5
			00:03:33.000 --> 00:04:57.766
			Simple WebVTT file

			Slide 6
			00:04:57.766 --> 00:06:16.666
			Styled WebVTT file

			Slide 7
			00:06:16.666 --> 00:07:37.900
			Internationalized WebVTT file

			Slide 8
			00:07:37.900 --> 00:09:45.600
			Positioning of WebVTT cues

			Slide 9
			00:09:45.600 --> 00:10:54.133
			Speaker semantics in cues

			Slide 10
			00:10:54.133 --> 00:12:07.333
			Audio descriptions in WebVTT

			Slide 11
			00:12:07.333 --> 00:12:43.466
			Navigation through chapters

			Slide 12
			00:12:43.466 --> 00:15:19.166
			HTML markup for captions

			Slide 13
			00:15:19.166 --> 00:17:08.166
			CSS for rich styling

			Slide 14
			00:17:08.166 --> 00:19:40.700
			Demo of roll-up captions

			Slide 15
			00:19:40.700 --> 00:22:07.466
			Example with paint-on captions

			Slide 16
			00:22:07.466 --> 00:23:27.566
			Concluding remarks

			Slide 17
			00:23:27.566 --> 00:24:35.466
			Question on line numbers

			Slide 18
			00:24:35.466 --> 00:27:14.166
			Question on hyperlinks

			Slide 19
			00:27:14.166 --> 00:28:52.866
			Questions on mixing kinds in a file

			Slide 20
			00:28:52.866 --> 00:31:47.833
			Question on where style sheets live

			Slide 21
			00:31:47.833 --> 00:32:41.466
			Question on justified text

			Slide 22
			00:32:41.466 --> 00:33:24.170
			Final thanks
*/

	srt = srt.replace(/^\s+|\s+$/g, ''); // trim white space start and end
	//    srt = srt.replace(/<[a-zA-Z\/][^>]*>/g, ''); // remove all html tags for security reasons

	// parse cues
	var cuelist = srt.split('\n\n');
	/* Cueslist is am strimg
"Slide 1\n00:00:00.000 --> 00:00:10.700\nTitle Slide", "Slide 2\n00:00:10.700 --...oduction by Naomi Black", "Slide 3\n00:00:47.600 --... of Captions on the Web", "Slide 4\n00:01:50.100 --... of a Video text format", "Slide 5\n00:03:33.000 --....766\nSimple WebVTT file", "Slide 6\n00:04:57.766 --....666\nStyled WebVTT file", "Slide 7\n00:06:16.666 --...ationalized WebVTT file", "Slide 8\n00:07:37.900 --...itioning of WebVTT cues", "Slide 9\n00:09:45.600 --...eaker semantics in cues", "Slide 10\n00:10:54.133 -... descriptions in WebVTT", "Slide 11\n00:12:07.333 -...gation through chapters", "Slide 12\n00:12:43.466 -...TML markup for captions", "Slide 13\n00:15:19.166 -...66\nCSS for rich styling", "Slide 14\n00:17:08.166 -...emo of roll-up captions", "Slide 15\n00:19:40.700 -... with paint-on captions", "Slide 16\n00:22:07.466 -....566\nConcluding remarks", "Slide 17\n00:23:27.566 -...uestion on line numbers", "Slide 18\n00:24:35.466 -...\nQuestion on hyperlinks", "Slide 19\n00:27:14.166 -... mixing kinds in a file", "Slide 20\n00:28:52.866 -...where style sheets live", "Slide 21\n00:31:47.833 -...stion on justified text", "Slide 22\n00:32:41.466 -...:33:24.170\nFinal thanks"
	*/

	for (i = 0; i < cuelist.length; i++) {
		var cue = cuelist[i]; // te divide en estructuras de la forma Slide 1
							  //	00:00:00.000 --> 00:00:10.700
							  //Title Slide
		var content = "", start, end, id = ""; //variable definitions
		var s = cue.split(/\n/); // Create arrays in ["Slide 1", "00:00:00.000 --> 00:00:10.700", "Title Slide"]
		var t = 0;
		// is there a cue identifier present?
		if (!s[t].match(/(\d+):(\d+):(\d+)/)) {
			// cue identifier present
			id = s[0]; //Slide 1, Slide 2...
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
		content = s.slice(t+1).join("<br>"); //title of the slides


		// add parsed cue
		cues.push({id: id, start: start, end: end, content: content}); // se van añadiendo nuevas, hasta que llegamos a
		/*
		[Object { id="Slide 1", start=0, end=10.7, más...}, Object { id="Slide 2", start=10.7, end=47.6, más...}, Object { id="Slide 3", start=47.6, end=110.1, más...}, Object { id="Slide 4", start=110.1, end=213, más...}, Object { id="Slide 5", start=213, end=297.766, más...}, Object { id="Slide 6", start=297.766, end=376.666, más...}, Object { id="Slide 7", start=376.666, end=457.9, más...}, Object { id="Slide 8", start=457.9, end=585.6, más...}, Object { id="Slide 9", start=585.6, end=654.133, más...}, Object { id="Slide 10", start=654.133, end=727.333, más...}, Object { id="Slide 11", start=727.333, end=763.466, más...}, Object { id="Slide 12", start=763.466, end=919.166, más...}, Object { id="Slide 13", start=919.166, end=1028.166, más...}, Object { id="Slide 14", start=1028.166, end=1180.7, más...}, Object { id="Slide 15", start=1180.7, end=1327.466, más...}, Object { id="Slide 16", start=1327.466, end=1407.566, más...}, Object { id="Slide 17", start=1407.566, end=1475.466, más...}, Object { id="Slide 18", start=1475.466, end=1634.166, más...}, Object { id="Slide 19", start=1634.166, end=1732.866, más...}, Object { id="Slide 20", start=1732.866, end=1907.833, más...}, Object { id="Slide 21", start=1907.833, end=1961.466, más...}, Object { id="Slide 22", start=1961.466, end=2004.17, más...}]
		*/
	}
	return cues; //JSON
	// Estructura por slide:
		// content: "Example with paint-on captions"
		// end : 1327.466
		// id:  "Slide 15"
		// start: 1180.7
}
