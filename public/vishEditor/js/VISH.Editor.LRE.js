VISH.Editor.LRE =  (function(V,$,undefined){

	var LIMIT = 20; //number of items to search
	var VISH_LRE_URL = "";

	var init = function(options){
		if(options["urlToSearchLRE"]){
			VISH_LRE_URL = options["urlToSearchLRE"];
		}
	};



	/**
     * generic function to search in the LRE
     * explanations of params:
     *
	 * terms: array of terms to be searched. Example ["biology", "nature"] -> search in LRE content containing "biology" AND "nature"
	 * lrt: learning resource type. See the LRE Metadata Application Profile at page 35 of http://lreforschools.eun.org/c/document_library/get_file?
	 *		p_l_id=10970&folderId=12073&name=DLFE-1.pdf
	 * language: language of the learning object searched as ISO639-1 code -> example: en, es, pt
	 * maxage: only learning objects intended to users under a given age
	 * minage: only learning objects intended to users over a given age
	 * limit: number of items to return
	 * successCallback: function to pass the results if everything goes well. Format: 
	 *                 {"query": "((content[nature]))", "ids": "{394,395,410,412,414}[417, 421]", "size": 10, "timeMs": 100 }
	 * failCallback: function to pass the error if something fails. Format: {"error":"cnf cannot be null!"}
	 *
	 * We allways query the LRE with ((-cc[nd])), to remove the non-derivative results because it is intended to reuse the content and derive from it
	 *
     */    
	var _searchLRE = function(terms, lrt, language, maxage, minage, limit, successCallback, failCallback){
		var query = "";
		if(terms.length==0){
			failCallback("Search terms can´t be blank");
		}
		
		for(var i=0;i<terms.length;i++){
     		query += "((content["+terms[i]+"))";			
     	}
     	if(lrt){
     		query+="((lrt["+lrt+"]))";
     	}
     	if(language){
     		query+="((lolanguage["+language+"]))";
     	}
     	if(maxage){
			query+="((maxage["+maxage+"]))";
     	}
     	if(minage){
     		query+="((minage["+minage+"]))";
     	}
     	
		$.ajax({
	          type: "GET",
	          url: VISH_LRE_URL + "?cnf="+ query +"&limit="+ limit,
	          dataType: "html",
	          success:function(response){
	              if(typeof successCallback == "function"){
	              	var resp = JSON.parse(response);
				    successCallback(resp);
				  }
	          },
	          error:function (xhr, ajaxOptions, thrownError){
	              if(typeof failCallback == "function"){
	              	failCallback();
	              }
	          }
	 	});
	};


	return {
		_searchLRE: _searchLRE		
	};

}) (VISH, jQuery);