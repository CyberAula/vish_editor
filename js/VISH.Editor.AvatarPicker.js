VISH.Editor.AvatarPicker = (function(V,$,undefined){
    var avatars = null;
    
   /**
    * function to create the carrousel with the avatars in the div with id "avatars_carrousel"
    */
   var init = function(){
   	  if(avatars===null){
   	  	_getAvatars();
   	  }
   	  //if it is still null, we will have no thumbnails
   	  if(avatars===null){
   	  	$("#thumbnails_in_excursion_details").remove();
   	  	return;
   	  }
   	  var content = "";
   	  $.each(avatars.pictures, function(i, item) {
   	  	content = content + '<div><img src="'+item.src+'" /></div>';
   	  });
   	  $("#avatars_carrousel").html(content);
   	  V.Editor.Carrousel.createCarrousel("avatars_carrousel", 1, VISH.Editor.AvatarPicker.selectAvatar);
   	  
   }; 	
   
    
  /**
   * callback function to select an avatar
   */
  var selectAvatar = function(event){
  	$(".carrousel_element_single_row").removeClass("carrousel_element_selected");
  	$(event.target).addClass("carrousel_element_selected");
  	$('#excursion_avatar').val($(event.target).attr("src"));
  };
    
  /**
	 * function to get the available avatars from the server, they should be at /excursion_thumbnails.json
	 */
	var _getAvatars = function(){
		$.ajax({
		  async: false,
		  type: 'GET',
		  url: '/excursion_thumbnails.json',
		  dataType: 'json',
		  success: function(data) {
		    console.log("success getting excursion avatars");
		    avatars = data;
		  },
		  error: function(xhr, ajaxOptions, thrownError){
            console.log("status returned by server:" + xhr.status);
            console.log("Error in client: " + thrownError);  
		  }
		});
	};
  
  
	return {
		init	       : init,
		selectAvatar   : selectAvatar
		
	};

}) (VISH, jQuery);