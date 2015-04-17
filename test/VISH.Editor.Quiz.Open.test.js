var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.Editor.Quiz.Open", function(){
    
//// OBJECT CREATION

    it('should create a VISH.Editor.Quiz.Open object', function(){
        VISH.Editor.Quiz.Open.should.be.an.instanceof(Object);
    });

//// EXPORTED METHODS

    it('should export add function', function(){
        VISH.Editor.Quiz.Open.should.have.property('add');
    });

});
