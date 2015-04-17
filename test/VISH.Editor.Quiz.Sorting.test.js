var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.Editor.Quiz.Sorting", function(){
    
//// OBJECT CREATION

    it('should create a VISH.Editor.Quiz.Sorting object', function(){
        VISH.Editor.Quiz.Sorting.should.be.an.instanceof(Object);
    });

//// EXPORTED METHODS

    it('should export add function', function(){
        VISH.Editor.Quiz.Sorting.should.have.property('add');
    });

    it('should export isSelfAssessment function', function(){
        VISH.Editor.Quiz.Sorting.should.have.property('isSelfAssessment');
    });

    it('should export afterCopyQuiz function', function(){
        VISH.Editor.Quiz.Sorting.should.have.property('afterCopyQuiz');
    });

//// METHOD RETURNS

    describe("#isSelfAssessment", function(){
       it('should return unknown', function(){
           VISH.Editor.Quiz.Sorting.isSelfAssessment().should.eql(true);
       })
    });

});
