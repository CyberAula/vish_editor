var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.Editor.Object.Scorm", function(){
    
//// OBJECT CREATION

    it('should create a VISH.Editor.Object.Scorm object', function(){
        VISH.Editor.Object.Scorm.should.be.an.instanceof(Object);
    });

//// EXPORTED METHODS

    it('should export init function', function(){
        VISH.Editor.Object.Scorm.should.have.property('init');
    });

    it('should export generatePreviewWrapperForScorm function', function(){
        VISH.Editor.Object.Scorm.should.have.property('generatePreviewWrapperForScorm');
    });

    it('should export generateWrapperForScorm function', function(){
        VISH.Editor.Object.Scorm.should.have.property('generateWrapperForScorm');
    });

    it('should export afterDrawSCORM function', function(){
        VISH.Editor.Object.Scorm.should.have.property('afterDrawSCORM');
    });

//// METHOD RETURNS

    describe("#generatePreviewWrapperForScorm", function(){
       it('should return unknown', function(){
           VISH.Editor.Object.Scorm.generatePreviewWrapperForScorm("url").should.eql("<iframe class='objectPreview' objecttype='scormpackage' src='url?wmode=opaque' wmode='opaque'></iframe>");
       })
    });

    describe("#generateWrapperForScorm", function(){
       it('should return unknown', function(){
           VISH.Editor.Object.Scorm.generateWrapperForScorm("url").should.eql("<iframe objecttype='scormpackage' src='url?wmode=opaque' wmode='opaque'></iframe>");
       })
    });

});
