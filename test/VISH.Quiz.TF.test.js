var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.Quiz.TF", function(){
    
//// OBJECT CREATION

    it('should create a VISH.Quiz.TF object', function(){
        VISH.Quiz.TF.should.be.an.instanceof(Object);
    });

//// EXPORTED METHODS

    it('should export init function', function(){
        VISH.Quiz.TF.should.have.property('init');
    });

    it('should export disableQuiz function', function(){
        VISH.Quiz.TF.should.have.property('disableQuiz');
    });

});
