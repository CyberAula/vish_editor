VISH.Editor.MenuTablet = (function(V,$,undefined){

	var init = function(){
		$(".menu_option_main").click( function(event){
			if($("ul.menu_option_main").css("display")=="none"){
				//Hide submenus
				$("ul.menu_option_main > li > ul").hide();
				//Show
				$("ul.menu_option_main").show();
			} else {
				$("ul.menu_option_main").hide();
			}
		});

		$("a.menu_option").click( function(event){
			if	((!$(this).hasClass("menu_action"))&&($(this).parent()[0].tagName==="LI")&&($(this).parent().find("ul").length==1)){
				event.preventDefault();
				event.stopPropagation();

				var subMenu = $(this).parent().find("ul")[0];
				if($(subMenu).is(":visible")){
					//Hide
					$(subMenu).hide();
					return;
				}

				//Hide other submenus
				$("ul.menu_option_main > li > ul").hide();
				//Show submenu
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