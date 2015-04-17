var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.Editor.LRE", function(){
    
//// OBJECT CREATION

    it('should create a VISH.Editor.LRE object', function(){
        VISH.Editor.LRE.should.be.an.instanceof(Object);
    });

//// EXPORTED METHODS

    it('should export init function', function(){
        VISH.Editor.LRE.should.have.property('init');
    });

    it('should export requestImages function', function(){
        VISH.Editor.LRE.should.have.property('requestImages');
    });

    it('should export requestObjects function', function(){
        VISH.Editor.LRE.should.have.property('requestObjects');
    });

    it('should export formatLREResponse function', function(){
        VISH.Editor.LRE.should.have.property('formatLREResponse');
    });

//// METHOD RETURNS

    describe("#formatLREResponse", function(){
       it('should return internal object', function(){
           VISH.Editor.LRE.formatLREResponse("lre_response", "type").should.eql({});
       })
    });

});
