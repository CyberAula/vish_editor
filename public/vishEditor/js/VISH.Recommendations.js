VISH.Recommendations = (function(V,$,undefined){

	var url_to_get_recommendations;
	var user_id;
	var presentation_id;
	var generated;
	var _isRecVisible;

	/**
	 * Function to initialize the Recommendations
	 */
	var init = function(options){
		user_id = V.User.getId(); ;
		presentation_id = V.SlideManager.getCurrentPresentation().id;
		_isRecVisible = false;

		if(options && options["urlToGetRecommendations"]){
			url_to_get_recommendations = options["urlToGetRecommendations"];			
		}
		generated = false;

		//redimention of fancybox is done in ViewerAdapter (line 300 aprox)
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
		      		$("#fancybox-outer").css("background", "rgba(0,0,0,.7)");
		      		$("#fancybox-wrap").css("margin-top", "0px");
		      		V.Slides.triggerLeaveEvent(V.Slides.getCurrentSlideNumber()-1);
		      		_isRecVisible = true;
		      },
		      'onClosed' : function(data) {
		      		$("#fancybox-outer").css("background", "white");
		      		$("#fancybox-wrap").css("margin-top", "-14px");
		      		V.Slides.triggerEnterEvent(V.Slides.getCurrentSlideNumber()-1);
		      		_isRecVisible = false;
		      }
		});
	};

	/**
	 * function to call ViSH via AJAX to get recommendation of excursions
	 */
	var generateFancybox = function(){
		if(!generated){
			if(url_to_get_recommendations !== undefined){
				var params_to_send = {
					user_id: user_id,
					excursion_id: presentation_id,
					quantity: 9
				};
				$.ajax({
					type    : "GET",
					url     : url_to_get_recommendations,
					data    : params_to_send,
					success : function(data) {
						_fillFancyboxWithData(data);
					}
				});
			} else {
				_fillFancyboxWithData(VISH.Samples.API.recommendationList);
			}
			generated = true;
		}
	};

	var _fillFancyboxWithData = function(data){
		if((!data)||(data.length===0)){
			return;
		}		
        var ex;
        var result = "";
        for (var i = data.length - 1; i >= 0; i--) {
        	ex = data[i];
        	if(V.Status.getIsEmbed()){
        		result += '<a href="'+ex.url+'.full">';
        	}
        	result += '<div class="rec-excursion" id="recom-'+ex.id+'" number="'+i+'">'+
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
                    '</div>';
            if(V.Status.getIsEmbed()){
        		result += '</a>';
        	}
        };
        $("#fancy_recommendations .rec-grid").html(result);

        if(!V.Status.getIsEmbed()){
        	//we join the recom-X with sending the parent to the excursion url
        	 for (var i = data.length - 1; i >= 0; i--) {
        	 	$("#recom-"+data[i].id).click(function(my_event){
        	 		V.Utils.sendParentToURL(data[$(my_event.target).closest(".rec-excursion").attr("number")].url);
        	 	});
        	 }
        }

	};

	var showFancybox = function(){
		if((V.Utils.getOptions())&&(V.Utils.getOptions().preview)){
			return;
		}
		$("#fancyRec").trigger('click');
	};

	var isRecVisible = function(){
		return _isRecVisible;
	}

	return {
		init          			: init,
		generateFancybox		: generateFancybox,
		showFancybox			: showFancybox,
		isRecVisible 			: isRecVisible
	};

}) (VISH,jQuery);