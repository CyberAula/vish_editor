ig.module(
	'game.entities.exit-door'
)
.requires(
	'plugins.rpgwizard.collisionable'
)
.defines(function(){
	
EntityExitDoor = EntityCollisionable.extend({
	collides: ig.Entity.COLLIDES.FIXED,
	size: {x: 60, y: 10},
	
	check: function( other ) {
                var playerPosition = {x: 200, y:140};
		ig.game.loadRPGMap(LevelWelcome, playerPosition);
	}
});

});