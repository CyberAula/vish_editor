ig.module(
	'plugins.rpgwizard.multiple-choice-question'
)
.requires(
	'impact.impact'
)
.defines(function(){
	
ig.multipleChoiceQuestion = ig.Class.extend({
        text: "How many legs does a goat have? I will gave you no clues this time, but I will give you 3 options:",
	options: new Array("a) 4", "b) 2", "c) 1"),
        rightAnswer: 'a',  //position in the array of the right answer
	wrongAnswer1: 'b',
        wrongAnswer2: 'c',
        rightAnswerText: "You are very clever, congratulations!",
	wrongAnswerText: "Sorry, try again...",        
	isWaitingForAnswer: true,
	isRightAnswer: false,
	working: false,    //to indicate dialogManager that this item has finished
	textStyle: 'italic 22px sans-serif',
	
	
	init: function(text, options, rightAnswer, wrongAnswer1, wrongAnswer2, rightAnswerText, wrongAnswerText){
		this.text = text;
		this.rightAnswer = rightAnswer;
		this.wrongAnswer1 = wrongAnswer1;
		this.wrongAnswer2 = wrongAnswer2;
		this.rightAnswerText = rightAnswerText;
		this.wrongAnswerText = wrongAnswerText;
		this.working = true;
	},
	
	update: function(){
		if(this.isWaitingForAnswer){
			if( ig.input.pressed('answer_'+this.rightAnswer)) {
			    this.isRightAnswer = true;
			    this.isWaitingForAnswer = false;
			}
			else if( ig.input.pressed('answer_'+this.wrongAnswer1) || ig.input.pressed('answer_'+this.wrongAnswer2) ) {
			    this.isRightAnswer = false;
			    this.isWaitingForAnswer = false;
			}
		}
		else if(this.isRightAnswer && ig.input.pressed('action')){
		    this.working = false;		    
		}
		else if(!this.isRightAnswer && ig.input.pressed('action')){
		    this.isWaitingForAnswer = true;
		    this.isRightAnswer = false;
		}
	},	
	
	draw: function(){
		//we draw a box to be the background of the text
		var img = new Image();
		img.src = "media/decorations/conversation.png";
		ig.system.context.drawImage(img, 0, 445);
		
                var textStyle = 'italic 22px sans-serif';
                ig.system.context.fillStyle = 'black';
                ig.system.context.font = textStyle;
                ig.system.context.textBaseline = 'alphabetic';
                
		if(this.isWaitingForAnswer){                    
                    //first of all the question
                    var lines = this.getLines(ig.system.context, this.text, 640, textStyle);     
                    for(var line = 0; line < lines.length; line++) {
                        ig.system.context.fillText(lines[line], 60, 485 + line*22);
                    }                    
                    //now the answers                
                    for(var index = 0; index < this.options.length; index++) {
                        ig.system.context.fillText(this.options[index], 60, 485 + lines.length*22 + index*22);
                    }
                }
                else{
                    if(this.isRightAnswer){
                        var lines = this.getLines(ig.system.context, this.rightAnswerText, 640, textStyle);     
                        for(var line = 0; line < lines.length; line++) {
                            ig.system.context.fillText(lines[line], 60, 505 + line*22);
                        }                    
                    }
                    else{
                        var lines = this.getLines(ig.system.context, this.wrongAnswerText, 640, textStyle);     
                        for(var line = 0; line < lines.length; line++) {
                           ig.system.context.fillText(lines[line], 60, 505 + line*22);
                        }
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


