VISH.Editor.IMSQTI = (function(V,$,undefined){
	var init = function(){
	};
	
 

 var isCompliantXMLFile = function(fileXML){
		xmlDoc = $.parseXML( fileXML ),
		$xml = $( xmlDoc );
		
		return !$.isEmptyObject($(xml).find('assessmentItem'));
 }


 var getJSONFromXMLFile = function(fileXML){

 		var elements = [];
 		var cardinality;
 		var question;
 		var answerArray = [];

		xmlDoc = $.parseXML( fileXML ),
		$xml = $( xmlDoc )


		/* To get cardinality */

		$(xml).find('responseDeclaration').each(function(){
		  $(this.attributes).each(function(index,attribute){
		    if(attribute.name == "cardinality"){
		      cardinality = attribute.textContent;
		    }
		});


		/*To get the question */

		$(xml).find('prompt').each(function(){
  			question = $(this).text();
		});


		/*To get array of answers */
		$(xml).find('simpleChoice').each(function(){
 			 var answer = $(this).text();
  			answerArray.push(answer);
		});

		/* We know get all the data we have to retrieve from XML */






/* Esto es lo que tengo que insertar
		"elements":[
					{"id":"article2_zone1",
					"type":"quiz",
					"areaid":"left",
					"quiztype":"multiplechoice",
					"selfA":true,
					"question":{
						"value":"­What is the oldest ancient weapon?",
						"wysiwygValue":"<p style=\"text-align:left;\">\n\t<span autocolor=\"true\" style=\"color:#000\"><span style=\"font-size:38px;\">&shy;What is the oldest ancient weapon?</span></span></p>\n"
					},

					"choices":[{
						"id":"1",
						"value":"Fu­",
						"wysiwygValue":"<p style=\"text-align:left;\">\n\t<span autocolor=\"true\" style=\"color:#000\"><span style=\"font-size:24px;\">Fu&shy;</span></span></p>\n",
						"answer":false},

						{"id":"2",
						"value":"­Bow",
						"wysiwygValue":"<p style=\"text-align:left;\">\n\t<span autocolor=\"true\" style=\"color:#000\"><span style=\"font-size:24px;\">&shy;Bow</span></span></p>\n",
						"answer":true},

						{"id":"3",
						"value":"­Chu Ko Nuh",
						"wysiwygValue":"<p style=\"text-align:left;\">\n\t<span autocolor=\"true\" style=\"color:#000\"><span style=\"font-size:24px;\">&shy;Chu Ko Nuh</span></span></p>\n",
						"answer":false},

						{"id":"4",
						"value":"­War Galley",
						"wysiwygValue":"<p style=\"text-align:left;\">\n\t<span autocolor=\"true\" style=\"color:#000\"><span style=\"font-size:24px;\">&shy;War Galley</span></span></p>\n",
						"answer":false
					}],

					"extras":{
						"multipleAnswer":false
					}


*/









		elements.push({"id":"article2_zone1", 
			"type":"quiz", 
			"areaid":"left", 
			"quiztype":"multiplechoice",
			"selfA":true, 
			"question":{
				"value":question,  
				"wysiwygValue":"<p style=\"text-align:left;\">\n\t<span autocolor=\"true\" style=\"color:#000\"><span style=\"font-size:38px;\">&shy;" + question + "</span></span></p>\n"
			}, 

			"choices":[{
						"id":"1",
						"value":"Fu­",
						"wysiwygValue":"<p style=\"text-align:left;\">\n\t<span autocolor=\"true\" style=\"color:#000\"><span style=\"font-size:24px;\">Fu&shy;</span></span></p>\n",
						"answer":false
			},

						{"id":"2",
						"value":"­Bow",
						"wysiwygValue":"<p style=\"text-align:left;\">\n\t<span autocolor=\"true\" style=\"color:#000\"><span style=\"font-size:24px;\">&shy;Bow</span></span></p>\n",
						"answer":true},

						{"id":"3",
						"value":"­Chu Ko Nuh",
						"wysiwygValue":"<p style=\"text-align:left;\">\n\t<span autocolor=\"true\" style=\"color:#000\"><span style=\"font-size:24px;\">&shy;Chu Ko Nuh</span></span></p>\n",
						"answer":false},

						{"id":"4",
						"value":"­War Galley",
						"wysiwygValue":"<p style=\"text-align:left;\">\n\t<span autocolor=\"true\" style=\"color:#000\"><span style=\"font-size:24px;\">&shy;War Galley</span></span></p>\n",
						"answer":false
					}],

					"extras":{
						"multipleAnswer":false
					}

);

		var options = {
			template : "t2",
		}
		return V.Editor.Presentation.generatePresentationScaffold(elements,options);





 	//return null;
 }

 /*
 !$.isEmptyObject($.find('#id'))
 This will return true if the element exists and false if it doesn't.
 */

 /*TO DO
	First we have to check if there's a label called assessmentItem. If there's no one,
	we can assure it's not a QTI XML file.
	
	Doubt: in case there's a file with assessmentItem, do we have to check if that's the correct format?




 */

	return {
		init 		: init,
		isCompliantXMLFile			:  isCompliantXMLFile,
		getJSONFromXMLFile			:  getJSONFromXMLFile
	};

}) (VISH, jQuery);
