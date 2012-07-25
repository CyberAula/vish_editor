ig.module( 
	'game.main' 
)
.requires(
	'impact.game',
	'impact.font',
	//'impact.debug.debug',
		
	'game.entities.player',
	'game.entities.boy',
	'game.entities.gardener',
	'game.entities.veterinarian',
	'game.entities.video',
	'game.entities.door',
	'game.entities.goat',
	'game.entities.blackboard',
	'game.entities.slider',
	'game.entities.television',
	'game.entities.level-door',
	'game.entities.exit-door',
	'game.entities.info-point',
	'game.entities.level-changer',
	'game.entities.level-back',
	'game.entities.lynx',
	'game.entities.kitten',

	'game.levels.main',
	'game.levels.library',
	'game.levels.welcome',
	'game.levels.linceCage',
	
	'game.events',
	'game.messages',
	
	'plugins.director.director',
	'plugins.rpgwizard.video-manager',
	'plugins.rpgwizard.dialog-manager',
	'plugins.rpgwizard.multiple-choice-question',
	'plugins.rpgwizard.status-manager',
	'plugins.rpgwizard.task-manager',
	'plugins.rpgwizard.task',
	'plugins.rpgwizard.messages-manager',
	'plugins.rpgwizard.missions-manager',
	'plugins.rpgwizard.message',
	'plugins.rpgwizard.slide',
	'plugins.rpgwizard.slides-manager',
	'plugins.rpgwizard.explanation-manager'

)
.defines(function(){

MyGame = ig.Game.extend({
	
	// Load a font
	font: new ig.Font( 'media/04b03.font.png' ),
	myDirector: null,
	myVideoManager: null,
	mySlidesManager: null,
	status: null,
	myMissionsManager: null,
	myExplanationManager: null,
	
	init: function() {
		ig.input.bind( ig.KEY.UP_ARROW, 'up' );
		ig.input.bind( ig.KEY.DOWN_ARROW, 'down' );
		ig.input.bind( ig.KEY.LEFT_ARROW, 'left' );
		ig.input.bind( ig.KEY.RIGHT_ARROW, 'right');
		ig.input.bind( ig.KEY.SPACE, 'action');
		ig.input.bind(ig.KEY.A, 'answer_a');
		ig.input.bind(ig.KEY.B, 'answer_b');
		ig.input.bind(ig.KEY.C, 'answer_c');
		ig.input.bind(ig.KEY.X, 'x');
		ig.input.bind(ig.KEY.M, 'missions');
		
		this.myDirector = new ig.Director(this, [LevelWelcome,LevelLibrary,LevelLinceCage]);
		
		this.myMessagesManager = new ig.messagesManager();
		
		this.myVideoManager = new ig.videoManager(ig.system.canvas);
		this.myVideoManager.addVideo('media/resources/iberian.mp4',0);
		this.myVideoManager.addCaption('Here we can see two kitten lynxs playing',0);
		this.myVideoManager.finishingEvent = ig.EVENTS.TV_VIDEO_END;
		
		this.mySlidesManager = new ig.slidesManager(ig.system.canvas);
		var slide0 = new ig.slide( 'media/resources/lynch1.png', 630, 478, " " );
                var slide1 = new ig.slide( 'media/resources/lynch2.png', 630, 478, " "  );
                var slide2 = new ig.slide( 'media/resources/lynch3.png', 630, 478, " " );
		var slide3 = new ig.slide( 'media/resources/lynch4.png', 630, 478, " " );
		var slide4 = new ig.slide( 'media/resources/lynch5.png', 630, 478, " " );
                this.mySlidesManager.addSlide(slide0);
		this.mySlidesManager.addSlide(slide1);
		this.mySlidesManager.addSlide(slide2);
		this.mySlidesManager.addSlide(slide3);
		this.mySlidesManager.addSlide(slide4);
		this.mySlidesManager.finishingEvent = ig.EVENTS.BLACKBOARD_PRESENTATION_END;
		
		this.status = new ig.statusManager();		
		//tasks initialization
		task1 = new ig.task("Go to the information point", 100, ig.EVENTS.INFORMATION_POINT_END);
		task2 = new ig.task("Talk with the gardener", 200, ig.EVENTS.GARDENER_DIALOG_END);
		this.status.addTask(this.myDirector.levels.indexOf(LevelWelcome), task1);
		this.status.addTask(this.myDirector.levels.indexOf(LevelWelcome), task2);		
		
		task3 = new ig.task("Study the presentation at the blackboard", 100, ig.EVENTS.BLACKBOARD_PRESENTATION_END);
		task4 = new ig.task("Watch the video at the television", 200, ig.EVENTS.TV_VIDEO_END);
		this.status.addTask(this.myDirector.levels.indexOf(LevelLibrary), task3);
		this.status.addTask(this.myDirector.levels.indexOf(LevelLibrary), task4);		

		task5 = new ig.task("Answer the question of the veterinarian", 500, ig.EVENTS.VET_DIALOG_END);
		this.status.addTask(this.myDirector.levels.indexOf(LevelLinceCage), task5);	

		this.myMissionsManager = new ig.missionsManager();
		
		this.myExplanationManager = new ig.explanationManager(ig.system.canvas);
		var explanation0 = new Image();
		explanation0.src = 'media/decorations/01.png';
                var explanation1 = new Image();
		explanation1.src = 'media/decorations/02.png';
				var explanation2 = new Image () ;
		explanation2.src = 'media/decorations/03.png'
				var explanation3 = new Image () ;
		explanation3.src = 'media/decorations/04.png'
				var explanation4 = new Image () ;
		explanation4.src = 'media/decorations/05.png'
		this.myExplanationManager.addSlide(explanation0);
		this.myExplanationManager.addSlide(explanation1);
		this.myExplanationManager.addSlide(explanation2);
		this.myExplanationManager.addSlide(explanation3);
		this.myExplanationManager.addSlide(explanation4);
		
		this.myExplanationManager.start();
		
		this.loadRPGMap(LevelWelcome);

	},
	
	update: function() {		
		
		if(this.myExplanationManager.isPlaying() == true){
			this.myExplanationManager.update();
		}
		if(this.mySlidesManager.isPlaying() == true){
			this.mySlidesManager.update();
		}
		else if(this.myMessagesManager.isPlaying() == true){
			this.myMessagesManager.update();
		}
		else{
			this.myMissionsManager.update();
			this.parent();
			if(ig.game.myDirector.levels[ig.game.myDirector.currentLevel].isScrollable) {
				//MAP SCROLL
				var player = this.getEntitiesByType( EntityBoy )[0];
				if( player ) {
					this.screen.x = player.pos.x - ig.system.width/2;
					this.screen.y = player.pos.y - ig.system.height/2;
				}
			}
		}
	},
	
	draw: function() {	
		if(this.myExplanationManager.isPlaying() == true){
			this.myExplanationManager.draw();
		}
		else if(this.myVideoManager.isPlaying() == true){
			this.myVideoManager.draw();
		}
		else if(this.mySlidesManager.isPlaying() == true){
			this.mySlidesManager.draw();
		}
		
		//TODO Si hay algún diálogo que dibujar, hacerlo
		
		else{
			if( this.clearColor ) {
				ig.system.clear( this.clearColor );
			}
			var mapIndex;
			for( mapIndex = 0; mapIndex < this.backgroundMaps.length; mapIndex++ ) {
				var map = this.backgroundMaps[mapIndex];
				if( map.foreground ) {
					// All foreground layers are drawn after the entities
					break;
				}
				map.setScreenPos( this.screen.x, this.screen.y );
				map.draw();
			}
			for( var i = 0; i < this.entities.length; i++ ) {
				if(this.entities[i].isForeground!=true){
					this.entities[i].draw();
				}
			}			
			for( mapIndex; mapIndex < this.backgroundMaps.length; mapIndex++ ) {
				var map = this.backgroundMaps[mapIndex];
				map.setScreenPos( this.screen.x, this.screen.y );
				map.draw();
			}
			//first we draw the foreground entities
			for( var i = 0; i < this.entities.length; i++ ) {
				if(this.entities[i].isForeground){
					this.entities[i].draw();
				}				
			}
			this.status.draw();  //draws the task bar
			//XXX TODO hacerlos exclusivos, o muestro mensaje o muestro missions
			this.myMessagesManager.draw();  //draws messages if needed
			this.myMissionsManager.draw();  //draws the missions if needed
		}
		//draw rounded corner
		var img = new Image();
		img.src = "media/decorations/rounded-corners.png";
		ig.system.context.drawImage(img, 0, 0);	
	},
	
	loadRPGMap: function(level, playerPostion){
		this.myDirector.jumpTo(level);
		var layerMain = null; //we pick the size of the layer called "main" (if it does not exist we use layer 1)
		for(var num in level.layer){
			if(level.layer[num].name == "main"){
				layerMain = level.layer[num];
				break;
			}
		}
		if(layerMain==null || layerMain.name !="main"){
			layerMain = level.layer[1];
		}		
		
		// Check if the map is scrollable
		if((layerMain.width * layerMain.tilesize > ig.system.width) ||
			(layerMain.height * layerMain.tilesize > ig.system.height)) {
			level.isScrollable = true;
		}
		else {
			this.screen.x = (layerMain.width * layerMain.tilesize)/2 - ig.system.width/2;
			this.screen.y = (layerMain.height * layerMain.tilesize)/2 - ig.system.height/2;
			level.isScrollable = false;
		}
		
		if(playerPostion){
			var player = this.getEntitiesByType( EntityBoy )[0];
			player.pos = playerPostion;
		}
		
	},
	
	//new function in game to sortEntitiesByYPosition
	sortEntitiesByYPosition: function() {
		this.entities.sort( function(a,b){ return a.pos.y - b.pos.y; } );
	},
		
	//called like ig.game.drawImage('media/resources/donana.jpg', 0, 0, 600, 473 ); but not working because it draws the image but then the game is refreshed and the image deleted
	drawImage: function( src, x, y, width, height ) {
            var context = ig.system.canvas.getContext("2d");
            var img = new Image(width,height);  
            img.src = src;
            context.drawImage(img, x, y);
	}
});

// Subclass the default loader
MyLoader = ig.Loader.extend({
    draw: function() {
	var initImage = new Image();
	initImage.src = "media/decorations/initImage.png";
	ig.system.context.drawImage(initImage, 0, 0);
    }
});

ig.main( '#canvas', MyGame, 60, 800, 608, 1, MyLoader );

});
