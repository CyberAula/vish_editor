/*
* Utils to work with the LOM (Learning Object Metadata) standard
* LOM final draft: http://ltsc.ieee.org/wg12/files/LOM_1484_12_1_v1_Final_Draft.pdf
*/

VISH.Editor.Utils.LOM = (function(V,$,undefined){

	var LOM_difficulty;

	var _init = function(){
		LOM_difficulty = new Array();
		LOM_difficulty[0] = { value: "unspecified", text: V.I18n.getTrans("i.unspecified")};
		LOM_difficulty[1] = { value: "very easy", text: V.I18n.getTrans("i.veryeasy")};
		LOM_difficulty[2] = { value: "easy", text: V.I18n.getTrans("i.easy")};
		LOM_difficulty[3] = { value: "medium", text: V.I18n.getTrans("i.medium")};
		LOM_difficulty[4] = { value: "difficult", text: V.I18n.getTrans("i.difficult")};
		LOM_difficulty[5] = { value: "very difficult", text: V.I18n.getTrans("i.verydifficult")};
	}

	var getDifficulty = function(){
		if(typeof LOM_difficulty == "undefined"){
			_init();
		}
		return LOM_difficulty;
	}

	return {
		getDifficulty	: getDifficulty
	};

}) (VISH, jQuery);