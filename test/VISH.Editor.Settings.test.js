var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.Editor.Settings", function(){
    
//// OBJECT CREATION

    it('should create a VISH.Editor.Settings object', function(){
        VISH.Editor.Settings.should.be.an.instanceof(Object);
    });

//// EXPORTED METHODS

    it('should export init function', function(){
        VISH.Editor.Settings.should.have.property('init');
    });

    it('should export onThumbnailSelected function', function(){
        VISH.Editor.Settings.should.have.property('onThumbnailSelected');
    });

    it('should export addContributor function', function(){
        VISH.Editor.Settings.should.have.property('addContributor');
    });

});
