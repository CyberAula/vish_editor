var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.Recommendations", function(){
    
//// OBJECT CREATION

    it('should create a VISH.Recommendations object', function(){
        VISH.Recommendations.should.be.an.instanceof(Object);
    });

//// EXPORTED METHODS

    it('should export canShowRecommendations function', function(){
        VISH.Recommendations.should.have.property('canShowRecommendations');
    });

    it('should export canShowEvaluateButton function', function(){
        VISH.Recommendations.should.have.property('canShowEvaluateButton');
    });

    it('should export checkForRecommendations function', function(){
        VISH.Recommendations.should.have.property('checkForRecommendations');
    });

    it('should export isRecVisible function', function(){
        VISH.Recommendations.should.have.property('isRecVisible');
    });

    it('should export isEnabled function', function(){
        VISH.Recommendations.should.have.property('isEnabled');
    });

    it('should export getData function', function(){
        VISH.Recommendations.should.have.property('getData');
    });

    it('should export onClickEvaluateButton function', function(){
        VISH.Recommendations.should.have.property('onClickEvaluateButton');
    });

//// METHOD RETURNS

    describe("#canShowRecommendations", function(){
       it('should return unknown', function(){
           VISH.Recommendations.canShowRecommendations().should.eql(true);
       })
    });

});
