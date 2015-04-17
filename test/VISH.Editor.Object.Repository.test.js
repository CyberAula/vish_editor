var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.Editor.Object.Repository", function(){
    
//// OBJECT CREATION

    it('should create a VISH.Editor.Object.Repository object', function(){
        VISH.Editor.Object.Repository.should.be.an.instanceof(Object);
    });

//// EXPORTED METHODS

    it('should export beforeLoadTab function', function(){
        VISH.Editor.Object.Repository.should.have.property('beforeLoadTab');
    });

    it('should export onLoadTab function', function(){
        VISH.Editor.Object.Repository.should.have.property('onLoadTab');
    });

});
