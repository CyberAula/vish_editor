VISH.Flashcard.Arrow = (function(V,$,undefined){

  //frames per second
  var FPS = 25;
  var TOTAL_FRAMES = 20;
  var FRAME_WIDTH = 50; //in pixels
  var arrow_ids = [];
  var arrow_positions = [];
  
  var init = function(){    
    setTimeout(_animateArrows, 1000/FPS);
  };

  /*sync can be true if you want the arrows to be synchronized (moving at the same time and at the same position) or false if not*/
  var addArrow = function(poi, sync){
        var flashcard_div = $("#flashcard-background");
        var div_to_add = "<div class='fc_poi' id='" + poi.id + "' style='position:absolute;left:"+poi.x+"%;top:"+poi.y+"%'></div>";

        flashcard_div.append(div_to_add);
        if(arrow_ids.indexOf(poi.id)==-1){
          arrow_ids.push(poi.id);
          if(sync){
            arrow_positions.push(0);  //if sync, all start at 0
          }
          else{
            var rand_pos = Math.floor(Math.random()*TOTAL_FRAMES+1)*FRAME_WIDTH;  //position in pixels
            arrow_positions.push(rand_pos);  //if not sync, start at random
          }
        }
  };

  var _animateArrows = function(){
    for(index in arrow_ids){
      var id = arrow_ids[index];
      var pos = arrow_positions[index];
      var new_pos = (pos + FRAME_WIDTH)%(TOTAL_FRAMES*FRAME_WIDTH);

      $("#"+id).css("background-position", new_pos + "px" + " 0px");
      arrow_positions[index] = new_pos;

    }
    setTimeout(_animateArrows, 1000/FPS);
  };

	return {
		init		    : init,
    addArrow    : addArrow
		
	};
}) (VISH, jQuery);