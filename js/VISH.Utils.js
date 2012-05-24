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

    return {
			init : init,
	    getOuterHTML : getOuterHTML,
			generateTable : generateTable            
    };

}) (VISH);