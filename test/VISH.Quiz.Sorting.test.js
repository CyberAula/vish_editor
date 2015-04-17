var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.Quiz.Sorting", function(){
    
//// OBJECT CREATION

    it('should create a VISH.Quiz.Sorting object', function(){
        VISH.Quiz.Sorting.should.be.an.instanceof(Object);
    });

//// EXPORTED METHODS

    it('should export init function', function(){
        VISH.Quiz.Sorting.should.have.property('init');
    });

    it('should export disableQuiz function', function(){
        VISH.Quiz.Sorting.should.have.property('disableQuiz');
    });

});
