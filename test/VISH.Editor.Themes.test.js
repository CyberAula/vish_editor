var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.Editor.Themes", function(){
    
//// OBJECT CREATION

    it('should create a VISH.Editor.Themes object', function(){
        VISH.Editor.Themes.should.be.an.instanceof(Object);
    });

//// EXPORTED METHODS

    it('should export init function', function(){
        VISH.Editor.Themes.should.have.property('init');
    });

    it('should export getCurrentTheme function', function(){
        VISH.Editor.Themes.should.have.property('getCurrentTheme');
    });

});
