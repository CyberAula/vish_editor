var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.Editor.Quiz.TF", function(){
    
//// OBJECT CREATION

    it('should create a VISH.Editor.Quiz.TF object', function(){
        VISH.Editor.Quiz.TF.should.be.an.instanceof(Object);
    });

//// EXPORTED METHODS

    it('should export add function', function(){
        VISH.Editor.Quiz.TF.should.have.property('add');
    });

});
