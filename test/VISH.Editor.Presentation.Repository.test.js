var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.Editor.Presentation.Repository", function(){
    
//// OBJECT CREATION

    it('should create a VISH.Editor.Presentation.Repository object', function(){
        VISH.Editor.Presentation.Repository.should.be.an.instanceof(Object);
    });

//// EXPORTED METHODS

    it('should export beforeLoadTab function', function(){
        VISH.Editor.Presentation.Repository.should.have.property('beforeLoadTab');
    });

    it('should export onLoadTab function', function(){
        VISH.Editor.Presentation.Repository.should.have.property('onLoadTab');
    });

});
