VISH.Utils = (function(V,undefined){
	
	  var init = function(){
			//Code here...
		}
	
	  var getOuterHTML = function(tag){
      //In some old browsers (before firefox 11 for example) outerHTML does not work
      //Trick to provide full browser support
      if (typeof($(tag)[0].outerHTML)=='undefined'){
        return $(tag).clone().wrap('<div></div>').parent().html();
      } else {
				return $(tag)[0].outerHTML;
			}
	  }


    var generateTable = function(author,title,description){
        
	    if(!author){
	     author = "";
	    }
	    if(!title){
	      title = "";
	    }
	    if(!description){
	      description = "";
	    }
    
      return "<table class=\"metadata\">"+
         "<tr class=\"even\">" +
           "<td class=\"title header_left\">Author</td>" + 
           "<td class=\"title header_right\"><div class=\"height_wrapper\">" + author + "</div></td>" + 
         "</tr>" + 
         "<tr class=\"odd\">" + 
           "<td class=\"title\">Title</td>" + 
           "<td class=\"info\"><div class=\"height_wrapper\">" + title + "</div></td>" + 
         "</tr>" + 
         "<tr class=\"even\">" + 
           "<td colspan=\"2\" class=\"title_description\">Description</td>" + 
         "</tr>" + 
         "<tr class=\"odd\">" + 
           "<td colspan=\"2\" class=\"info_description\"><div class=\"height_wrapper_description\">" + description + "</div></td>" + 
         "</tr>" + 
       "</table>";
    }
		
		
		//Check minium requirements to init vish editor
		var checkMiniumRequirements = function(){
					
			var browserRequirements = true;
			
			//Check for Internet Explorer old versions
		  if ((navigator.appName == 'Microsoft Internet Explorer')&&(_getInternetExplorerVersion()<9)) {
        browserRequirements = false;
      }
			
			//Firefox
//			if ((navigator.appName == 'Netscape')&&(_getFirefoxVersion()<0)) {
//        browserRequirements = false;
//      }
			
			//Add more browser requirements
			//[...]
				
			if(!browserRequirements){
				$.fancybox(
          $("#requirements_form_wrapper").html(),
          {
            'autoDimensions'  : false,
            'width'           : 650,
            'height'          : 400,
            'showCloseButton' : false,
            'padding'       : 0,
            'onClosed'      : function(){
              //Do nothing!
            }
          }
        );
				return false;
			}
			
			
			//Add more requirements
			//[...]
			
			return true;
		}
		
		
		function _getInternetExplorerVersion() {
	    var rv = -1;
	    if (navigator.appName == 'Microsoft Internet Explorer') {
	        var ua = navigator.userAgent;
	        var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
	        if (re.exec(ua) != null){
						rv = parseFloat(RegExp.$1);
					} 
	    }
	    return rv;
    }
		
		
		function _getFirefoxVersion() {
      var rv = -1; // Return value assumes failure.
      if (navigator.appName == 'Netscape') {
          var ua = navigator.userAgent;
          var re = new RegExp(".* Firefox/([0-9.]+)");
          if (re.exec(ua) != null)
          rv = parseFloat(RegExp.$1); 
      }
      return rv;
    }


    var convertToTagsArray = function(tags){
	    var tagsArray = [];
	    
	    if((!tags)||(tags.length==0)){
	      return tagsArray;
	    }
	    
	    $.each(tags, function(index, tag) {
	      tagsArray.push(tag.value)
	    });
	    
	    return tagsArray;
    }
		
		var getURLParameter = function(name){
			return decodeURIComponent((location.search.match(RegExp("[?|&]"+name+'=(.+?)(&|$)'))||[,null])[1]);
		}


    return {
			init : init,
	    getOuterHTML : getOuterHTML,
			generateTable : generateTable,
			checkMiniumRequirements : checkMiniumRequirements,
			convertToTagsArray : convertToTagsArray,
			getURLParameter : getURLParameter
    };

}) (VISH);