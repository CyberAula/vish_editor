ig.module(
	'game.entities.boy'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityBoy = ig.Entity.extend({
	
	size: {x:20, y:5},
	offset: {x:7,y:40},
	type: ig.Entity.TYPE.A,
	collides: ig.Entity.COLLIDES.ACTIVE,
	animSheet: new ig.AnimationSheet('media/characters/personajeprinc.png', 97/3, 197/4 ),
	lock: false,            //if true stop "listening" to user input
	
	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		
		this.addAnim('idle', 0.1, [1] );
		this.addAnim('walkingUp',0.1,[9,10,11]);
		this.addAnim('walkingRight',0.1,[6,7,8]);
		this.addAnim('walkingDown',0.1,[0,1,2]);
		this.addAnim('walkingLeft',0.1,[3,4,5]);
	},
		
	update: function() {
		//this should go in defaultcharacter
                if(this.vel.y != 0){
                    ig.game.sortEntitiesByYPosition();
                }
                
		if(!this.locked){
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
		}
		else{
			this.currentAnim = this.anims.idle;
			this.vel.y = 0;
			this.vel.x = 0;
			
		}
		
		this.parent();
	}
});

});