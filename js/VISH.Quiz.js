VISH.Quiz = (function(V,$,undefined){
    
    /**
    * 
    * 
    * 
    * 
    */
   var init = function(username, token, quiz_active){
   
   if ($(".mcquestion")) {
   	
   	$(".mcquestion").find(".mc_meter").css('display','none'); 
   	
   } 
   
  // $(document).on('click', '#edit_excursion_details', _onEditExcursionDetailsButtonClicked);
   
   }
   var showStatistic = function (event){
   	
   	V.Debugging.log(" Enter showStatistics value of the event: "+ event);
   	
   }
    
    
    return {
    	init 			: init,
        showStatistic    : showStatistic
    };
    
}) (VISH, jQuery);
