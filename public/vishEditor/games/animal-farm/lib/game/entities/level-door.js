ig.module(
	'game.entities.level-door'
)
.requires(
	'plugins.rpgwizard.collisionable'
)
.defines(function(){
	
EntityLevelDoor = EntityCollisionable.extend({
	collides: ig.Entity.COLLIDES.FIXED,
	animSheet: new ig.AnimationSheet('media/entities/door1.png', 32, 32 ),
	size: {x: 32, y: 12},
	offset: {x:0,y:20},
	
	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );		
		this.addAnim('closed', 0.1, [0] );
	},
	
	
	check: function( other ) {
		if(ig.game.status.finishedThisLevelTasks()){
			ig.game.loadRPGMap(LevelLibrary);
		}
		else{
			ig.game.myMessagesManager.addMessage(ig.MESSAGES.NEXT_LEVEL_NOT_ALLOWED);
		}
	}
});

});