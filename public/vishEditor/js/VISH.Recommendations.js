VISH.Recommendations = (function(V,$,undefined){

	//Internals
	var _enabled;
	var _requesting;
	var _generated;
	var _isRecVisible;
	var _showFancyboxTimer;

	//Recommendations API
	var _recommendationAPIUrl;

	//Vishub params
	var user_id;
	var vishub_pres_id;

	//Params to enhance recommendation
	var _searchTerms;


	/**
	 * Function to initialize the Recommendations
	 */
	var init = function(options){
		_enabled = false;
		_isRecVisible = false;
		_requesting = false;
		_generated = false;

		if(V.Status.getIsInVishSite()){
			user_id = V.User.getId();
			var presentation = V.Viewer.getCurrentPresentation();
			if(presentation["vishMetadata"] && presentation["vishMetadata"]["id"]){
				vishub_pres_id = presentation["vishMetadata"]["id"];
			}
		}

		_searchTerms = getCurrentSearchTerms();

		var options = V.Utils.getOptions();
		if((options)&&(typeof options["recommendationsAPI"] != "undefined")&&(typeof options["recommendationsAPI"]["rootURL"] == "string")){
			_recommendationAPIUrl = options["recommendationsAPI"]["rootURL"];
			_enabled = true;
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
		      'center': false,
		      'onStart' : function(){
		      	$("#fancybox-outer").css("display","none");
		      },
		      'onComplete'  : function(data) {
				$("#fancybox-outer").css("background", "rgba(0,0,0,.7)");
				$("#fancybox-wrap").css("margin-top", "0px");
				V.Slides.triggerLeaveEvent(V.Slides.getCurrentSlideNumber());
				_isRecVisible = true;
				V.ViewerAdapter.updateFancyboxAfterSetupSize();
				$("#fancybox-outer").css("display","block");
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
		if(!_enabled){
			return;
		}

		var slidesQuantity = V.Slides.getSlidesQuantity();
		var cSlideNumber = V.Slides.getCurrentSlideNumber();

		if(cSlideNumber > slidesQuantity - 3){
			if(!_generated){
				_requestRecommendations();
			}
		}
	};

	/**
	 * Function to call ViSH via AJAX to get recommendation of excursions
	 */
	var _requestRecommendations = function(){
		if((_enabled)&&(typeof _recommendationAPIUrl != "undefined")&&(!_generated)&&(_requesting != true)){

			_requesting = true;

			if(V.Configuration.getConfiguration()["mode"]===V.Constant.VISH){

				var params = {};
				params["quantity"] = 6;
				if(_searchTerms){
					params["q"] = _searchTerms;
				}
				if(user_id){
					params["user_id"] = user_id;
				}
				if(vishub_pres_id){
					params["excursion_id"] = vishub_pres_id;
				}

				$.ajax({
					type    : "GET",
					url     : _recommendationAPIUrl,
					data    : params,
					success : function(data) {
						_fillFancyboxWithData(data);
					},
					error: function(error){
						_enabled = false; //Disable recommendations when API fail
						_requesting = false;
					}
				});

			} else if(V.Configuration.getConfiguration()["mode"]==V.Constant.NOSERVER){
				setTimeout(function(){
					_fillFancyboxWithData(V.Samples.API.recommendationList);
				},1000);
			}
		}
	};

	var _fillFancyboxWithData = function(data){
		if((!data)||(data.length===0)){
			_enabled = false; //Disable recommendations when API fail
			_requesting = false;
			return;
		}

		var applyTargetBlank = V.Status.getIsInExternalSite();

        var ex;
        var result = "";
        for (var i = data.length - 1; i >= 0; i--){
        	ex = data[i];
        	if(applyTargetBlank){
        		result += '<a target="_blank" href="'+ex.url+'">';
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
			if(applyTargetBlank){
				result += '</a>';
			}
		};
        $("#fancy_recommendations .rec-grid").html(result);
        aftersetupSize();
        _generated = true;
        _requesting = false;

        if(!applyTargetBlank){
        	//we join the recom-X with sending the parent to the excursion url
        	 for (var i = data.length - 1; i >= 0; i--){
        	 	$("#recom-"+data[i].id).click(function(my_event){
        	 		V.Utils.sendParentToURL(data[$(my_event.target).closest(".rec-excursion").attr("number")].url);
				});
        	 }
        };
	};

	var showFancybox = function(){
		if(_enabled == false){
			return;
		}
		if(V.Editing){
			return;
		}
		// Disable recommendations for Mobiles and tablets
		// if(!V.Status.getDevice().desktop){
		// 	return;
		// }
		if(V.Viewer.getPresentationType()!= V.Constant.PRESENTATION){
			return;
		}
		if((V.Utils.getOptions())&&(V.Utils.getOptions().preview)){
			return;
		}
		if(isRecVisible()){
			return;
		}
		if(!V.Slides.isCurrentLastSlide()){
			return;
		}

		if(!_generated){
			if(!_requesting){
				//Request recommendations
				_requestRecommendations();
			}

			if(typeof _showFancyboxTimer == "undefined"){
				_showFancyboxTimer = setTimeout(function(){
					clearTimeout(_showFancyboxTimer);
					_showFancyboxTimer = undefined;
					showFancybox();
				},300);
			}

			return;
		}

		//Show fancybox
		$("#fancyRec").trigger('click');
	};

	var isRecVisible = function(){
		return _isRecVisible;
	};

	var isEnabled = function(){
		return _enabled;
	};

	var aftersetupSize = function(increase){
		var items = $(".rec-excursion");
		if(items.length < 1){
			return;
		}

		increase = (typeof increase == "number") ? increase : V.ViewerAdapter.getLastIncrease()[0];
		if(increase > 0.82){
			$(items).css("width","44%");
		} else if(increase > 0.36){
			$(items).css("width","40%");
		} else {
			$(items).css("width","36%");
		}
	};

	var getCurrentSearchTerms = function(){
		return getSearchTerms(V.Viewer.getCurrentPresentation());
	};

	var getSearchTerms = function(pJSON){
		var searchTerms = [];
		if(typeof pJSON["tags"] != "undefined"){
			$(pJSON["tags"]).each(function(index,tag){
				searchTerms.push(tag);
			});
		}
		if(typeof pJSON["subject"] != "undefined"){
			$(pJSON["subject"]).each(function(index,tag){
				searchTerms.push(tag);
			});
		}
		if(typeof pJSON["title"] != "undefined"){
			searchTerms.push(pJSON["title"]);
		}

		return searchTerms.join(",");
	};

	return {
		init          			: init,
		checkForRecommendations	: checkForRecommendations,
		showFancybox			: showFancybox,
		isRecVisible 			: isRecVisible,
		aftersetupSize			: aftersetupSize
	};

}) (VISH,jQuery);