ig.module(
	'game.entities.video'
)
.requires(
	'impact.entity'
)
.defines(function(){
	
EntityVideo = ig.Entity.extend({
	size: {x: 10, y: 10},
	type: ig.Entity.TYPE.B,
	checkAgainst: ig.Entity.TYPE.A,
	collides: ig.Entity.COLLIDES.FIXED,
	animSheet: new ig.AnimationSheet('media/entities/transparent.png', 34, 35 ),
        
        
	init: function( x, y, settings ) {
		this.parent( x, y, settings );		
		this.addAnim( 'idle', 0.1, [0] );	
	},
	
	update: function() {
		player = ig.game.getEntitiesByType( EntityBoy )[0];
		if(!player.locked && ig.input.pressed('action') && this.distanceTo(player)<20) {
                        player.locked = true;
			ig.game.myVideoManager.playVideo(0);
		}
		this.parent();
	}

});

});