ig.module(
	'game.entities.blackboard'
)
.requires(
	'impact.entity'
)
.defines(function(){
	
EntityBlackboard = ig.Entity.extend({
	size: {x: 96, y: 4},
	offset: {x:0,y:30},
	type: ig.Entity.TYPE.B, 
	checkAgainst: ig.Entity.TYPE.A,
	collides: ig.Entity.COLLIDES.FIXED,
	animSheet: new ig.AnimationSheet('media/entities/blackboard.png', 96, 34 ),

	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		
		this.addAnim( 'idle', 0.1, [0] );	
	},
	
	update: function() {
		player = ig.game.getEntitiesByType( EntityBoy )[0];
		if(ig.input.pressed('action') && this.distanceTo(player)<20) {
                        player.locked = true;
			if(ig.game.getEntitiesByType( EntityPicture )[0]==null){
                            //create a pictureManager entity
                            var settings = null;  //{pos: {x: ig.game.screen.x, y: ig.game.screen.y} };  //position, 0,0 of the level
                            ig.game.spawnEntity(EntityPicture, 0, 0, settings );
                        }
                        
		}		
		this.parent();
	}	
	
});

});