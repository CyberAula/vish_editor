var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.Editor.Object.GoogleDOC", function(){
    
//// OBJECT CREATION

    it('should create a VISH.Editor.Object.GoogleDOC object', function(){
        VISH.Editor.Object.GoogleDOC.should.be.an.instanceof(Object);
    });

//// EXPORTED METHODS

    it('should export init function', function(){
        VISH.Editor.Object.GoogleDOC.should.have.property('init');
    });

    it('should export generateWrapper function', function(){
        VISH.Editor.Object.GoogleDOC.should.have.property('generateWrapper');
    });

//// METHOD RETURNS

    describe("#generateWrapper", function(){
       it('should return external object', function(){
           VISH.Editor.Object.GoogleDOC.generateWrapper("url").should.eql("<iframe src='http://docs.google.com/viewer?url=url&embedded=true'></iframe>");
       })
    });

});
