var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.Slideset", function(){
    
//// OBJECT CREATION

    it('should create a VISH.Slideset object', function(){
        VISH.Slideset.should.be.an.instanceof(Object);
    });

//// EXPORTED METHODS

    it('should export init function', function(){
        VISH.Slideset.should.have.property('init');
    });

    it('should export getViewerModule function', function(){
        VISH.Slideset.should.have.property('getViewerModule');
    });

    it('should export isSlideset function', function(){
        VISH.Slideset.should.have.property('isSlideset');
    });

    it('should export draw function', function(){
        VISH.Slideset.should.have.property('draw');
    });

    it('should export afterSetupSize function', function(){
        VISH.Slideset.should.have.property('afterSetupSize');
    });

    it('should export onCloseSubslideClicked function', function(){
        VISH.Slideset.should.have.property('onCloseSubslideClicked');
    });

//// METHOD RETURNS

    describe("#isSlideset", function(){
       it('should return external object', function(){
           VISH.Slideset.isSlideset("obj").should.eql(false);
       })
    });

});
