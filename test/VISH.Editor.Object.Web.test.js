var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.Editor.Object.Web", function(){
    
//// OBJECT CREATION

    it('should create a VISH.Editor.Object.Web object', function(){
        VISH.Editor.Object.Web.should.be.an.instanceof(Object);
    });

//// EXPORTED METHODS

    it('should export drawPreviewElement function', function(){
        VISH.Editor.Object.Web.should.have.property('drawPreviewElement');
    });

    it('should export generateWrapperForWeb function', function(){
        VISH.Editor.Object.Web.should.have.property('generateWrapperForWeb');
    });

    it('should export generatePreviewWrapperForWeb function', function(){
        VISH.Editor.Object.Web.should.have.property('generatePreviewWrapperForWeb');
    });

//// METHOD RETURNS

    describe("#generateWrapperForWeb", function(){
       it('should return unknown', function(){
           VISH.Editor.Object.Web.generateWrapperForWeb("url").should.eql("<iframe src='url?wmode=opaque' wmode='opaque'></iframe>");
       })
    });

    describe("#generatePreviewWrapperForWeb", function(){
       it('should return unknown', function(){
           VISH.Editor.Object.Web.generatePreviewWrapperForWeb("url").should.eql("<iframe class='objectPreview' src='url?wmode=opaque' wmode='opaque'></iframe>");
       })
    });

});
