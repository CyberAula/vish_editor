VISH.Editor.Carrousel = (function(V,$,undefined){
	
	var createCarrousel = function(containerId,rows,callback){
		
		var multipleRow = (rows>1);
		
		if(multipleRow){
			var rowClass = "multiple_row"
    } else {
      var rowClass = "single_row"
    }		
		
		//Wrapper main div with a image carousel class container.
		var wrapperDiv = $("#" + containerId);
		wrapperDiv.attr("class","image_carousel")
		wrapperDiv.removeAttr("id")
		
		var mainDiv = document.createElement('div')
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
		$(button_prev).addClass("prev_" + rowClass)
		$(button_next).addClass("next_" + rowClass)
		button_prev.setAttribute('href', "#");
    button_next.setAttribute('href', "#");
		button_prev.setAttribute('id', "carrousel_prev");
    button_next.setAttribute('id', "carrousel_next");
		$(button_prev).html("<span>prev</span>");
    $(button_next).html("<span>next</span>");
		
		var paginationDiv = document.createElement('div');
		paginationDiv.setAttribute('class','pagination')
		paginationDiv.setAttribute('id','carrousel_pag')
		     		 
		$(wrapperDiv).append(clearFix)
		$(wrapperDiv).append(button_prev)
    $(wrapperDiv).append(button_next)
		$(wrapperDiv).append(paginationDiv)
		 
		//Element stylesheet
		$(mainDiv).children().addClass("carrousel_element_" + rowClass)
		
		//Callbacks events
		if ((callback)&&(typeof callback == "function")) {
			$(mainDiv).children().click(function(event){
				callback(event)
			});
	  }
		
		if (multipleRow) {
		  _applyMultipleRows(wrapperDiv, mainDiv, rows);
	  }	else {
		  $(wrapperDiv).prepend(mainDiv)
			_setMainCarrousel(containerId);
	  }
			
	  return "Done"
  }


  var _applyMultipleRows = function(wrapperDiv,mainDiv,rows){
		
		var synchronizeIds = [];
		
		//Create one div for each row.
		var i;
		for (i=0;i<rows;i++) {
			window[mainDiv.id + "_row" + i ] = document.createElement('div');
			window[mainDiv.id + "_row" + i ].setAttribute('id',mainDiv.id + "_row" + i);
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
				_setMainCarrousel(mainDiv.id + "_row" + i,synchronizeIds);
			} else {
				_setRowCarrousel(mainDiv.id + "_row" + i);
			}
    }
	}

	var _setRowCarrousel = function (id){
		$("#" + id).carouFredSel({
      auto    : false,
      width   : 750,
			scroll : {
        //items         : "page",
        items           : 4,
        fx              : "scroll",
        duration        : 1000,
        pauseDuration   : 2000                
      }    
    }); 
	}

	var _setMainCarrousel = function (id,synchronizeIds){
	  $("#" + id).carouFredSel({
	    circular: false,
	    infinite: false,
	    auto    : false,
	    width   : 750,
	    scroll : {
	      //items         : "page",
	      items           : 4,
	      fx              : "scroll",
	      duration        : 1000,
	      pauseDuration   : 2000                
	    },    
	    prev    : {
	      button  : "#carrousel_prev",
	      key     : "left"
	    },
	    next    : {
	      button  : "#carrousel_next",
	      key     : "right"
	    },
	    pagination  : "#carrousel_pag"              
	  });  
		
		if(synchronizeIds){
			$(synchronizeIds).each(function(index,value){
        $("#" + id).trigger("configuration", ["synchronise", "#" + value]);
      });
		}
		
	}
	
	var cleanCarrousel = function(containerId){
    var carrouselWrapper = $("#" + containerId).parent().parent();
		if($(carrouselWrapper).hasClass('image_carousel')){
			$(carrouselWrapper).removeClass('image_carousel')
			$(carrouselWrapper).html("")
			$(carrouselWrapper).attr("id",containerId)
		} else {
//			console.log("Vish.Editor.Carrousel.cleanCarrousel: Id not valid")
		}
  }


	return {
		createCarrousel		: createCarrousel,
		cleanCarrousel    : cleanCarrousel
	};

}) (VISH, jQuery);
