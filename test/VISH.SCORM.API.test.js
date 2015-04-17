var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.SCORM.API", function(){
    
//// OBJECT CREATION

    it('should create a VISH.SCORM.API object', function(){
        VISH.SCORM.API.should.be.an.instanceof(Object);
    });

//// EXPORTED METHODS

    it('should export init function', function(){
        VISH.SCORM.API.should.have.property('init');
    });

    it('should export getAPIInstance function', function(){
        VISH.SCORM.API.should.have.property('getAPIInstance');
    });

    it('should export getLMSAPIInstance function', function(){
        VISH.SCORM.API.should.have.property('getLMSAPIInstance');
    });

});
