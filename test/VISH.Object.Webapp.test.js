var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.Object.Webapp", function(){
    
//// OBJECT CREATION

    it('should create a VISH.Object.Webapp object', function(){
        VISH.Object.Webapp.should.be.an.instanceof(Object);
    });

//// EXPORTED METHODS

    it('should export init function', function(){
        VISH.Object.Webapp.should.have.property('init');
    });

});
