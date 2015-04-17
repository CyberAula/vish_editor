var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.Quiz.MC", function(){
    
//// OBJECT CREATION

    it('should create a VISH.Quiz.MC object', function(){
        VISH.Quiz.MC.should.be.an.instanceof(Object);
    });

//// EXPORTED METHODS

    it('should export init function', function(){
        VISH.Quiz.MC.should.have.property('init');
    });

    it('should export disableQuiz function', function(){
        VISH.Quiz.MC.should.have.property('disableQuiz');
    });

});
