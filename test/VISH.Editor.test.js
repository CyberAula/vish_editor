var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.Editor", function(){
    
//// OBJECT CREATION

    it('should create a VISH.Editor object', function(){
        VISH.Editor.should.be.an.instanceof(Object);
    });

//// EXPORTED METHODS

    it('should export cleanArea function', function(){
        VISH.Editor.should.have.property('cleanArea');
    });

    it('should export addDeleteButton function', function(){
        VISH.Editor.should.have.property('addDeleteButton');
    });

    it('should export selectArea function', function(){
        VISH.Editor.should.have.property('selectArea');
    });

    it('should export getOptions function', function(){
        VISH.Editor.should.have.property('getOptions');
    });

    it('should export getTemplate function', function(){
        VISH.Editor.should.have.property('getTemplate');
    });

    it('should export getCurrentArea function', function(){
        VISH.Editor.should.have.property('getCurrentArea');
    });

    it('should export getLastArea function', function(){
        VISH.Editor.should.have.property('getLastArea');
    });

    it('should export getCurrentContainer function', function(){
        VISH.Editor.should.have.property('getCurrentContainer');
    });

    it('should export setCurrentContainer function', function(){
        VISH.Editor.should.have.property('setCurrentContainer');
    });

    it('should export getDraftPresentation function', function(){
        VISH.Editor.should.have.property('getDraftPresentation');
    });

    it('should export hasInitialPresentation function', function(){
        VISH.Editor.should.have.property('hasInitialPresentation');
    });

    it('should export getContentAddMode function', function(){
        VISH.Editor.should.have.property('getContentAddMode');
    });

    it('should export setContentAddMode function', function(){
        VISH.Editor.should.have.property('setContentAddMode');
    });

    it('should export getPresentationType function', function(){
        VISH.Editor.should.have.property('getPresentationType');
    });

    it('should export isPresentationDraft function', function(){
        VISH.Editor.should.have.property('isPresentationDraft');
    });

    it('should export hasPresentationChanged function', function(){
        VISH.Editor.should.have.property('hasPresentationChanged');
    });

//// METHOD RETURNS

    describe("#hasInitialPresentation", function(){
       it('should return internal object', function(){
           VISH.Editor.hasInitialPresentation().should.eql(false);
       })
    });

    describe("#getContentAddMode", function(){
       it('should return internal object', function(){
           VISH.Editor.getContentAddMode().should.eql("none");
       })
    });

    describe("#getPresentationType", function(){
       it('should return unknown', function(){
           VISH.Editor.getPresentationType().should.eql("presentation");
       })
    });

});
