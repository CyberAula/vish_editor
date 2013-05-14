VISH.Editor.Presentation.Repository = (function(V,$,undefined){

	var myInput;

	var init = function() {
		var myInput = $("#tab_presentations_repo_content").find("input[type='search']");
		$(myInput).watermark(V.Editor.I18n.getTrans("i.SearchContent"));
		$(myInput).keydown(function(event) {
			if(event.keyCode == 13) {
				// _requestData($(myInput).val());
				$(myInput).blur();
			}
		});
	};
	
	var onLoadTab = function() {
		var previousSearch = ($(myInput).find("input[type='search']").val() != "");
		if(!previousSearch) {
			// _requestInitialData();
		}
	};

	return {
		init 			: init,
		onLoadTab		: onLoadTab
	};

}) (VISH, jQuery);