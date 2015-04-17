var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.VirtualTour", function(){
    
//// OBJECT CREATION

    it('should create a VISH.VirtualTour object', function(){
        VISH.VirtualTour.should.be.an.instanceof(Object);
    });

//// EXPORTED METHODS

    it('should export init function', function(){
        VISH.VirtualTour.should.have.property('init');
    });

});
