var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.Editor.Presentation", function(){
    
//// OBJECT CREATION

    it('should create a VISH.Editor.Presentation object', function(){
        VISH.Editor.Presentation.should.be.an.instanceof(Object);
    });

//// EXPORTED METHODS

    it('should export previewPresentation function', function(){
        VISH.Editor.Presentation.should.have.property('previewPresentation');
    });

    it('should export generatePresentationScaffold function', function(){
        VISH.Editor.Presentation.should.have.property('generatePresentationScaffold');
    });

//// METHOD RETURNS

    describe("#generatePresentationScaffold", function(){
       it('should return internal object', function(){
           VISH.Editor.Presentation.generatePresentationScaffold("elements", "options").should.eql({
               "VEVersion": "0.9.1",
               "slides": [
                   {
                       "elements": [
                           "e"
                       ],
                       "id": "article1",
                       "template": "t10",
                       "type": "standard"
                   },
                   {
                       "elements": [
                           "l"
                       ],
                       "id": "article2",
                       "template": "t10",
                       "type": "standard"
                   },
                   {
                       "elements": [
                           "e"
                       ],
                       "id": "article3",
                       "template": "t10",
                       "type": "standard"
                   },
                   {
                       "elements": [
                           "m"
                       ],
                       "id": "article4",
                       "template": "t10",
                       "type": "standard"
                   },
                   {
                       "elements": [
                           "e"
                       ],
                       "id": "article5",
                       "template": "t10",
                       "type": "standard"
                   },
                   {
                       "elements": [
                           "n"
                       ],
                       "id": "article6",
                       "template": "t10",
                       "type": "standard"
                   },
                   {
                       "elements": [
                           "t"
                       ],
                       "id": "article7",
                       "template": "t10",
                       "type": "standard"
                   },
                   {
                       "elements": [
                           "s"
                       ],
                       "id": "article8",
                       "template": "t10",
                       "type": "standard"
                   }
               ],
               "theme": "theme1",
               "type": "presentation"
           });
       })
    });

});
