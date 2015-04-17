var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.Editor.Utils.iso8601Parser", function(){
    
//// OBJECT CREATION

    it('should create a VISH.Editor.Utils.iso8601Parser object', function(){
        VISH.Editor.Utils.iso8601Parser.should.be.an.instanceof(Object);
    });

//// EXPORTED METHODS

    it('should export getDuration function', function(){
        VISH.Editor.Utils.iso8601Parser.should.have.property('getDuration');
    });

    it('should export getDurationPerUnit function', function(){
        VISH.Editor.Utils.iso8601Parser.should.have.property('getDurationPerUnit');
    });


});
