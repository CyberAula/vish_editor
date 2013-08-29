/*
* Utils to work with the Learning Object Metadata (standard)
* LOM final draft: http://ltsc.ieee.org/wg12/files/LOM_1484_12_1_v1_Final_Draft.pdf
*/

VISH.Editor.Utils.LOM = (function(V,$,undefined){

	var LOM_difficulty = new Array();
	LOM_difficulty[0] = "unspecified";
	LOM_difficulty[1] = "very easy";
	LOM_difficulty[2] = "easy";
	LOM_difficulty[3] = "medium";
	LOM_difficulty[4] = "difficult";
	LOM_difficulty[5] = "very difficult";

	var getDifficulty = function(){
		return LOM_difficulty;
	}

	return {
		getDifficulty		: getDifficulty
	};

}) ();