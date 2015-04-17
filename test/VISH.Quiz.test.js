var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.Quiz", function(){
    
//// OBJECT CREATION

    it('should create a VISH.Quiz object', function(){
        VISH.Quiz.should.be.an.instanceof(Object);
    });

//// EXPORTED METHODS

    it('should export initBeforeRender function', function(){
        VISH.Quiz.should.have.property('initBeforeRender');
    });

    it('should export render function', function(){
        VISH.Quiz.should.have.property('render');
    });

    it('should export getQuiz function', function(){
        VISH.Quiz.should.have.property('getQuiz');
    });

    it('should export getQuizChoiceOriginalId function', function(){
        VISH.Quiz.should.have.property('getQuizChoiceOriginalId');
    });

    it('should export aftersetupSize function', function(){
        VISH.Quiz.should.have.property('aftersetupSize');
    });

});
