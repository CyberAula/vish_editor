var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.Editor.ViewerAdapter", function(){
    
//// OBJECT CREATION

    it('should create a VISH.Editor.ViewerAdapter object', function(){
        VISH.Editor.ViewerAdapter.should.be.an.instanceof(Object);
    });

});
