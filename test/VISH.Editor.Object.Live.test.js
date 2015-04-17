var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.Editor.Object.Live", function(){
    
//// OBJECT CREATION

    it('should create a VISH.Editor.Object.Live object', function(){
        VISH.Editor.Object.Live.should.be.an.instanceof(Object);
    });

//// EXPORTED METHODS

    it('should export beforeLoadTab function', function(){
        VISH.Editor.Object.Live.should.have.property('beforeLoadTab');
    });

    it('should export onLoadTab function', function(){
        VISH.Editor.Object.Live.should.have.property('onLoadTab');
    });

});
