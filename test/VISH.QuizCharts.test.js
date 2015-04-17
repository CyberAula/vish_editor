var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.QuizCharts", function(){
    
//// CONSTANT DEFINITIONS

    it('should have VISH.Constant.QZ_TYPE.OPEN "openAnswer"', function(){
        VISH.Constant.QZ_TYPE.OPEN.should.be.equal('openAnswer');
    });

    it('should have VISH.Constant.QZ_TYPE.MCHOICE "multiplechoice"', function(){
        VISH.Constant.QZ_TYPE.MCHOICE.should.be.equal('multiplechoice');
    });

    it('should have VISH.Constant.QZ_TYPE.TF "truefalse"', function(){
        VISH.Constant.QZ_TYPE.TF.should.be.equal('truefalse');
    });

    it('should have VISH.Constant.QZ_TYPE.SORTING "sorting"', function(){
        VISH.Constant.QZ_TYPE.SORTING.should.be.equal('sorting');
    });

//// OBJECT CREATION

    it('should create a VISH object', function(){
        VISH.should.be.an.instanceof(Object);
    });

    it('should create a VISH.QuizCharts object', function(){
        VISH.QuizCharts.should.be.an.instanceof(Object);
    });

//// EXPORTED METHODS

    it('should export init function', function(){
        VISH.QuizCharts.should.have.property('init');
    });

    it('should export drawQuizChart function', function(){
        VISH.QuizCharts.should.have.property('drawQuizChart');
    });

});
