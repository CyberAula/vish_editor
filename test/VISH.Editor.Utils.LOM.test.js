var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.Editor.Utils.LOM", function(){

//// OBJECT CREATION

    it('should create a VISH.Editor.Utils.LOM object', function(){
        VISH.Editor.Utils.LOM.should.be.an.instanceof(Object);
    });

//// EXPORTED METHODS

    it('should export getDifficulty function', function(){
        VISH.Editor.Utils.LOM.should.have.property('getDifficulty');
    });

//// METHOD RETURNS

    describe("#getDifficulty", function(){
       it('should return internal object', function(){
           VISH.Editor.Utils.LOM.getDifficulty().should.eql( [ {
               "text": null,
               "value": "unspecified"
           },
           {
               "text": null,
               "value": "very easy"
           },
           {
               "text": null,
               "value": "easy"
           },
           {
               "text": null,
               "value": "medium"
           },
           {
               "text": null,
               "value": "difficult"
           },
           {
               "text": null,
               "value": "very difficult"
           }]);
       })
    });

});
