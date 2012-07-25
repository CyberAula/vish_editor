ig.module(
	'plugins.rpgwizard.message'
)
.requires(
	'impact.impact'
)
.defines(function(){
	
ig.message = ig.Class.extend({    
    id: null,
    text: null,
    timestamp: 0,   //timestamp used to avoid adding the same message multiple times
        
    init: function(id, text ){
	this.id = id;
        this.text = text;
        this.timestamp = Date.now();
    }
    
    
});

});