ig.module(
	'game.entities.info-point'
)
.requires(
	'impact.entity'
)
.defines(function(){
	
EntityInfoPoint = ig.Entity.extend({
	size: {x: 30, y: 10},
	offset: {x:2,y:22},
	type: ig.Entity.TYPE.B, 
	checkAgainst: ig.Entity.TYPE.A,
	collides: ig.Entity.COLLIDES.FIXED,
	animSheet: new ig.AnimationSheet('media/entities/infosign.png', 34, 33),
        infoPointDialog: null,

	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		this.addAnim( 'idle', 0.1, [0] );
                this.infoPointDialog = new ig.dialogManager();
	},
	
        update: function(){	    
		player = ig.game.getEntitiesByType( EntityBoy )[0];
		if(!player.locked && ig.input.pressed('action') && this.distanceTo(player)<40) {                        
			this.initDialog();
		}
		else if(this.infoPointDialog.working) {		
			this.infoPointDialog.update();
		}
		this.parent();
        },
        
	initDialog: function(){
		//create the dialogs for the Information Point
		this.infoPointDialog.addText("Welcome to the Lynx area at Doñana Park! ");
		this.infoPointDialog.addText("In this virtual excursion you will learn a lot of things about a marvelous animal: the Lynx pardinus also known as Iberian lynx!");
		this.infoPointDialog.addText("To know things about it, you can talk with the people in charge of take care of the lynxes. Besides, you can consult the different videos and slides in order to complete the missions available.");
		this.infoPointDialog.addText("Enjoy!");
		this.infoPointDialog.finishingEvent = ig.EVENTS.INFORMATION_POINT_END;
		
		this.infoPointDialog.start();
	},
        
        draw: function() {		
		if(this.infoPointDialog.working){			
			this.infoPointDialog.draw();
		}
		this.parent();
	}
	
});

});