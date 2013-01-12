ig.module(
	'game.entities.player'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityPlayer = ig.Entity.extend({
	
	size: {x:20, y:6},
	offset: {x:10,y:60},
	type: ig.Entity.TYPE.A,
	collides: ig.Entity.COLLIDES.ACTIVE,
	animSheet: new ig.AnimationSheet('media/entities/princess.png', 123/4, 265/4 ),
	zIndex: 0,
        
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		
		this.addAnim('idle', 0.1, [0] );
		this.addAnim('walkingUp',0.1,[12,13,14,15]);
		this.addAnim('walkingRight',0.1,[11,10,9,8]);
		this.addAnim('walkingDown',0.1,[0,1,2,3]);
		this.addAnim('walkingLeft',0.1,[4,5,6,7]);
	},
		
	update: function() {
		
		if( ig.input.state('up') ) {
			this.currentAnim = this.anims.walkingUp;
			this.vel.x = 0;
			this.vel.y = -100;
		}
		else if( ig.input.state('down') ) {
			this.currentAnim = this.anims.walkingDown;
			this.vel.x = 0;
			this.vel.y = 100;
		}
		else if( ig.input.state('left') ) {
			this.currentAnim = this.anims.walkingLeft;
			this.vel.y = 0;
			this.vel.x = -100;
		}
		else if( ig.input.state('right') ) {
			this.currentAnim = this.anims.walkingRight;
			this.vel.y = 0;
			this.vel.x = 100;
		}
		else {
			this.currentAnim = this.anims.idle;
			this.vel.y = 0;
			this.vel.x = 0;
		}
		
		this.parent();
	}
});

});