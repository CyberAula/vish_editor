ig.module(
	'game.entities.veterinarian'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityVeterinarian = ig.Entity.extend({
	
	size: {x:20, y:5},
	offset: {x:7,y:40},
	type: ig.Entity.TYPE.A,
	collides: ig.Entity.COLLIDES.FIXED,
	animSheet: new ig.AnimationSheet('media/characters/veterinaria.png', 97/3, 197/4 ),
	vetDialog: null,
	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		
		this.addAnim('idle', 0.1, [1] );
		this.addAnim('walkingUp',0.1,[9,10,11]);
		this.addAnim('walkingRight',0.1,[6,7,8]);
		this.addAnim('walkingDown',0.1,[0,1,2]);
		this.addAnim('walkingLeft',0.1,[3,4,5]);
		
		//create the dialogs for this NPC
		this.vetDialog = new ig.dialogManager();
	},
	
	update: function(){	    
		var player = ig.game.getEntitiesByType( EntityBoy )[0];
		if(!player.locked && ig.input.pressed('action') && this.distanceTo(player)<50){
			this.initDialog();
		}
		else if(this.vetDialog.working){
			this.vetDialog.update();
		}
		this.parent();
        },
	
	initDialog: function(){
		//create the dialogs for the gardener
		this.vetDialog.addText("Hello!");
		this.vetDialog.addText("Are you here to help me feeding the lynxes?");
		this.vetDialog.addText("Mmmm� before allowing you, I have to test you in order to discover if you know how to take care of lynxes.");
		var question = new ig.multipleChoiceQuestion("How many Lynx genus species exist? I will gave you no clues this time, but I will give you 3 options:", new Array("a) 4", "b) 2", "c) 1"), 'a', 'b', 'c', "Well done! Now you can enter the cage and feed the lynxes.", "Sorry, try again...");
		this.vetDialog.addQuestion(question);
		this.vetDialog.finishingEvent = ig.EVENTS.VET_DIALOG_END;
		this.vetDialog.start();
	},
        
        draw: function() {		
		if(this.vetDialog.working){			
			this.vetDialog.draw();
		}
		this.parent();
	}
			
});

});