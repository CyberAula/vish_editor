var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.Editor.Object.LRE", function(){
    
//// OBJECT CREATION

    it('should create a VISH.Editor.Object.LRE object', function(){
        VISH.Editor.Object.LRE.should.be.an.instanceof(Object);
    });

//// EXPORTED METHODS

    it('should export beforeLoadTab function', function(){
        VISH.Editor.Object.LRE.should.have.property('beforeLoadTab');
    });

    it('should export onLoadTab function', function(){
        VISH.Editor.Object.LRE.should.have.property('onLoadTab');
    });

});
