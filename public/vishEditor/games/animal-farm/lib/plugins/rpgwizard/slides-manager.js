ig.module(
	'plugins.rpgwizard.slides-manager'
)
.requires(
	'impact.impact'
)
.defines(function(){
    
ig.slidesManager = ig.Class.extend({
    //class to manage the slides in the game
    canvasContext: null,
    slidesArray: new Array(),
    currentSlide: null,           //index of the slide shown
    finishingEvent: null,         //event that is thrown in element "event-router"  when this presentation finishes
    
    
    init: function(canvasElem){
            this.canvasContext = canvasElem.getContext("2d");
    },
    
    addSlide: function(slide){
        this.slidesArray.push(slide);
    },
    
    update: function() {
        if(ig.input.pressed('action')) {
            if(this.currentSlide==this.slidesArray.length-1){
                player = ig.game.getEntitiesByType( EntityBoy )[0];
                player.locked = false;  //release player
                this.currentSlide = null;
		if(this.finishingEvent != null){
		    $("#event-router").trigger(this.finishingEvent, []);
		}
            }
	    else{
		this.currentSlide++;
	    }
        }
    },
    
    draw: function(){
        if(this.currentSlide != null){
            this.drawSlide();
	    this.drawCaption();
        }
    },
    
    //calculates the position in the canvas and draws the slide
    drawSlide: function(){
	//we draw the box for the slide
	var img = new Image();
	img.src = "media/decorations/ipad3.png";
	ig.system.context.drawImage(img, 0, 0);
	this.canvasContext.drawImage(this.slidesArray[this.currentSlide].img, 88, 60);
    },
    
    drawCaption: function(){
	//we will draw the text here
	if(this.slidesArray[this.currentSlide].caption && this.slidesArray[this.currentSlide].caption != ""){
	    var textStyle = 'italic 22px sans-serif';
	    var lines = this.getLines(ig.system.context, this.slidesArray[this.currentSlide].caption, 640, textStyle);                    
	    ig.system.context.fillStyle = 'white';
	    ig.system.context.font = textStyle;
	    ig.system.context.textBaseline = 'alphabetic';
	    for(var line = 0; line < lines.length; line++) {
		ig.system.context.fillText(lines[line], 90, 600 + line*22);
	    }
	}
    },
    
    playSlides: function(){
        this.currentSlide = 0;
    },    
    
    isPlaying: function(){
        if(this.currentSlide != null){
            return true;
        }
        else{
            return false;
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