VISH.Flashcard = (function(V,$,undefined){

  var flashcards;
  // myFlashcard = flashcards['flashcardId'] has:
  // myFlashcard.arrows = [arrow1,arrow2,...,arrow3];
  // myFlashcard.timer = arrowTimer;
  //Each arrow has id, position and a associated slide id
  
  //Direct access to pois data.
  var pois;

  //Arrow rendering information
  //Arrow frames per second
  var FPS = 25;
  var TOTAL_FRAMES = 20;
  var FRAME_WIDTH = 50; //in pixels

  var init = function(presentation){
    if(!flashcards){
      flashcards = new Array();
      pois = new Array();
    }
  };

  var startAnimation = function(slideId){
    if((typeof flashcards !== "undefined")&&(typeof flashcards[slideId] !== "undefined")&&(typeof flashcards[slideId].timer == "undefined")){
      flashcards[slideId].timer = setInterval( function() { animateArrows(slideId); }, 1000/FPS );      
    }
  };

  var stopAnimation = function(slideId){
    if((typeof flashcards !== "undefined")&&(typeof flashcards[slideId] !== "undefined")&&(typeof flashcards[slideId].timer !== "undefined")){
      clearTimeout(flashcards[slideId].timer);
      flashcards[slideId].timer = undefined;
    }
  };

  /*  Sync can be true if you want the arrows to be synchronized 
   *   (moving at the same time and at the same position) or false if not
   */
  var addArrow = function(fcId, poi, sync){
    var flashcard_div = $("#"+ fcId);
    var div_to_add = "<div class='fc_poi' id='" + poi.id + "' style='position:absolute;left:"+poi.x+"%;top:"+poi.y+"%'></div>";
    flashcard_div.append(div_to_add);

    if(typeof flashcards[fcId] === "undefined"){
      flashcards[fcId] = new Object();
      flashcards[fcId].arrows = [];
    }

    //Add arrow
    var arrow = new Object();
    arrow.id = poi.id;
    if(sync){
        arrow.position = 0;
    } else {
         var rand_pos = Math.floor(Math.random()*TOTAL_FRAMES+1)*FRAME_WIDTH;  //position in pixels
         arrow.position = rand_pos;
    }
    arrow.slide_id = poi.slide_id;

    flashcards[fcId].arrows.push(arrow);
    pois[arrow.id] = arrow;
  };

  var animateArrows = function(slideId){
    if((!slideId)||(typeof flashcards[slideId] === "undefined")){
      return;
    }
    $(flashcards[slideId].arrows).each(function(index,value){
      var new_pos = (value.position + FRAME_WIDTH)%(TOTAL_FRAMES*FRAME_WIDTH);
      var arrow_dom_el = $("#"+value.id);
      $(arrow_dom_el).css("background-position", new_pos + "px" + " 0px");
      flashcards[slideId].arrows[index].position = new_pos;
    });
  };

  var getPoiData = function(poiId){
    if((typeof pois !== "undefined")&&(typeof pois[poiId] !== "undefined")){
      return pois[poiId]
    }
    return null; 
  }

	return {
		init		        : init,
    addArrow        : addArrow,
    startAnimation  : startAnimation,
    stopAnimation   : stopAnimation,
    animateArrows   : animateArrows,
    getPoiData      : getPoiData
	};

}) (VISH, jQuery);