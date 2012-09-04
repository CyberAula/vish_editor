ig.module(
	'game.entities.level-back'
)
.requires(
	'plugins.rpgwizard.collisionable'
)
.defines(function(){
	
EntityLevelBack = EntityCollisionable.extend({
	collides: ig.Entity.COLLIDES.FIXED,
	size: {x: 8, y: 100},
	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
	},
	
	check: function( other ) {		
                        var playerPosition = {x: 760, y:190};
			ig.game.loadRPGMap(LevelWelcome, playerPosition);		
	}
});

});