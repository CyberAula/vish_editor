VISH.Recommendations = (function(V,$,undefined){

	var url_to_get_recommendations;
	var user_id;
	var presentation_id;
	var _requesting;
	var _generated;
	var _isRecVisible;

	/**
	 * Function to initialize the Recommendations
	 */
	var init = function(options){
		user_id = V.User.getId();
		presentation_id = V.Viewer.getCurrentPresentation().id;
		_isRecVisible = false;
		_requesting = false;
		_generated = false;

		if(options){
			if(typeof options["urlToGetRecommendations"] == "string"){
				url_to_get_recommendations = options["urlToGetRecommendations"];
			}
		}
		
		//Redimension of fancybox is done in ViewerAdapter
		$("#fancyRec").fancybox({
			  'type'	: 'inline',
			  'autoDimensions' : false,
		      'scrolling': 'no',
		      'autoScale' : false,		      
		      'width': '100%',
		      'height': '100%',
		      'padding': 0,
		      'overlayOpacity': 0,
		      'onStart' : function(){
		      	$("#fancybox-outer").css("display","none");
		      },
		      'onComplete'  : function(data) {
				$("#fancybox-outer").css("background", "rgba(0,0,0,.7)");
				$("#fancybox-wrap").css("margin-top", "0px");
				V.Slides.triggerLeaveEvent(V.Slides.getCurrentSlideNumber());
				_isRecVisible = true;
				setTimeout(function (){
					V.ViewerAdapter.updateFancyboxAfterSetupSize();
					$("#fancybox-outer").css("display","block");
				}, 350);
		      },
		      'onClosed' : function(data) {
		      		$("#fancybox-outer").css("background", "white");
		      		$("#fancybox-wrap").css("margin-top", "-14px");
		      		V.Slides.triggerEnterEvent(V.Slides.getCurrentSlideNumber());
		      		_isRecVisible = false;
		      }
		});
	};

	/**
	 * Function to check if this is the appropiate moment to request the recommendations
	 */
	var checkForRecommendations = function(){
		var slidesQuantity = V.Slides.getSlidesQuantity();
		var cSlideNumber = V.Slides.getCurrentSlideNumber();

		if(cSlideNumber > slidesQuantity - 2){
			if(!_generated){
				_requestRecommendations();
			}
		}
	}

	/**
	 * Function to call ViSH via AJAX to get recommendation of excursions
	 */
	var _requestRecommendations = function(){
		if(!_generated){
			if(V.Configuration.getConfiguration()["mode"]===V.Constant.VISH){
				if(_requesting == true){
					return;
				} else {
					_requesting = true;
				}
				if(url_to_get_recommendations !== undefined){
					var params_to_send = {
						user_id: user_id,
						excursion_id: presentation_id,
						quantity: 6
					};
					$.ajax({
						type    : "GET",
						url     : url_to_get_recommendations,
						data    : params_to_send,
						success : function(data) {
							_fillFancyboxWithData(data);
						},
						error: function(error){
							_requesting = false;
						}
					});
				}
			} else if(V.Configuration.getConfiguration()["mode"]=="noserver"){
				_fillFancyboxWithData(V.Samples.API.recommendationList);
			}
		}
	};

	var _fillFancyboxWithData = function(data){
		if((!data)||(data.length===0)){
			_requesting = false;
			return;
		}

        var ex;
        var result = "";
        for (var i = data.length - 1; i >= 0; i--){
        	ex = data[i];
        	if(V.Status.getIsEmbed()){
        		result += '<a target="_blank" href="'+ex.url+'.full">';
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
                            '<span class="rec-visits">'+ex.views+'</span> <span class="rec-views">'+V.I18n.getTrans("i.exviews")+'</span>'+
                            '<div class="rec-likes"><span class="rec-likes-number">'+333+'</span><img class="rec-menu_icon" src="http://vishub.org/assets/icons/star-on10.png"></div>'+
                          '</li>'+
                        '</ul>'+
                    '</div>';
			if(V.Status.getIsEmbed()){
				result += '</a>';
			}
		};
        $("#fancy_recommendations .rec-grid").html(result);
        _generated = true;
        _requesting = false;

        if(!V.Status.getIsEmbed()){
        	//we join the recom-X with sending the parent to the excursion url
        	 for (var i = data.length - 1; i >= 0; i--){
        	 	$("#recom-"+data[i].id).click(function(my_event){
        	 		V.Utils.sendParentToURL(data[$(my_event.target).closest(".rec-excursion").attr("number")].url);
        	 	});
        	 }
        };
	};

	var showFancybox = function(){
		if(V.Editing){
			return;
		}
		if(!V.Status.getDevice().desktop){
			return;
		}
		if(V.Viewer.getPresentationType()!= V.Constant.PRESENTATION){
			return;
		}
		if((V.Utils.getOptions())&&(V.Utils.getOptions().preview)){
			return;
		}
		if((V.Configuration.getConfiguration()["mode"]!=V.Constant.NOSERVER)&&(typeof url_to_get_recommendations == "undefined")){
			return;
		}
		if(isRecVisible()){
			return;
		}
		if((!_generated)&&(!_requesting)){
			//Request recommendations
			_requestRecommendations();
		}

		//Show fancybox
		$("#fancyRec").trigger('click');
	};

	var isRecVisible = function(){
		return _isRecVisible;
	}

	var aftersetupSize = function(increase){
		if(increase > 0.82){
			$(".rec-excursion").css("width","44%");
		} else if(increase > 0.36){
			$(".rec-excursion").css("width","40%");
		} else {
			$(".rec-excursion").css("width","36%");
		}
	}

	return {
		init          			: init,
		checkForRecommendations	: checkForRecommendations,
		showFancybox			: showFancybox,
		isRecVisible 			: isRecVisible,
		aftersetupSize			: aftersetupSize
	};

}) (VISH,jQuery);