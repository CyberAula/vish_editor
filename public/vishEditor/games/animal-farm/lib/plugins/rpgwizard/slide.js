ig.module(
	'plugins.rpgwizard.slide'
)
.requires(
	'impact.impact'
)
.defines(function(){
	
ig.slide = ig.Class.extend({    
    img: null,
    width: null,
    height: null,
    caption: null,
    
    init: function(src, width, height, caption ){
	this.img = new Image();
	this.img.src = src;
	this.width = width;
	this.height = height;
	this.caption = caption;	
    }
    
    
});

});