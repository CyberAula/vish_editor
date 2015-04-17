var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.Editor.MenuTablet", function(){
    
//// OBJECT CREATION

    it('should create a VISH.Editor.MenuTablet object', function(){
        VISH.Editor.MenuTablet.should.be.an.instanceof(Object);
    });

});
