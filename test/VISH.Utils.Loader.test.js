var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.Utils.Loader", function(){
    
//// OBJECT CREATION

    it('should create a VISH.Utils.Loader object', function(){
        VISH.Utils.Loader.should.be.an.instanceof(Object);
    });

//// EXPORTED METHODS

    it('should export loadImagesOnContainer function', function(){
        VISH.Utils.Loader.should.have.property('loadImagesOnContainer');
    });

    it('should export loadScript function', function(){
        VISH.Utils.Loader.should.have.property('loadScript');
    });

    it('should export loadGoogleLibrary function', function(){
        VISH.Utils.Loader.should.have.property('loadGoogleLibrary');
    });

    it('should export onGoogleLibraryLoaded function', function(){
        VISH.Utils.Loader.should.have.property('onGoogleLibraryLoaded');
    });

    it('should export loadCSS function', function(){
        VISH.Utils.Loader.should.have.property('loadCSS');
    });

    it('should export loadDeviceCSS function', function(){
        VISH.Utils.Loader.should.have.property('loadDeviceCSS');
    });

    it('should export loadLanguageCSS function', function(){
        VISH.Utils.Loader.should.have.property('loadLanguageCSS');
    });

});
