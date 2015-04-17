var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.Editor.Quiz", function(){
    
//// OBJECT CREATION

    it('should create a VISH.Editor.Quiz object', function(){
        VISH.Editor.Quiz.should.be.an.instanceof(Object);
    });

//// EXPORTED METHODS

    it('should export draw function', function(){
        VISH.Editor.Quiz.should.have.property('draw');
    });

});
