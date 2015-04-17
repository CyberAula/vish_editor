var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.Object.PDF", function(){
    
//// OBJECT CREATION

    it('should create a VISH.Object.PDF object', function(){
        VISH.Object.PDF.should.be.an.instanceof(Object);
    });

//// EXPORTED METHODS

    it('should export init function', function(){
        VISH.Object.PDF.should.have.property('init');
    });

    it('should export generateWrapper function', function(){
        VISH.Object.PDF.should.have.property('generateWrapper');
    });

    it('should export renderPDFFromJSON function', function(){
        VISH.Object.PDF.should.have.property('renderPDFFromJSON');
    });

//// METHOD RETURNS

    describe("#renderPDFFromJSON", function(){
       it('should return unknown', function(){
           VISH.Object.PDF.renderPDFFromJSON("pdfJSON", "options").should.eql("");
       })
    });

});
