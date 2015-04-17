var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.Police", function(){
    
//// OBJECT CREATION

    it('should create a VISH.Police object', function(){
        VISH.Police.should.be.an.instanceof(Object);
    });

//// EXPORTED METHODS

    it('should export init function', function(){
        VISH.Police.should.have.property('init');
    });

    it('should export validateObject function', function(){
        VISH.Police.should.have.property('validateObject');
    });

    it('should export validateFileUpload function', function(){
        VISH.Police.should.have.property('validateFileUpload');
    });

//// METHOD RETURNS

    describe("#validateFileUpload", function(){
       it('should return unknown', function(){
           VISH.Police.validateFileUpload("fileName").should.eql([ true, 'Validation Ok' ]);
       })
    });

});
