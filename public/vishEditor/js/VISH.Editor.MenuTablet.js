VISH.Editor.MenuTablet = (function(V,$,undefined){

	var init = function(){
		$(".menu_option_main").click( function(event){
			if($("ul.menu_option_main").css("display")=="none"){
				$("ul.menu_option_main").show();
			} else {
				$("ul.menu_option_main").hide();
			}
		});

		$("a.menu_option").click( function(event){
			if	((!$(this).hasClass("menu_action"))&&($(this).parent()[0].tagName==="LI")&&($(this).parent().find("ul").length==1)){
				var subMenu = $(this).parent().find("ul")[0];
				event.preventDefault();
				event.stopPropagation();
				$(subMenu).show();
			} else {
				//Hide...not necessary
			}
		});
	}

	return {
		init : init
	};

}) (VISH, jQuery);