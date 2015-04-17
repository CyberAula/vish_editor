var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.Editor.Text", function(){
    
//// OBJECT CREATION

    it('should create a VISH.Editor.Text object', function(){
        VISH.Editor.Text.should.be.an.instanceof(Object);
    });

//// EXPORTED METHODS

    it('should export getCKEditorIframeContentFromZone function', function(){
        VISH.Editor.Text.should.have.property('getCKEditorIframeContentFromZone');
    });


});
