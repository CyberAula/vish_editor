var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.Storage", function(){
    
//// OBJECT CREATION

    it('should create a VISH.Storage object', function(){
        VISH.Storage.should.be.an.instanceof(Object);
    });

//// EXPORTED METHODS

    it('should export init function', function(){
        VISH.Storage.should.have.property('init');
    });

    it('should export isSupported function', function(){
        VISH.Storage.should.have.property('isSupported');
    });

    it('should export add function', function(){
        VISH.Storage.should.have.property('add');
    });

    it('should export get function', function(){
        VISH.Storage.should.have.property('get');
    });

    it('should export checkLocalStorageSupport function', function(){
        VISH.Storage.should.have.property('checkLocalStorageSupport');
    });

    it('should export clear function', function(){
        VISH.Storage.should.have.property('clear');
    });

    it('should export setTestingMode function', function(){
        VISH.Storage.should.have.property('setTestingMode');
    });

//// METHOD RETURNS

    describe("#isSupported", function(){
       it('should return internal object', function(){
           VISH.Storage.isSupported().should.eql(false);
       })
    });

});
