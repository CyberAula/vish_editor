var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.Quiz.Open", function(){
    
//// OBJECT CREATION

    it('should create a VISH.Quiz.Open object', function(){
        VISH.Quiz.Open.should.be.an.instanceof(Object);
    });

//// EXPORTED METHODS

    it('should export init function', function(){
        VISH.Quiz.Open.should.have.property('init');
    });

    it('should export disableQuiz function', function(){
        VISH.Quiz.Open.should.have.property('disableQuiz');
    });

});
