ig.module(
	'game.entities.goat'
)
.requires(
	'impact.entity',
	'plugins.rpgwizard.dialog-manager'
)
.defines(function(){

EntityGoat = ig.Entity.extend({
	
	size: {x:20, y:20},
	offset: {x:8,y:10},
	type: ig.Entity.TYPE.B,
	collides: ig.Entity.COLLIDES.ACTIVE,
	animSheet: new ig.AnimationSheet('media/entities/goat.png', 96/3, 175/4 ),
        isScaping: false,
	goatDialog : null,
	lock: false,            //if true stop "listening" to user input
	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		
		this.addAnim('idle', 0.1, [1] );
		this.addAnim('walkingUp',0.1,[9,10,11]);
		this.addAnim('walkingRight',0.1,[6,7,8]);
		this.addAnim('walkingDown',0.1,[0,1,2]);
		this.addAnim('walkingLeft',0.1,[3,4,5]);
                
		this.addAnim('lookingRight', 0.1, [7]);
		this.addAnim('lookingLeft', 0.1, [4]);
		this.addAnim('lookingUp', 0.1, [10]);
		this.addAnim('lookingDown', 0.1, [1]);
		
		//create the dialogs for this NPC
		this.goatDialog = new ig.dialogManager();
		
                this.timer = new ig.Timer(1);                
	},
	
        update: function(){	    
	    var door = ig.game.getEntitiesByType( EntityDoor )[0];
	    var player = ig.game.getEntitiesByType( EntityBoy )[0];
            this.updateStatus(player, door);	    
	    if(this.goatDialog.working) {		
		this.goatDialog.update();
	    }
	    else if(this.isScaping){
                this.tryToScape();               
            }
            else if (this.timer.delta() > 0) {
               this.changeDirection(); 
            }	    
	    this.parent();
        },
        
	//method to check if the goat has to scape or is talking to the main character
	updateStatus: function(player, door){		
		if(door.status=="open" && this.isInsideFence()){
			this.isScaping = true;
		}
		else if(this.isScaping && this.pos.y < door.pos.y + 50){  //we do not consider that it has scaped until 50px away of the door (just in case)
			this.isScaping = true;
		}
		else if(!this.locked && ig.input.pressed('action') && this.distanceTo(player)<50){
			this.initDialog();
			this.stopGoatAndPlaceIt(player);
			this.isScaping = false;
			this.locked = true;
			player.locked = true;
		}		
		else{
			this.isScaping = false;  //if door is closed or goat is outside fence
		}
		
		if(!this.goatDialog.working){
			this.locked = false;    //dialog finished release lock
			player.locked = false;
		}
	},
	
	initDialog: function(){
		//create the dialogs for this NPC
		this.goatDialog = new ig.dialogManager();
		this.goatDialog.addText("Hello I am a magic goat, I can talk. The domestic goat (Capra aegagrus hircus) is a subspecies of goat domesticated from the wild goat of southwest Asia and Eastern Europe. The goat is a member of the Bovidae family and is closely related to the sheep as both are in the goat-antelope subfamily Caprinae. There are over three hundred distinct breeds of goat. Goats are one of the oldest domesticated species. Goats have been used for their milk, meat, hair, and skins over much of the world. In the twentieth century they also gained in popularity as pets.");
		this.goatDialog.addText("I will make you a question:");
		var question = new ig.multipleChoiceQuestion("How many legs does a goat have? I will gave you no clues this time, but I will give you 3 options:", new Array("a) 4", "b) 2", "c) 1"), 'a', 'b', 'c', "You are very clever, congratulations!", "Sorry, try again...");
		this.goatDialog.addQuestion(question);
		
		//add event of dialog finishing to goat dialog
		this.goatDialog.finishingEvent = ig.EVENTS.GOAT_DIALOG_END;
		
		this.goatDialog.start();
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
        
        tryToScape: function(){
            var door = ig.game.getEntitiesByType( EntityDoor )[0];
            if(this.pos.x < door.pos.x+2){                        
                this.vel.x = 164;
                this.vel.y = 0;
                this.currentAnim = this.anims.walkingRight;
            }
            else if(this.pos.x > door.pos.x+6){                    
                this.vel.x = -164;
                this.vel.y = 0;
                this.currentAnim = this.anims.walkingLeft;
            }
            else if(this.pos.y < door.pos.y + 50){
                this.vel.y = 164;
                this.vel.x = 0;
                this.currentAnim = this.anims.walkingDown; 
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
        
        isInsideFence: function(){
            var door = ig.game.getEntitiesByType( EntityDoor )[0];
            if(this.pos.x> door.pos.x-60 && this.pos.x<door.pos.x+40 && this.pos.y>door.pos.y-115 && this.pos.y<door.pos.y-20)
                return true;
            else
                return false;
        },
		
	stopGoatAndPlaceIt: function(player){
		this.vel.y = 0;
                this.vel.x = 0;
		if(Math.abs(this.pos.x - player.pos.x) < Math.abs(this.pos.y - player.pos.y)){   //nearer in the Y axis -> look Up or down
			if(this.pos.y > player.pos.y){
				this.currentAnim = this.anims.lookingUp;
			}
			else{
				this.currentAnim = this.anims.lookingDown;
			}
		}
		else{
			if(this.pos.x > player.pos.x){
				this.currentAnim = this.anims.lookingLeft;
			}
			else{
				this.currentAnim = this.anims.lookingRight;
			}
		}
	},
	
	draw: function() {		
		if(this.goatDialog.working){			
			this.goatDialog.draw();
		}
		this.parent();
	}	
	
});

});