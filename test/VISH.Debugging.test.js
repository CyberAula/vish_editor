var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.Debugging", function(){
    
//// OBJECT CREATION

    it('should create a VISH.Debugging object', function(){
        VISH.Debugging.should.be.an.instanceof(Object);
    });

//// EXPORTED METHODS

    it('should export init function', function(){
        VISH.Debugging.should.have.property('init');
    });

    it('should export log function', function(){
        VISH.Debugging.should.have.property('log');
    });

    it('should export shuffleJson function', function(){
        VISH.Debugging.should.have.property('shuffleJson');
    });

    it('should export enableDevelopingMode function', function(){
        VISH.Debugging.should.have.property('enableDevelopingMode');
    });

    it('should export disableDevelopingMode function', function(){
        VISH.Debugging.should.have.property('disableDevelopingMode');
    });

    it('should export isDevelopping function', function(){
        VISH.Debugging.should.have.property('isDevelopping');
    });

    it('should export getActionInit function', function(){
        VISH.Debugging.should.have.property('getActionInit');
    });

    it('should export getPresentationSamples function', function(){
        VISH.Debugging.should.have.property('getPresentationSamples');
    });

//// METHOD RETURNS

    describe("#shuffleJson", function(){
       it('should return external object', function(){
           VISH.Debugging.shuffleJson("json").should.eql("json");
       })
    });

    describe("#isDevelopping", function(){
       it('should return internal object', function(){
           VISH.Debugging.isDevelopping().should.eql(false);
       })
    });

});
