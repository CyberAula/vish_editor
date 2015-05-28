var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.Utils.iso8601Parser", function(){
    
//// OBJECT CREATION

    it('should create a VISH.Utils.iso8601Parser object', function(){
        VISH.Utils.iso8601Parser.should.be.an.instanceof(Object);
    });

//// EXPORTED METHODS

    it('should export getDurationFromISO function', function(){
        VISH.Utils.iso8601Parser.should.have.property('getDurationFromISO');
    });

    it('should export getDurationFromISOPerUnit function', function(){
        VISH.Utils.iso8601Parser.should.have.property('getDurationFromISOPerUnit');
    });


});
