var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.Editor.Object.Webapp", function(){
    
//// OBJECT CREATION

    it('should create a VISH.Editor.Object.Webapp object', function(){
        VISH.Editor.Object.Webapp.should.be.an.instanceof(Object);
    });

//// EXPORTED METHODS

    it('should export init function', function(){
        VISH.Editor.Object.Webapp.should.have.property('init');
    });

    it('should export generatePreviewWrapper function', function(){
        VISH.Editor.Object.Webapp.should.have.property('generatePreviewWrapper');
    });

    it('should export generateWrapper function', function(){
        VISH.Editor.Object.Webapp.should.have.property('generateWrapper');
    });

    it('should export afterDraw function', function(){
        VISH.Editor.Object.Webapp.should.have.property('afterDraw');
    });

//// METHOD RETURNS

    describe("#generatePreviewWrapper", function(){
       it('should return unknown', function(){
           VISH.Editor.Object.Webapp.generatePreviewWrapper("url").should.eql("<iframe class='objectPreview' objecttype='webapp' src='url?wmode=opaque' wmode='opaque'></iframe>");
       })
    });

});
