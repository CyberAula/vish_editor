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

	var _unloadObjectsInEditor = function(objects){
		$.each(objects, function(index, object){
			var htmlContent = $(object).html();
			if((typeof htmlContent !== "undefined")&&(htmlContent!=="")){
				$(object).attr("htmlContent",$(object).html());
				$(object).html("");
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

				$(snapshot).scrollTop(scrollTop);
				$(snapshot).scrollLeft(scrollLeft);
			}
		});
	}

	var _unloadSnapshotsInEditor = function(snapshots,updateScrolls){
		$.each(snapshots, function(index, snapshot){
			var htmlContent = $(snapshot).html();
			if((typeof htmlContent !== "undefined")&&(htmlContent!=="")){
				//Scrolls only must been saved when the slide is visible
				//Otherwise scrollTop/Left returns 0 and values ​​are corrupted
				if(updateScrolls===true){
					//Save scrolls
					$(snapshot).attr("scrollTop",$(snapshot).scrollTop());
					$(snapshot).attr("scrollLeft",$(snapshot).scrollLeft());
				}

				$(snapshot).attr("htmlContent",htmlContent);
				$(snapshot).html("");
			}
		});
	}

	var loadObjectsInEditorSlide = function(slide){
		_loadObjectsInEditor($(slide).find(".object_wrapper"));
		_loadSnapshotsInEditor($(slide).find(".snapshot_wrapper"));
	}

	var unloadObjectsInEditorSlide = function(slide){
		_unloadObjectsInEditor($(slide).find(".object_wrapper"));
		_unloadSnapshotsInEditor($(slide).find(".snapshot_wrapper"),true);
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
		loadObjectsInEditorSlide 	: loadObjectsInEditorSlide,
		unloadObjectsInEditorSlide 	: unloadObjectsInEditorSlide,
		loadAllObjects 				: loadAllObjects,
		unloadAllObjects			: unloadAllObjects
	};

}) (VISH, jQuery);
