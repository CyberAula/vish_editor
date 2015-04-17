var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.Editor.Scrollbar", function(){
    
//// OBJECT CREATION

    it('should create a VISH.Editor.Scrollbar object', function(){
        VISH.Editor.Scrollbar.should.be.an.instanceof(Object);
    });

});
