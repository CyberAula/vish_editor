VISH.Recommendations = (function(V,$,undefined){

	var url_to_get_recommendations;
	var user_id;
	var presentation_id;
	var generated;


	/**
	 * Function to initialize the Recommendations
	 */
	var init = function(options){
		user_id = V.User.getId(); ;
		presentation_id = V.SlideManager.getCurrentPresentation().id;

		if(options && options["urlToGetRecommendations"]){
			url_to_get_recommendations = options["urlToGetRecommendations"];			
		}
		generated = false;

		//redimetion of fancybox is done in ViewerAdapter (line 300 aprox)
		$("#fancyRec").fancybox({
			  'type'	: 'inline',
			  'autoDimensions' : false,
		      'scrolling': 'no',
		      'autoScale' : false,		      
		      'width': '100%',
		      'height': '100%',
		      'padding': 0,
		      'overlayOpacity': 0,
		      'onComplete'  : function(data) {
		      		$("#fancybox-outer").css("background", "transparent");
		      		$("#fancybox-wrap").css("margin-top", "0px");
		      },
		      'onClosed' : function(data) {
		      		$("#fancybox-outer").css("background", "white");
		      		$("#fancybox-wrap").css("margin-top", "-14px");
		      }


		});
	};

	/**
	 * function to call ViSH via AJAX to get recommendation of excursions
	 */
	var generateFancybox = function(){
		// if(!generated){
		// 	// console.log("user_id " + user_id + " presentation_id " + presentation_id);
		// 	if(url_to_get_recommendations !== undefined){
		// 		var params_to_send = {
		// 			user_id: user_id,
		// 			excursion_id: presentation_id,
		// 			quantity: 9
		// 		};
		// 		$.ajax({
		// 			type    : "POST",
		// 			url     : url_to_get_recommendations,
		// 			data    : params_to_send,
		// 			success : function(data) {
		// 				_fillFancyboxWithData(data);
		// 			}
		// 		});
		// 	} else {
		// 		_fillFancyboxWithData(VISH.Samples.API.recommendationList);
		// 	}
		// 	generated = true;
		// }		
	};

	var _fillFancyboxWithData = function(data){
		if((!data)||(!data.items)){
			return;
		}
		
        var ex;
        var result = "";
        for (var i = data.items.length - 1; i >= 0; i--) {
        	ex = data.items[i];
        	result += '<a href="'+ex.url+'">'+
                    '<div class="rec-excursion">'+
                        '<ul class="rec-thumbnail">'+
                          '<li class="rec-img-excursion">'+
                           '<img src="'+ex.image+'">'+
                            '<div class="rec-number_pages">'+ex.number_of_slides+'</div>'+
                          '</li>'+
                          '<li class="rec-info-excursion">'+
                            '<div class="rec-title-excursion">'+ex.title+'</div>'+
                            '<div class="rec-by">by <span class="rec-name">'+ex.author+'</span></div>'+
                            '<span class="rec-visits">'+ex.views+'</span> <span class="rec-views">views</span>'+
                            '<div class="rec-likes">'+ex.favourites+'<img class="rec-menu_icon" src="http://vishub.org/assets/icons/star-on10.png"></div>'+
                          '</li>'+
                        '</ul>'+
                    '</div>'+
                    '</a>';
        };
        $("#fancy_recommendations .rec-grid").html(result);
	};

	var showFancybox = function(){
		if((V.Utils.getOptions())&&(V.Utils.getOptions().preview)){
			return;
		}
		$("#fancyRec").trigger('click');
	};

	return {
		init          			: init,
		generateFancybox		: generateFancybox,
		showFancybox			: showFancybox
	};

}) (VISH,jQuery);