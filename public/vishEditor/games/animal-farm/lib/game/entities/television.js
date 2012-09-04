ig.module(
	'game.entities.television'
)
.requires(
	'impact.entity'
)
.defines(function(){
	
EntityTelevision = ig.Entity.extend({
	size: {x: 31, y: 4},
	offset: {x:0,y:38},
	type: ig.Entity.TYPE.B, 
	checkAgainst: ig.Entity.TYPE.A,
	collides: ig.Entity.COLLIDES.FIXED,
	animSheet: new ig.AnimationSheet('media/entities/television.png', 31, 42 ),
	videoToShow: 0,

	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		
		this.addAnim( 'idle', 0.1, [0] );	
	},
	
	update: function() {
		player = ig.game.getEntitiesByType( EntityBoy )[0];
		if(!player.locked && ig.input.pressed('action') && this.distanceTo(player)<20) {
                        player.locked = true;
			ig.game.myVideoManager.playVideo(this.videoToShow);
			this.videoToShow++;
		}		
		this.parent();
	}	
	
});

});