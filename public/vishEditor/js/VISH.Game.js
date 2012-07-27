VISH.Game = (function(V,$,undefined){
	var actions = {};

	var registerActions = function(excursion){
		actions = excursion.game.actions;
	};

	var raiseAction = function(action_name){
		if(actions[action_name]){
			console.log("show slide " + actions[action_name].slide_id);
		}
	};

return {
		raiseAction		: raiseAction,
		registerActions : registerActions
		
	};
}) (VISH, jQuery);