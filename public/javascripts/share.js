$(function() {

	(function(d, s, id) {

	//Twitter Javascript SDK
	initTwitterShareLinks();

	//Facebook Javascript SDK
	var js, fjs = d.getElementsByTagName(s)[0];
	  if (d.getElementById(id)) return;
	  js = d.createElement(s); js.id = id;
	  js.src = "//connect.facebook.net/en_GB/all.js#xfbml=1&appId=390511184342672";
	  fjs.parentNode.insertBefore(js, fjs);
	}(document, 'script', 'facebook-jssdk'));

	var twitterEnabled = false;

	$(".sharelink").click(function(event) {
		 var presentationId = $(this).attr("presentationId");

		 if(presentationId){
		 	var modal = $("#share_" + presentationId);
			
			//Url
			var spanUrl = $(modal).find("span.presentationShareLink")
			var url = "http://" + window.location.host + "/presentation/" + presentationId;
		 	$(spanUrl).html("<a href='" + url + "' target=_blank>" + url + "</a>");

		 	//Ensure Twitter links
			if(!twitterEnabled){
				initTwitterShareLinks();
			}

			//Show modal
			$(modal).modal({ 
			        keyboard: true
			    }).css({
			       'width': function () { 
			           return '650' + 'px';  
			       },
			       'margin-left': function () {
			           return -($(this).width() / 2); 
			       }
			});
		}
	});

	$(".embedlink").click(function(event) {
		 var presentationId = $(this).attr("presentationId");

		 if(presentationId){
		 	var modal = $("#embed_" + presentationId);
			
			var url = "http://" + window.location.host + "/presentation/" + presentationId + "/full";

		 	//Generate textArea element
		 	var iframeElement = $('<iframe id="excursion_iframe" src="" width="925" height="760" style="border:0; overflow: hidden" iframeborder="0" frameborder="0" iframeElement.frameBorder = 0;></iframe>')
			$(iframeElement).attr("src",url);
			var textAreaValue = getOuterHTML($(iframeElement));

			var textArea = $(modal).find(".embedTextArea");

			$(textArea).html(textAreaValue);

			//Show modal
			$(modal).modal({ 
			        keyboard: true
			    }).css({
			       'width': function () { 
			           return '650' + 'px';  
			       },
			       'margin-left': function () {
			           return -($(this).width() / 2); 
			       }
			});
		}
	});

	//Facebook button click event
	$(".prepareShareOnFacebook").click(function(event) {
		var presentationId = $(this).attr("presentationId");
		initFacebookShareLinks(presentationId);
		event.preventDefault();
	});

	function initFacebookShareLinks(presentationId){
		var modal = $("#share_" + presentationId);
		var facebookDiv = $(modal).find(".facebookSharing");

		var url = "http://" + window.location.host + "/presentation/" + presentationId;

		$(facebookDiv).html('<fb:like href="' + url + '" send="true" width="450" show_faces="false"></fb:like>');
		var linkId = "facebooksharing_" + presentationId;
		$(facebookDiv).attr("id",linkId)
		FB.XFBML.parse(document.getElementById(linkId), function(){
			var span = $(facebookDiv).find("span");
			$(span).addClass("facebookSpan");
		});

		var modalBody = $(modal).find(".modal-body");
		$(modalBody).css("min-height","275px");
	}

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

	 var getOuterHTML = function(tag){
      //In some old browsers (before firefox 11 for example) outerHTML does not work
      //Trick to provide full browser support
      if (typeof($(tag)[0].outerHTML)=='undefined'){
        return $(tag).clone().wrap('<div></div>').parent().html();
      } else {
				return $(tag)[0].outerHTML;
			}
	  }

});