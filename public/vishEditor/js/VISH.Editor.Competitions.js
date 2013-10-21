VISH.Editor.Competitions = (function(V,$,undefined){

	var competitionTag = 'ViSHCompetition2013';
	var competitionCategories = ['Maths', 'Physics', 'Chemistry', 'Biology', 'EnvironmentalStudies', 'Geography', 'Engineering', 'Humanities', 'NaturalScience', 'ComputerScience'];
	var misleadingTags = ['ViSHCompetitions2013'];
	var specialTags = [];

	var init = function(){
	};

	var addCompetitionTags = function(tagsArray){
		if(typeof tagsArray == "object"){
			tagsArray = _purgeTags(tagsArray);
			var competitionTags = _getAllTags();
			$(competitionTags).each(function(index,value){
				if(tagsArray.indexOf(value)==-1){
					tagsArray.unshift(value);
				}
			});
		}
		return tagsArray;
	}

	var _purgeTags = function(tagsArray){
		var tagsToRemove = [];
		$(tagsArray).each(function(index,value){
			if(_isSimilarToACompetitionTag(value,true)){
				tagsToRemove.push(value);
			}
		});
		$(tagsToRemove).each(function(index,value){
			tagsArray.splice(tagsArray.indexOf(value), 1);
		});
		return tagsArray;
	}

	var _getAllTags = function(){
		var allTags = jQuery.extend([], competitionCategories);
		allTags.push(competitionTag);
		return allTags;
	}

	var _isSimilarToACompetitionTag = function(tag, includeEquals){
		if(typeof tag != "string"){
			return false;
		}

		var competitionTags = _getAllTags();
		var cL = competitionTags.length;
		for(var i=0; i<cL; i++){
			if(_areSimilarTags(tag,competitionTags[i],includeEquals)){
				return true;
			};
		};

		var mL = misleadingTags.length;
		for(var j=0; j<mL; j++){
			if(_areSimilarTags(tag,misleadingTags[j],true)){
				return true;
			};
		};

		return false;
	}

	var _areSimilarTags = function(tag1,tag2,includeEquals){
		
		if(tag1 == tag2){
			if(includeEquals===true){
				return true;
			} else {
				return false;
			}
		}

		var myTag1 = new String(tag1);
		var myTag2 = new String(tag2);
		myTag1 = myTag1.toLowerCase();
		myTag2 = myTag2.toLowerCase();
		if(myTag1 == myTag2){
			return true;
		}
		return false;
	}

	var isValidCandidate = function(){
		var tags = V.Editor.Settings.getTags();

		if((!tags)||(tags.length<1)){
			return false;
		}

		if(tags.indexOf(competitionTag)!=-1){
			//Competition tag included
			//now check if a competition category is included (one is mandatory)
			var ccL = competitionCategories.length;
			for(var i=0; i<ccL; i++){
				if(tags.indexOf(competitionCategories[i])!=-1){
					return true;
				}
			};
		} else {
			//Competition tag not included
			return false;
		}

		//No category included
		return false;
	}

	var generateForm = function(){
		var result = "<div class='comp_first_row'>" + V.I18n.getTrans("i.NoCompetitions2") + "</div>";
		result += "<div class='comp_second_row'>" + V.I18n.getTrans("i.NoCompetitions3") + "</div>";
		for (var i = 0; i<=competitionCategories.length - 1; i++) {
			result += "<div class='comp_checkbox'><input type='checkbox' name='"+competitionCategories[i]+"' value='"+competitionCategories[i]+"'  />"+competitionCategories[i]+"</div>";
		};

		return result;
	};


	var specialTagSelected = function(event){
		var tagList = $("#tagBoxIntro .tagList");
		if ($(event.target).is(':checked')){
			//specialTags.push($(event.target).val());
			$(tagList).tagit("add", $(event.target).val());
		}
		else{
			//var index = specialTags.indexOf($(event.target).val());
			//specialTags.splice(index, 1);
			$(tagList).tagit("remove", $(event.target).val());
		}
		
	};

	var getSpecialTags = function(){
		return specialTags;
	};


	return {
		init				: init,
		addCompetitionTags	: addCompetitionTags,
		generateForm		: generateForm,
		getSpecialTags		: getSpecialTags,
		isValidCandidate	: isValidCandidate,
		specialTagSelected  : specialTagSelected
	};

}) (VISH, jQuery);