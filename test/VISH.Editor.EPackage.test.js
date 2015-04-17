var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.Editor.EPackage", function(){
    
//// OBJECT CREATION

    it('should create a VISH.Editor.EPackage object', function(){
        VISH.Editor.EPackage.should.be.an.instanceof(Object);
    });

});
