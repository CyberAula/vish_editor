var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.Editor.Tools", function(){
    
//// OBJECT CREATION

    it('should create a VISH.Editor.Tools object', function(){
        VISH.Editor.Tools.should.be.an.instanceof(Object);
    });

//// EXPORTED METHODS

    it('should export cleanToolbar function', function(){
        VISH.Editor.Tools.should.have.property('cleanToolbar');
    });

    it('should export changePublishButtonStatus function', function(){
        VISH.Editor.Tools.should.have.property('changePublishButtonStatus');
    });

    it('should export changeSaveButtonStatus function', function(){
        VISH.Editor.Tools.should.have.property('changeSaveButtonStatus');
    });

    it('should export loadToolbarForObject function', function(){
        VISH.Editor.Tools.should.have.property('loadToolbarForObject');
    });

    it('should export save function', function(){
        VISH.Editor.Tools.should.have.property('save');
    });

    it('should export publish function', function(){
        VISH.Editor.Tools.should.have.property('publish');
    });

    it('should export unpublish function', function(){
        VISH.Editor.Tools.should.have.property('unpublish');
    });

    it('should export preview function', function(){
        VISH.Editor.Tools.should.have.property('preview');
    });

    it('should export changeVideo function', function(){
        VISH.Editor.Tools.should.have.property('changeVideo');
    });

    it('should export zoomMore function', function(){
        VISH.Editor.Tools.should.have.property('zoomMore');
    });

    it('should export zoomLess function', function(){
        VISH.Editor.Tools.should.have.property('zoomLess');
    });

    it('should export resizeMore function', function(){
        VISH.Editor.Tools.should.have.property('resizeMore');
    });

    it('should export resizeLess function', function(){
        VISH.Editor.Tools.should.have.property('resizeLess');
    });

    it('should export quizSettings function', function(){
        VISH.Editor.Tools.should.have.property('quizSettings');
    });

});
