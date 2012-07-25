ig.module(
	'game.messages'
)
.requires(
	'impact.impact',
        'plugins.rpgwizard.message'
)
.defines(function(){

ig.MESSAGES = {
    NEXT_LEVEL_NOT_ALLOWED: new ig.message(1, "You should complete your missions first before entering the next level")
    
    };

});