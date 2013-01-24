VISH.Editor.Utils.Loader = (function(V,$,undefined){


	var _loadObjectsInEditor = function(objects){
		$.each(objects, function(index, object){
			var htmlContent = $(object).attr("htmlContent");
			if(typeof htmlContent !== "undefined"){
				$(object).html(htmlContent);
				$(object).removeAttr("htmlContent");
			}
		});
	}

	var _loadSnapshotsInEditor = function(snapshots){
		$.each(snapshots, function(index, snapshot){
			var htmlContent = $(snapshot).attr("htmlContent");
			if(typeof htmlContent !== "undefined"){
				$(snapshot).html(htmlContent);
				$(snapshot).removeAttr("htmlContent");
				//Restore Scrolls
				var scrollTop = parseInt($(snapshot).attr("scrollTop"));
				var scrollLeft = parseInt($(snapshot).attr("scrollLeft"));

				setTimeout(function(){
					$(snapshot).scrollTop(scrollTop);
					$(snapshot).scrollLeft(scrollLeft);
				},200);

				$(snapshot).removeAttr("scrollTop");
				$(snapshot).removeAttr("scrollLeft");
			}
		});
	}

	var _unloadObjectsInEditor = function(objects){
		$.each(objects, function(index, object){
			$(object).attr("htmlContent",$(object).html());
			$(object).html("");
		});
	}

	var _unloadSnapshotsInEditor = function(snapshots){
		$.each(snapshots, function(index, snapshot){
			//Save scrolls
			$(snapshot).attr("scrollTop",$(snapshot).scrollTop());
			$(snapshot).attr("scrollLeft",$(snapshot).scrollLeft());

			$(snapshot).attr("htmlContent",$(snapshot).html());
			$(snapshot).html("");
		});
	}

	var loadObjectsInEditorSlide = function(slide){
		_loadObjectsInEditor($(slide).find(".object_wrapper"));
		_loadSnapshotsInEditor($(slide).find(".snapshot_wrapper"));
	}

	var unloadObjectsInEditorSlide = function(slide){
		_unloadObjectsInEditor($(slide).find(".object_wrapper"));
		_unloadSnapshotsInEditor($(slide).find(".snapshot_wrapper"));
	}

	var loadAllObjects = function(){
		_loadObjectsInEditor($(".object_wrapper"));
		_loadSnapshotsInEditor($(".snapshot_wrapper"));
	}

	var unloadAllObjects = function(){
		_unloadObjectsInEditor($(".object_wrapper"));
		_unloadSnapshotsInEditor($(".snapshot_wrapper"));
	}

	return {
		loadAllObjects 				: loadAllObjects,
		unloadAllObjects			: unloadAllObjects,
		loadObjectsInEditorSlide 	: loadObjectsInEditorSlide,
		unloadObjectsInEditorSlide 	: unloadObjectsInEditorSlide
	};

}) (VISH, jQuery);
