VISH.Editor.Carrousel = (function(V,$,undefined){
	
  var createCarrousel = function(containerId,rows,callback,rowItems,scrollItems,styleClass){
		
		var multipleRow = (rows>1);
		
		var carrouselClass = "";
		if(styleClass){
			carrouselClass = "_" + styleClass;
		}
		
		if(!scrollItems){
			scrollItems = rowItems;
		}
			
		if(multipleRow){
		  var rowClass = "multiple_row" + carrouselClass;
	  } else {
	    var rowClass = "single_row" + carrouselClass;
	  }		
			
		//Wrapper main div with a image carousel class container.
		var wrapperDiv = $("#" + containerId);
		wrapperDiv.attr("class","image_carousel image_carousel_"+rowClass);
		wrapperDiv.removeAttr("id");
		
		var mainDiv = document.createElement('div');
		$(mainDiv).html($(wrapperDiv).html());
		$(wrapperDiv).html("");
		mainDiv.setAttribute('id', containerId);
			
		//Creating elements
		var clearFix = document.createElement('div');
		clearFix.setAttribute('class', "clearfix");
		
		var button_prev = document.createElement('a');
		var button_next = document.createElement('a');
		
		button_prev.setAttribute('class', "prev");
		button_next.setAttribute('class', "next");
		$(button_prev).addClass("prev_" + rowClass);
		$(button_next).addClass("next_" + rowClass);
		button_prev.setAttribute('href', "#");
	  button_next.setAttribute('href', "#");
		button_prev.setAttribute('id', "carrousel_prev" + containerId);
	  button_next.setAttribute('id', "carrousel_next" + containerId);
		$(button_prev).html("<span>prev</span>");
	  $(button_next).html("<span>next</span>");
			
		var paginationDiv = document.createElement('div');
		paginationDiv.setAttribute('class','pagination');
		paginationDiv.setAttribute('id','carrousel_pag' + containerId);
			     		 
		$(wrapperDiv).append(clearFix);
		$(wrapperDiv).append(button_prev);
	  $(wrapperDiv).append(button_next);
		$(wrapperDiv).append(paginationDiv);
			 
		//Element stylesheet
		$(mainDiv).children().addClass("carrousel_element_" + rowClass);
		
		$(mainDiv).children().each(function(index,value){
			$(value).children().addClass("carrousel_element_" + rowClass);
		});
		
		
		//Callbacks events
		if ((callback)&&(typeof callback == "function")) {
			$(mainDiv).children().click(function(event){
				callback(event);
			});
		}
			
		if (multipleRow) {
		  _applyMultipleRows(containerId, wrapperDiv, mainDiv, rows,rowItems,scrollItems,rowClass);
		} else {
		  $(wrapperDiv).prepend(mainDiv);
		  _setMainCarrousel(containerId,containerId, rows,[],rowItems,scrollItems);
		}		
		return "Done"
  }

	
  var _applyMultipleRows = function(containerId, wrapperDiv,mainDiv,rows,rowItems,scrollItems,rowClass){
		
    var synchronizeIds = [];
		
	//Create one div for each row.
	var i;
	for (i=0;i<rows;i++) {
	  window[mainDiv.id + "_row" + i ] = document.createElement('div');
	  window[mainDiv.id + "_row" + i ].setAttribute('id',mainDiv.id + "_row" + i);
		window[mainDiv.id + "_row" + i ].setAttribute('class',"carrousel_wrapper_" + rowClass);
	  if(i!=0){
	    synchronizeIds.push(mainDiv.id + "_row" + i)
	  }
    }
		
	//Divide children into the different divs.
	$(mainDiv).children().each(function(index,value){
	  $(window[mainDiv.id + "_row" + index%rows  ]).append(value)
	});
		
		
	//Add divs to the wrapper and invoke carrousel Plugin
	for (i=rows-1;i>=0;i--) {
      $(wrapperDiv).prepend(window[mainDiv.id + "_row" + i ])
	  if(i==0){
		var newContainerId = mainDiv.id + "_row" + i;
	    _setMainCarrousel(newContainerId,containerId,rows,synchronizeIds,rowItems,scrollItems);
	  } else {
		_setRowCarrousel(mainDiv.id + "_row" + i,rowItems,scrollItems);
	  }
    }
	$(".caroufredsel_wrapper").css("margin-bottom","30px")
  }

  var _setRowCarrousel = function (id,rowItems,scrollItems){
    $("#" + id).carouFredSel({
      auto    : false,
      circular: false,
      infinite: false,
      width   : 750,
	  scroll : {
        //items         : "page",
        items           : scrollItems,
        fx              : "scroll",
        duration        : 1000,
        pauseDuration   : 2000                
      },
	  items : {
	    visible    : {
		  min : rowItems,
		  max : rowItems
		}
	  }
    }); 
  }

  var _setMainCarrousel = function (id,widgetsId,rows,synchronizeIds,rowItems,scrollItems){
	$("#" + id).carouFredSel({
	  circular: false,
	  infinite: false,
	  auto    : false,
	  width   : 750,
	  scroll : {
	    //items         : "page",
	    items           : scrollItems,
//	    fx              : "scroll",
	    duration        : 1000,
	    pauseDuration   : 2000                
	  },
	  items       : {
	     visible    : {
		  min : rowItems,
		  max : rowItems
		 }
	  },
	  prev    : {
	    button  : "#carrousel_prev" + widgetsId,
	    key     : "left"
	  },
	  next    : {
	    button  : "#carrousel_next" + widgetsId,
	    key     : "right"
	  },
	  pagination  : "#carrousel_pag"  + widgetsId              
	});  
		
	if(synchronizeIds){
	  $(synchronizeIds).each(function(index,value){
        $("#" + id).trigger("configuration", ["synchronise", "#" + value]);
      });
	}
	
	$("#" + id).attr("rows",rows)
  }
	
  var cleanCarrousel = function(containerId){
	  //Check if is a multirow carrousel
	  var containderIdForMultiRow = containerId + "_row0";
	  if($("#" + containderIdForMultiRow).attr("rows")){
		  var rows = $("#" + containderIdForMultiRow).attr("rows");
		  var i;
		  for(i=0; i<rows;i++){
			  _cleanOneRowCarrousel(containerId + "_row" + i);
		  }
		  $("#" + containderIdForMultiRow).attr("id",containerId)
	  } else {
		  _cleanOneRowCarrousel(containerId);
	  }
  }
  
  var _cleanOneRowCarrousel = function(containerId){
    var carrouselWrapper = $("#" + containerId).parent().parent();
	  if($(carrouselWrapper).hasClass('image_carousel')){
	    $(carrouselWrapper).removeClass('image_carousel')
		$(carrouselWrapper).html("")
		$(carrouselWrapper).attr("id",containerId)
	  } else {
//				console.log("Vish.Editor.Carrousel.cleanCarrousel: Id not valid")
	  }
  }


  return {
		createCarrousel	  : createCarrousel,
		cleanCarrousel    : cleanCarrousel
  };

}) (VISH, jQuery);
