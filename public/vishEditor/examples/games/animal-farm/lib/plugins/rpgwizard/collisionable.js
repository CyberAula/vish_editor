ig.module(
	'plugins.rpgwizard.collisionable'
)
.requires(
	'impact.entity'
)
.defines(function(){
	
EntityCollisionable = ig.Entity.extend({
	size: {x: 32, y: 10},

	type: ig.Entity.TYPE.B, 
	checkAgainst: ig.Entity.TYPE.A,
	collides: ig.Entity.COLLIDES.PASSIVE,
	level: null,

	check: function( other ) {
		ig.game.myDirector.jumpTo(this.level);
	}
});

});