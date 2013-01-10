ig.module(
	'game.entities.lynx'
)
.requires(
	'impact.entity',
	'plugins.rpgwizard.dialog-manager'
)
.defines(function(){

EntityLynx = ig.Entity.extend({
	
	size: {x:70, y:10},
	offset: {x:0,y:40},
	type: ig.Entity.TYPE.B,
	collides: ig.Entity.COLLIDES.ACTIVE,
	animSheet: new ig.AnimationSheet('media/entities/lynx.png', 210/3, 240/4 ),
	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		
		this.addAnim('idle', 0.1, [1] );
		this.addAnim('walkingUp',0.1,[9,10,11]);
		this.addAnim('walkingRight',0.1,[6,7,8]);
		this.addAnim('walkingDown',0.1,[0,1,2]);
		this.addAnim('walkingLeft',0.1,[3,4,5]);
                
                this.timer = new ig.Timer(1);                
	},
	
        update: function(){	    
	    var door = ig.game.getEntitiesByType( EntityDoor )[0];
	    var player = ig.game.getEntitiesByType( EntityBoy )[0];
            if (this.timer.delta() > 0) {
               this.changeDirection(); 
            }	    
	    this.parent();
        },
        
	
	handleMovementTrace: function( res ) {
		this.parent( res );
		
		// collision, stop
		if( res.collision.x || res.collision.y ) {
		    this.vel.y = 0;
                    this.vel.x = 0;
                    this.currentAnim = this.anims.idle; 
		}
	},	
            
        
        changeDirection: function(){
            var randomDirection=  Math.floor(Math.random()*5) + 1;
            var nextChange = Math.random();
                    
            if( randomDirection == 1  ) {
                this.vel.x = -64;
                this.vel.y = 0;
                this.currentAnim = this.anims.walkingLeft;                
            }
            else if( randomDirection == 3  ) {
                this.vel.x = 64;
                this.vel.y = 0;
                this.currentAnim = this.anims.walkingRight;
            }
            else if( randomDirection == 2  ) {
                this.vel.y = -64;
                this.vel.x = 0;
                this.currentAnim = this.anims.walkingUp;
            }    
            else if( randomDirection == 4 ) {
                this.vel.y = 64;
                this.vel.x = 0;
                this.currentAnim = this.anims.walkingDown;  
            }
            else 
            { 
                this.vel.y = 0;
                this.vel.x = 0;
                this.currentAnim = this.anims.idle; 
            }
            this.timer.set(nextChange);
        },
        
	draw: function() {
		this.parent();
	}	
	
});

});