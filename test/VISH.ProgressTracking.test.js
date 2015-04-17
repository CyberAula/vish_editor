var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.ProgressTracking", function(){
    
//// OBJECT CREATION

    it('should create a VISH.ProgressTracking object', function(){
        VISH.ProgressTracking.should.be.an.instanceof(Object);
    });

//// EXPORTED METHODS

    it('should export init function', function(){
        VISH.ProgressTracking.should.have.property('init');
    });

    it('should export getProgressMeasure function', function(){
        VISH.ProgressTracking.should.have.property('getProgressMeasure');
    });

    it('should export getScore function', function(){
        VISH.ProgressTracking.should.have.property('getScore');
    });

    it('should export getHasScore function', function(){
        VISH.ProgressTracking.should.have.property('getHasScore');
    });

    it('should export getObjectives function', function(){
        VISH.ProgressTracking.should.have.property('getObjectives');
    });

//// METHOD RETURNS

    describe("#getScore", function(){
       it('should return unknown', function(){
           VISH.ProgressTracking.getScore().should.eql(0);
       })
    });

    describe("#getHasScore", function(){
       it('should return internal object', function(){
           VISH.ProgressTracking.getHasScore().should.eql(false);
       })
    });

    describe("#getObjectives", function(){
       it('should return internal object', function(){
           VISH.ProgressTracking.getObjectives().should.eql({});
       })
    });

});
