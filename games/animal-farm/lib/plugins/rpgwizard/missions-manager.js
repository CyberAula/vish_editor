ig.module(
	'plugins.rpgwizard.missions-manager'
)
.requires(
	'impact.impact'
)
.defines(function(){
    
ig.missionsManager = ig.Class.extend({    
    working: false,   //not called isPlaying to write a function called isPlaying() as in the other managers (slidesManager, dialogManager)
    textStyle: 'italic 22px sans-serif',    
    xToCloseTextStyle: 'italic 10px sans-serif',
    xToCloseMessageText: 'Press x to close this message',
    
    init: function(){        
    },
    
    update: function(){
        if (ig.input.pressed('x')){
            this.working = false;
	}
        else if(ig.input.pressed('missions')){
            this.working = true;
        }
    },
    
    draw: function(){
        if(this.working){
            var xToPlaceBox = 140;
            var yToPlaceBox = 100;
            //we draw the box for the slide
            var img = new Image();
            img.src = "media/decorations/ipad33.png";
            ig.system.context.drawImage(img, xToPlaceBox, yToPlaceBox);
            
            ig.system.context.fillStyle = 'white';
            ig.system.context.fillText("My missions:", xToPlaceBox + 60, yToPlaceBox + 80);	
            
            var taskManager = ig.game.status.getCurrentTaskManager();
            
            var lineNumber = 0;
            if(taskManager){
                for(var i=0; i<taskManager.tasksArray.length; i++){
                    if(taskManager.tasksArray[i].finished)
                    {
                        ig.system.context.fillStyle = "rgb(140,140,140)";
                    }
                    else{
                        ig.system.context.fillStyle = 'white';
                    }
                    var lines = this.getLines(ig.system.context, " - " + taskManager.tasksArray[i].text, 400, this.textStyle);
                    for(var line = 0; line < lines.length; line++) {
                        ig.system.context.fillText(lines[line], xToPlaceBox + 60, yToPlaceBox + 150 + lineNumber*30);
                        lineNumber++;
                    }	        
                }
            }
            ig.system.context.fillStyle = 'white';
            ig.system.context.font = this.xToCloseTextStyle;
            ig.system.context.fillText(this.xToCloseMessageText, xToPlaceBox + 200, yToPlaceBox + 350 - 10);
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