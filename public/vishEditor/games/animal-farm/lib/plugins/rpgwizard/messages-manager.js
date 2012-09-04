ig.module(
	'plugins.rpgwizard.messages-manager'
)
.requires(
	'impact.impact'
)
.defines(function(){
    
ig.messagesManager = ig.Class.extend({
    messagesArray: new Array(),    //array with the messages to be presented
    index: null,  //pointer to the place in messagesArray of the presented message
    
    textStyle: 'italic 22px sans-serif',
    xToCloseTextStyle: 'italic 10px sans-serif',
    xToCloseMessageText: 'Press x to close this message',
    
    init: function(){
        //this.messagesArray.push(null);   //first message null, so I can initialize the index to 0
        this.index = 0;
    },
    
    addMessage: function(message){
        //duda para Victor, cómo hacer que no se añadan muchas veces un mismo mensaje al ocurrir un evento de colisión por ejemplo muchas veces
        //lo que he hecho yo es no permitir que se añada un mismo mensaje (por su id) si no está separado al menos 15 segundos en el tiempo
	
	//XXX hacer que sean 5 segundos pero desde que se dejó de mostrar el mensaje
        if(this.messagesArray.length==0 || this.messagesArray[this.messagesArray.length-1].id!=message.id || this.messagesArray[this.messagesArray.length-1].timestamp < Date.now()-15000){  
            //update message timestamp
            message.timestamp = Date.now();
            this.messagesArray.push(message);
        }
    },
    
    update: function(){
        if (ig.input.pressed('x')){
            this.index++;
	}
    },
    
    draw: function(){
        if(this.index < this.messagesArray.length){
            var xToPlaceBox = 140;
            var yToPlaceBox = 100;
	    
	    //we draw the tablet to write the missions
	    var img = new Image();
	    img.src = "media/decorations/ipad33.png";
	    ig.system.context.drawImage(img, xToPlaceBox, yToPlaceBox);
	        
            
            ig.system.context.font = this.textStyle;
            ig.system.context.textBaseline = 'alphabetic';            
            ig.system.context.fillStyle = 'white';
	    
            var lines = this.getLines(ig.system.context, this.messagesArray[this.index].text, 300, this.textStyle);
            for(var line = 0; line < lines.length; line++) {
                ig.system.context.fillText(lines[line], xToPlaceBox + 70, yToPlaceBox + 100 + line*30);
            }
            
            ig.system.context.font = this.xToCloseTextStyle;
            ig.system.context.fillText(this.xToCloseMessageText, xToPlaceBox + 200, yToPlaceBox + 350 - 10);
        }
    },
    
    isPlaying: function(){
        if(this.index < this.messagesArray.length){
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