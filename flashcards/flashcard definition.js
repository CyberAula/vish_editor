Microscopio y flashcard:

{
  "name": "myFirstFlashcard",
  "description": "flashcard explanation",
  "type": "flashcard/microscope",
  "backgroundSrc": "path/to/background/photo",  //800x480 una concreta
  "pois": [
     {"id": 1,
      "x": 125,
      "y": 123,
      "width": 23,
      "height": 34,
      "targetSrc": "path/to/content",
      "title": "example name",
      "description": "bla bla"  
   },   
     {"id": 2,
      "x": 125,
      "y": 123,
      "width": 23,
      "height": 34,
      "targetSrc": "path/to/content",
      "title": "example name",
      "description": "bla bla"  
   }
  ]
}


quiz:

{
  "name": "myFirstFlashcard",
  "description": "flashcard explanation",
  "definitions": [
    {
      "id": 1,
      "concept": "ketchup",
      "description": "bla bla bla",
      "descriptionSrc": "path/to/content"	
    },
    {
      "id": 2,
      "concept": "mostaza",
      "description": "bla bla bla",
      "descriptionSrc": "path/to/content"
    },
    {
      "id": 3,
      "concept": "mahonesa",
      "description": "bla bla bla",
      "descriptionSrc": "path/to/content"
    }
  ]
}


virtual experiment:

{
  "name": "myFirstFlashcard",
  "description": "flashcard explanation",
  "formulas": [
    {
	"elements": [
	  { "name": "hydrogen chloride",
	    "color": "rgb",
	    "type": "fire/light/water/pipeta",
	    "questionable": true/false
	  },
	  { "name": "hydrogen chloride",
	    "color": "rgb",
	    "type": "fire/light/water/pipeta",
	    "questionable": true/false
	  }
	],
	"results": [
	  { "name": "hydrogen chloride",
	    "color": "rgb",
	    "type": "fire/light/water/toxic/pipeta",
	    "questionable": true/false
	  },
	  { "name": "hydrogen chloride",
	    "color": "rgb",
	    "type": "fire/light/water/toxic/pipeta",
	    "questionable": true/false
	  }
	]
    }
  ]
}



