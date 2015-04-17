var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH", function(){
    
//// CONSTANT DEFINITIONS

    it('should have VISH.VERSION "0.9.1"', function(){
        VISH.VERSION.should.be.equal('0.9.1');
    });

    it('should have VISH.AUTHORS "GING"', function(){
        VISH.AUTHORS.should.be.equal('GING');
    });

    it('should have VISH.URL "http://github.com/ging/vish_editor"', function(){
        VISH.URL.should.be.equal('http://github.com/ging/vish_editor');
    });

//// OBJECT CREATION

    it('should create a VISH object', function(){
        VISH.should.be.an.instanceof(Object);
    });

});
