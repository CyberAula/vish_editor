ig.module(
	'game.entities.door'
)
.requires(
	'impact.entity'
)
.defines(function(){
	
EntityDoor = ig.Entity.extend({
	size: {x: 32, y: 12},
	offset: {x:0,y:20},
	type: ig.Entity.TYPE.B, 
	checkAgainst: ig.Entity.TYPE.A,
	collides: ig.Entity.COLLIDES.FIXED,
	animSheet: new ig.AnimationSheet('media/entities/door.png', 32, 32 ),
	status: "closed",

	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		
		this.addAnim('closed', 0.1, [0] );
		this.addAnim('open',0.1,[1]);
	},
	
	update: function() {
		player = ig.game.getEntitiesByType( EntityBoy )[0];
		if( ig.input.pressed('action') && this.distanceTo(player)<20) {
			this.changeStatus();
		}		
		this.parent();
	},	
	
	changeStatus: function(){
		//change the collides status from fixed to never and back, and the animation
		this.collides = (this.collides == ig.Entity.COLLIDES.FIXED) ? ig.Entity.COLLIDES.NEVER:ig.Entity.COLLIDES.FIXED;
		this.currentAnim = (this.currentAnim == this.anims.closed) ? this.anims.open:this.anims.closed;
		this.status = (this.status == "closed") ? "open":"closed";
	}
});

});