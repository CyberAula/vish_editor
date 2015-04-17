var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.SCORM", function(){
    
//// OBJECT CREATION

    it('should create a VISH.SCORM object', function(){
        VISH.SCORM.should.be.an.instanceof(Object);
    });

//// EXPORTED METHODS

    it('should export init function', function(){
        VISH.SCORM.should.have.property('init');
    });

    it('should export initAfterRender function', function(){
        VISH.SCORM.should.have.property('initAfterRender');
    });

});
