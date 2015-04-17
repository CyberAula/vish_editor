var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.Addons", function(){
    
//// OBJECT CREATION

    it('should create a VISH.Addons object', function(){
        VISH.Addons.should.be.an.instanceof(Object);
    });

//// EXPORTED METHODS

    it('should export init function', function(){
        VISH.Addons.should.have.property('init');
    });

});
