var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.Editor.Clipboard", function(){
    
//// OBJECT CREATION

    it('should create a VISH.Editor.Clipboard object', function(){
        VISH.Editor.Clipboard.should.be.an.instanceof(Object);
    });

//// EXPORTED METHODS

    it('should export init function', function(){
        VISH.Editor.Clipboard.should.have.property('init');
    });

});
