ig.module(
	'game.entities.gardener'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityGardener = ig.Entity.extend({
	
	size: {x:20, y:5},
	offset: {x:7,y:40},
	type: ig.Entity.TYPE.A,
	collides: ig.Entity.COLLIDES.FIXED,
	animSheet: new ig.AnimationSheet('media/characters/Jardinero.png', 99/3, 195/4 ),
	gardenerDialog: null,
	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		
		this.addAnim('idle', 0.1, [1] );
		this.addAnim('walkingUp',0.1,[9,10,11]);
		this.addAnim('walkingRight',0.1,[6,7,8]);
		this.addAnim('walkingDown',0.1,[0,1,2]);
		this.addAnim('walkingLeft',0.1,[3,4,5]);
		
		//create the dialogs for this NPC
		this.gardenerDialog = new ig.dialogManager();
	},
	
        update: function(){	    
		var player = ig.game.getEntitiesByType( EntityBoy )[0];
		if(!player.locked && ig.input.pressed('action') && this.distanceTo(player)<50){
			this.initDialog();
		}
		else if(this.gardenerDialog.working){
			this.gardenerDialog.update();
		}
		this.parent();
        },
	
	initDialog: function(){
		//create the dialogs for the gardener
		this.gardenerDialog.addText("Hey! How are you? I hope you are enjoying your visit.");
		this.gardenerDialog.addText("By the way, do you see the path up in the right corner? If you go there you will find Lysa, our veterinarian in charge of the lynxes.");
		this.gardenerDialog.addText("If you learn all the important things related to the lynxes, maybe she will allow you to feed them. It is an awesome experience!");
		this.gardenerDialog.addText("Perhaps visiting the library is a good idea. Follow this path and turn left in the sign to find it.");
		this.gardenerDialog.addText("Good luck!");
		this.gardenerDialog.finishingEvent = ig.EVENTS.GARDENER_DIALOG_END;
		this.gardenerDialog.start();
	},
        
        draw: function() {		
		if(this.gardenerDialog.working){			
			this.gardenerDialog.draw();
		}
		this.parent();
	}
		
});

});