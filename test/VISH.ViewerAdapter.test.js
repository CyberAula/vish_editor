var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.ViewerAdapter", function(){
    
//// OBJECT CREATION

    it('should create a VISH.ViewerAdapter object', function(){
        VISH.ViewerAdapter.should.be.an.instanceof(Object);
    });

//// EXPORTED METHODS

    it('should export getDimensionsForResizedButton function', function(){
        VISH.ViewerAdapter.should.have.property('getDimensionsForResizedButton');
    });

    it('should export getLastIncrease function', function(){
        VISH.ViewerAdapter.should.have.property('getLastIncrease');
    });

    it('should export getPonderatedIncrease function', function(){
        VISH.ViewerAdapter.should.have.property('getPonderatedIncrease');
    });

//// METHOD RETURNS

    describe("#getDimensionsForResizedButton", function(){
       it('should return unknown', function(){
           VISH.ViewerAdapter.getDimensionsForResizedButton("increase", "originalWidth", "aspectRatio").should.eql({ width: NaN, height: NaN });
       })
    });

    describe("#getLastIncrease", function(){
       it('should return unknown', function(){
           VISH.ViewerAdapter.getLastIncrease().should.eql([ undefined, undefined ]);
       })
    });

    describe("#getPonderatedIncrease", function(){
       it('should return unknown', function(){
           VISH.ViewerAdapter.getPonderatedIncrease("increase", "pFactor").should.eql(NaN);
       })
    });

});
