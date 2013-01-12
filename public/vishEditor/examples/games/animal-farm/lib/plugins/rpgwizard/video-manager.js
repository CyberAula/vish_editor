ig.module(
	'plugins.rpgwizard.video-manager'
)
.requires(
	'impact.impact'
)
.defines(function(){
	
ig.videoManager = ig.Class.extend({
	//class to manage the videos in the game
        //examples working:
        //<video src="http://upload.wikimedia.org/wikipedia/commons/2/23/Ara_chloroptera.ogg" controls="" tabindex="0"><img width="320" border="0" src="ara.jpg" alt=""></video>
        //<video controls="" src="http://upload.wikimedia.org/wikipedia/commons/2/23/Moving_Octopus_Vulgaris_2005-01-14.ogg" style="float: right" tabindex="0"><img src="Moving_Octopus_Vulgaris_2005-01-14.jpg"></video>
        //<video controls="true" src="http://upload.wikimedia.org/wikipedia/commons/7/79/Big_Buck_Bunny_small.ogv" id="video" tabindex="0"></video>
        canvasContext: null,
        width: null,
        height: null,
        videoHash: null,
        captionHash: null,
        videoPlaying: null,
        captionPlaying: null,
        finishingEvent: null,  //event that is thrown in element "event-router"  when this presentation finishes
        
        init: function(canvasElem){
            this.canvasContext = canvasElem.getContext("2d");
            this.width = canvasElem.width;
            this.height = canvasElem.height;
            this.videoHash = new Array();
            this.captionHash = new Array();
        },
        
        playVideo: function(videoId){
            //check if videoId is inside limits and if not set it inside limits
            videoId = videoId % this.videoHash.length;
            
            this.captionPlaying = this.captionHash[videoId];
            this.videoPlaying = this.videoHash[videoId];            
            this.videoPlaying.play();         //start the reproduction
        },
		
        
        addVideo: function(videoSrc, videoId){
            var v = document.createElement('video');
            v.setAttribute('id','video'+videoId);
            v.setAttribute('style','display:none');
            v.setAttribute('controls', true);
            //v.setAttribute('autoplay');
            v.setAttribute('src',videoSrc);            
            document.body.appendChild(v);
            
            this.videoHash[videoId] = v;
        },
        
        addCaption: function(caption, videoId){
            this.captionHash[videoId] = caption;            
        },
        
        isPlaying: function(){
            if(this.videoPlaying != null){
                return true;
            }
            else{
                return false;
            }
        },
        
        //this method draws a new frame if there is one video playing
        draw: function(){
            if(this.videoPlaying != null){
                //we draw the box for the slide
                var img = new Image();
                img.src = "media/decorations/ipad3.png";
                ig.system.context.drawImage(img, 0, 0);
                this.canvasContext.drawImage(this.videoPlaying, 88, 60, 630, 478);
            }
            //we will draw the caption here
            if(this.captionPlaying != null){
                var textStyle = 'italic 22px sans-serif';
                var lines = this.getLines(ig.system.context, this.captionPlaying, 640, textStyle);                    
                ig.system.context.fillStyle = 'white';
                ig.system.context.font = textStyle;
                ig.system.context.textBaseline = 'top';
                for(var line = 0; line < lines.length; line++) {
                    ig.system.context.fillText(lines[line], 110, 500 + line*22);
                }
            }  
            if(this.videoPlaying.ended){
                this.videoPlaying = null;     //next iteration the game will be drawn
                this.captionPlaying = null;
                player = ig.game.getEntitiesByType( EntityBoy )[0];
		player.locked = false;  //release player
                if(this.finishingEvent != null){
                    $("#event-router").trigger(this.finishingEvent, []);
                }
            }
        },
        
        /**
        * Divide an entire phrase in an array of phrases, all with the max pixel length given.
        * The words are initially separated by the space char.
        * @param phrase
        * @param length
        * @return
        */
       getLines: function (ctx,phrase,maxPxLength,textStyle) {
           var wa=phrase.split(" "),
               phraseArray=[],
               lastPhrase="",
               l=maxPxLength,
               measure=0;
           ctx.font = textStyle;
           for (var i=0;i<wa.length;i++) {
               var w=wa[i];
               measure=ctx.measureText(lastPhrase+w).width;
               if (measure<l) {
                   lastPhrase+=(" "+w);
               }else {
                   phraseArray.push(lastPhrase);
                   lastPhrase=w;
               }
               if (i===wa.length-1) {
                   phraseArray.push(lastPhrase);
                   break;
               }
           }
           return phraseArray;
       }
        
});

});