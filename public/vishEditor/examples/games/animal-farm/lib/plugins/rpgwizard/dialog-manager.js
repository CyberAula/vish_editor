ig.module(
	'plugins.rpgwizard.dialog-manager'
)
.requires(
	'impact.impact'
)
.defines(function(){
	
ig.dialogManager = ig.Class.extend({
    dialogArray: new Array(),
    dialogIndex: 0,   //XXX no mola, hay que ver cómo hacerlo mejor, es así para que el primer "action" que llega no se cuente (aumenta de -1 a 0) y comience por la frase 0
    working: false,
    textStyle: 'italic 22px sans-serif',
    numLines: 3,   //number of lines that we write at a time
    finishingEvent: null,  //event that is thrown in element "event-router"  when this dialog finishes
    
    
    addText: function(text){         
        var lines = this.getLines(ig.system.context, text, 640, this.textStyle);
        if(lines.length <= this.numLines){
            this.dialogArray.push(text);
        }
        else{
            //2 or more items in the dialogArray
            var linesAdded = 0;
            var phraseToAdd = "";
            for(var line = 0; line < lines.length; line++) {
                phraseToAdd += (" " + lines[line]);
                linesAdded++;
                if(linesAdded >= this.numLines){
                    this.dialogArray.push(phraseToAdd);
                    phraseToAdd = "";
                    linesAdded = 0;                    
                }
            }
            //if lines.lenght is not a multiple of numLines, we have to add the last iteration
            if(lines.length % this.numLines){
                this.dialogArray.push(phraseToAdd);
            }
        }
    },
    
    addQuestion: function(question){
        this.dialogArray.push(question);    
    },
        
    update: function(){
        if( (this.dialogArray[this.dialogIndex] instanceof ig.multipleChoiceQuestion) && this.dialogArray[this.dialogIndex].working) {
            //if I am in a question, updatequestion
            this.dialogArray[this.dialogIndex].update();
        }
        else if (ig.input.pressed('action')){
            this.dialogIndex++;
	}
        
        if( (this.dialogArray[this.dialogIndex] instanceof ig.multipleChoiceQuestion) && !this.dialogArray[this.dialogIndex].working && ig.input.pressed('action')) {
            this.dialogIndex++;
        }
        
        if(this.dialogIndex >= this.dialogArray.length){
            this.dialogIndex = -1;
            this.working = false;
	    var player = ig.game.getEntitiesByType( EntityBoy )[0];
	    player.locked = false;
	    if(this.finishingEvent != null){
		$("#event-router").trigger(this.finishingEvent, []);
	    }
        }
    },
    
    draw: function(){
        if( this.dialogArray[this.dialogIndex] instanceof ig.multipleChoiceQuestion && this.dialogArray[this.dialogIndex].working){
            this.dialogArray[this.dialogIndex].draw();
        }
        else{
            this.drawText(this.dialogArray[this.dialogIndex]);
        }
    },    
    
    start: function(){
        this.working = true;
	var player = ig.game.getEntitiesByType( EntityBoy )[0];
	player.locked = true;
    },    
    
    drawText: function(text){
        //we draw a box to be the background of the text
	var img = new Image();
	img.src = "media/decorations/conversation.png";
	ig.system.context.drawImage(img, 0, 445);	
	
        ig.system.context.fillStyle = "rgb(34,139,34)";        
        
        var lines = this.getLines(ig.system.context, text, 680, this.textStyle);                    
        ig.system.context.fillStyle = 'black';
        ig.system.context.font = this.textStyle;
        ig.system.context.textBaseline = 'alphabetic';
        for(var line = 0; line < lines.length; line++) {
            ig.system.context.fillText(lines[line], 60, 495 + line*30);
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