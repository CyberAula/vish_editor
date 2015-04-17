var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.Editor.Object.Flash", function(){
    
//// OBJECT CREATION

    it('should create a VISH.Editor.Object.Flash object', function(){
        VISH.Editor.Object.Flash.should.be.an.instanceof(Object);
    });

});
