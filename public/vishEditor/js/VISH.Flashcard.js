VISH.Flashcard = (function(V,$,undefined){

  var flashcards;
  // myFlashcard = flashcards['flashcardId'] has:
  // myFlashcard.arrows = [arrow1,arrow2,...,arrow3];
  // myFlashcard.timer = arrowTimer;
  //Each arrow has id an position

  //Arrow rendering information
  //Arrow frames per second
  var FPS = 25;
  var TOTAL_FRAMES = 20;
  var FRAME_WIDTH = 50; //in pixels

  var init = function(presentation){
    if(!flashcards){
      flashcards = new Array();
    }
  };

  var startAnimation = function(slideId){
    if((typeof flashcards !== "undefined")&&(typeof flashcards[slideId] !== "undefined")){
      flashcards[slideId].timer = setInterval( function() { animateArrows(slideId); }, 1000/FPS );      
    }
  };

  var stopAnimation = function(slideId){
    if((typeof flashcards !== "undefined")&&(typeof flashcards[slideId] !== "undefined")&&(typeof flashcards[slideId].timer !== "undefined")){
      clearTimeout(flashcards[slideId].timer);
    }
  };

  /*  Sync can be true if you want the arrows to be synchronized 
   *   (moving at the same time and at the same position) or false if not
   */
  var addArrow = function(slideId, poi, sync){
    var flashcard_div = $("#"+ slideId);
    var div_to_add = "<div class='fc_poi' id='" + poi.id + "' style='position:absolute;left:"+poi.x+"%;top:"+poi.y+"%'></div>";
    flashcard_div.append(div_to_add);

    if(typeof flashcards[slideId] === "undefined"){
      flashcards[slideId] = new Object();
      flashcards[slideId].arrows = [];
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
    flashcards[slideId].arrows.push(arrow);
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

	return {
		init		        : init,
    addArrow        : addArrow,
    startAnimation  : startAnimation,
    stopAnimation   : stopAnimation,
    animateArrows   : animateArrows
	};

}) (VISH, jQuery);