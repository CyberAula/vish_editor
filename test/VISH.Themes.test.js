var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.Themes", function(){
    
//// OBJECT CREATION

    it('should create a VISH.Themes object', function(){
        VISH.Themes.should.be.an.instanceof(Object);
    });

//// EXPORTED METHODS

    it('should export loadTheme function', function(){
        VISH.Themes.should.have.property('loadTheme');
    });

});
