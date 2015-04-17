var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.Quiz.API", function(){
    
//// OBJECT CREATION

    it('should create a VISH.Quiz.API object', function(){
        VISH.Quiz.API.should.be.an.instanceof(Object);
    });

//// EXPORTED METHODS

    it('should export init function', function(){
        VISH.Quiz.API.should.have.property('init');
    });

});
