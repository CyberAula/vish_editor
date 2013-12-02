VISH.Editor.Animations = (function(V,$,undefined){

	var initialized = false;
	var currentAnimation;
	var animation = {};

	var init = function(){		
		if(!initialized){
			animation["animation1"] = {
				number: "1",
				filename: "animation1"
			};
			animation["animation2"] = {
				number: "2",
				filename: "animation2"
			};
			animation["animation3"] = {
				number: "3",
				filename: "animation3"
			};
			animation["animation4"] = {
				number: "4",
				filename: "animation4"
			};
			animation["animation5"] = {
				number: "5",
				filename: "animation5"
			};
			animation["animation6"] = {
				number: "6",
				filename: "animation6"
			};
			animation["animation7"] = {
				number: "7",
				filename: "animation7"
			};
			animation["animation8"] = {
				number: "8",
				filename: "animation8"
			};
			animation["animation9"] = {
				number: "9",
				filename: "animation9"
			};
			animation["animation10"] = {
				number: "10",
				filename: "animation10"
			};
			animation["animation11"] = {
				number: "11",
				filename: "animation11"
			};
			animation["animation12"] = {
				number: "12",
				filename: "animation12"
			};
		}
		setCurrentAnimation(VISH.Constant.Animations.Default);
	}

	var onAnimationSelected = function(event){
		event.preventDefault();
		var animationNumber = $(event.currentTarget).attr("animation");
		
		selectAnimation(animationNumber);
		V.Editor.Settings.selectAnimation(animation[animationNumber].number);
	};

	var selectAnimation = function(animation){
		currentAnimation = animation;
	};

	var getCurrentAnimation = function(){
		if(currentAnimation){
			return animation[currentAnimation];
		} else {
			return animation[VISH.Constant.Animations.Default];
		}
	};

	var setCurrentAnimation = function(the_animation){
		if(the_animation!=undefined){
			currentAnimation = the_animation;
			V.Editor.Settings.selectAnimation(animation[the_animation].number);
		}
	};

	return {
		init				: init,
		onAnimationSelected	: onAnimationSelected,
		selectAnimation		: selectAnimation,
		getCurrentAnimation	: getCurrentAnimation,
		setCurrentAnimation : setCurrentAnimation
	};

}) (VISH, jQuery);