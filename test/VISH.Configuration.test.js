var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.Configuration", function(){
    
//// OBJECT CREATION

    it('should create a VISH.Configuration object', function(){
        VISH.Configuration.should.be.an.instanceof(Object);
    });

//// EXPORTED METHODS

    it('should export init function', function(){
        VISH.Configuration.should.have.property('init');
    });

    it('should export getConfiguration function', function(){
        VISH.Configuration.should.have.property('getConfiguration');
    });

});
