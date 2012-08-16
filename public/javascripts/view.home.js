$(function() {

	var twitterEnabled = false;

	$(".sharelink").click(function(event) {
		 var presentationId = $(this).attr("presentationId");

		 if(presentationId){
		 	var modal = $("#" + presentationId);
			
			//Url
			var spanUrl = $(modal).find("span.presentationShareLink")
			var url = "http://" + window.location.host + "/presentation/" + presentationId;
		 	$(spanUrl).html("<a href='" + url + "' target=_blank>" + url + "</a>");

		 	//Twitter
			if(!twitterEnabled){
				initTwitterShareLinks();
			}

			$("#" + presentationId).modal({
				keyboard: true
			});
		}
	});


	function initTwitterShareLinks(){
		if(twitterEnabled){
			return;	
		}
		var twitterLinks = $("a.twitter-share-button");
		$.each(twitterLinks, function(index, value) { 
		  var id = $(value).attr("data-url");
		  var url = "http://" + window.location.host + "/presentation/" + id; 
		  url = filterUrl(url);
		  $(value).attr("data-url",url);
		});

		!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="https://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");
		twitterEnabled = true;
	}


	function filterUrl(url){
		if(url.indexOf("localhost")!=-1){
		 	url = "http://www.vishEditor.com";
		}
		return url;
	}


});