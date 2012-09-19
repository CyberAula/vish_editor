VISH.Game = (function(V,$,undefined){
	var actions = {};

	var registerActions = function(presentation){
		actions = presentation.game.actions;
	};

	var raiseAction = function(action_name){
		if(actions[action_name]){
			V.Debugging.log("show slide " + actions[action_name].slide_id);
		}
	};

return {
		raiseAction		: raiseAction,
		registerActions : registerActions
		
	};
}) (VISH, jQuery);