var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.Editor.PDFex", function(){
    
//// OBJECT CREATION

    it('should create a VISH.Editor.PDFex object', function(){
        VISH.Editor.PDFex.should.be.an.instanceof(Object);
    });

});
