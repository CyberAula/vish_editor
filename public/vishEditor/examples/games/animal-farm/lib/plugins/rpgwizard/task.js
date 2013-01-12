ig.module(
	'plugins.rpgwizard.task'
)
.requires(
	'impact.impact'
)
.defines(function(){
	
ig.task = ig.Class.extend({    
    text: "",
    reward: 0, //points that the user win if passes this task
    finishingEvent: null, //event that indicates that the user has completed the educational content and this task is finished
    finished: false,   //indicates that this task has been completed
    
    init: function( text, reward, finishingEvent){
	this.text = text;
	this.reward = reward;
	this.finishingEvent = finishingEvent;
	var self = this;
	
	$("#event-router").on(this.finishingEvent, function(event){	    
	    if(!self.finished){
		self.finished = true;
		ig.game.status.points += self.reward;
	    }
	});
    }
    
    
});

});