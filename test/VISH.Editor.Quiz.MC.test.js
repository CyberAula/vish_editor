var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.Editor.Quiz.MC", function(){
    
//// OBJECT CREATION

    it('should create a VISH.Editor.Quiz.MC object', function(){
        VISH.Editor.Quiz.MC.should.be.an.instanceof(Object);
    });

//// EXPORTED METHODS

    it('should export add function', function(){
        VISH.Editor.Quiz.MC.should.have.property('add');
    });

});
