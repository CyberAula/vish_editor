var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.Status", function(){
    
//// OBJECT CREATION

    it('should create a VISH.Status object', function(){
        VISH.Status.should.be.an.instanceof(Object);
    });

//// EXPORTED METHODS

    it('should export init function', function(){
        VISH.Status.should.have.property('init');
    });

    it('should export getDevice function', function(){
        VISH.Status.should.have.property('getDevice');
    });

    it('should export refreshDeviceAfterResize function', function(){
        VISH.Status.should.have.property('refreshDeviceAfterResize');
    });

    it('should export isExternalDomain function', function(){
        VISH.Status.should.have.property('isExternalDomain');
    });

    it('should export isEmbed function', function(){
        VISH.Status.should.have.property('isEmbed');
    });

    it('should export getContainer function', function(){
        VISH.Status.should.have.property('getContainer');
    });

    it('should export isOnline function', function(){
        VISH.Status.should.have.property('isOnline');
    });

    it('should export isScorm function', function(){
        VISH.Status.should.have.property('isScorm');
    });

    it('should export getIsInExternalSite function', function(){
        VISH.Status.should.have.property('getIsInExternalSite');
    });

    it('should export getIsInVishSite function', function(){
        VISH.Status.should.have.property('getIsInVishSite');
    });

    it('should export getIsPreview function', function(){
        VISH.Status.should.have.property('getIsPreview');
    });

    it('should export getIsPreviewInsertMode function', function(){
        VISH.Status.should.have.property('getIsPreviewInsertMode');
    });

    it('should export getIsUniqMode function', function(){
        VISH.Status.should.have.property('getIsUniqMode');
    });

    it('should export isSlaveMode function', function(){
        VISH.Status.should.have.property('isSlaveMode');
    });

    it('should export setSlaveMode function', function(){
        VISH.Status.should.have.property('setSlaveMode');
    });

    it('should export isPreventDefaultMode function', function(){
        VISH.Status.should.have.property('isPreventDefaultMode');
    });

    it('should export setPreventDefaultMode function', function(){
        VISH.Status.should.have.property('setPreventDefaultMode');
    });

    it('should export setWindowFocus function', function(){
        VISH.Status.should.have.property('setWindowFocus');
    });

    it('should export setCKEditorInstanceFocused function', function(){
        VISH.Status.should.have.property('setCKEditorInstanceFocused');
    });

    it('should export isVEFocused function', function(){
        VISH.Status.should.have.property('isVEFocused');
    });

});
