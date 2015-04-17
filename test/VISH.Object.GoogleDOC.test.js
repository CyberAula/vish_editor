var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.Object.GoogleDOC", function(){
    
//// OBJECT CREATION

    it('should create a VISH.Object.GoogleDOC object', function(){
        VISH.Object.GoogleDOC.should.be.an.instanceof(Object);
    });

//// EXPORTED METHODS

    it('should export init function', function(){
        VISH.Object.GoogleDOC.should.have.property('init');
    });

    it('should export generateWrapper function', function(){
        VISH.Object.GoogleDOC.should.have.property('generateWrapper');
    });

//// METHOD RETURNS

    describe("#generateWrapper", function(){
       it('should return unknown', function(){
           VISH.Object.GoogleDOC.generateWrapper("url").should.eql("<iframe src='http://docs.google.com/viewer?url=url&embedded=true'></iframe>");
       })
    });

});
