var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.Editor.Object", function(){
    
//// OBJECT CREATION

    it('should create a VISH.Editor.Object object', function(){
        VISH.Editor.Object.should.be.an.instanceof(Object);
    });

//// EXPORTED METHODS

    it('should export onLoadTab function', function(){
        VISH.Editor.Object.should.have.property('onLoadTab');
    });

    it('should export drawPreviewElement function', function(){
        VISH.Editor.Object.should.have.property('drawPreviewElement');
    });

    it('should export renderObjectPreview function', function(){
        VISH.Editor.Object.should.have.property('renderObjectPreview');
    });

    it('should export drawObject function', function(){
        VISH.Editor.Object.should.have.property('drawObject');
    });

});
