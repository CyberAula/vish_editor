var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.Flashcard", function(){
    
//// OBJECT CREATION

    it('should create a VISH.Flashcard object', function(){
        VISH.Flashcard.should.be.an.instanceof(Object);
    });

//// EXPORTED METHODS

    it('should export init function', function(){
        VISH.Flashcard.should.have.property('init');
    });

});
