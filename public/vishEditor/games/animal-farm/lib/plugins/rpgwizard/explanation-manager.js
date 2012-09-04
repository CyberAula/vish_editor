ig.module(
	'plugins.rpgwizard.explanation-manager'
)
.requires(
	'impact.impact'
)
.defines(function(){
    
ig.explanationManager = ig.Class.extend({
    canvasContext: null,
    slidesArray: new Array(),      //array of the images to show (img objects)
    currentSlide: null,           //index of the slide shown
    
    init: function(canvasElem){
            this.canvasContext = canvasElem.getContext("2d");
    },
       
    addSlide: function(slide){
        this.slidesArray.push(slide);
    },
       
    update: function(){
        if (ig.input.pressed('action')){
            if(this.currentSlide==this.slidesArray.length-1){
                this.currentSlide = null;		
            }
	    else{
		this.currentSlide++;
	    }
	}
    },
    
    draw: function(){
        if(this.currentSlide < this.slidesArray.length){
            ig.system.context.drawImage(this.slidesArray[this.currentSlide], 0, 0);
        }
    },
    
    isPlaying: function(){
        if(this.currentSlide != null){
            return true;
        }
        else{
            return false;
        }
    },
    
    start: function(){
        this.currentSlide = 0;
    }
    
});

});