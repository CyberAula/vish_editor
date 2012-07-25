ig.module(
	'game.entities.level-changer'
)
.requires(
	'plugins.rpgwizard.collisionable'
)
.defines(function(){
	
EntityLevelChanger = EntityCollisionable.extend({
	collides: ig.Entity.COLLIDES.FIXED,
	size: {x: 8, y: 100},
	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
	},
	
	check: function( other ) {
		if(ig.game.status.finishedThisLevelTasks()){
                        var playerPosition = {x: 20, y:190};
			ig.game.loadRPGMap(LevelLinceCage, playerPosition);
		}
		else{
			ig.game.myMessagesManager.addMessage(ig.MESSAGES.NEXT_LEVEL_NOT_ALLOWED);
		}
	}
});

});