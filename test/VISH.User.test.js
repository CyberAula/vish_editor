var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.User", function(){
    
//// OBJECT CREATION

    it('should create a VISH.User object', function(){
        VISH.User.should.be.an.instanceof(Object);
    });

//// EXPORTED METHODS

    it('should export init function', function(){
        VISH.User.should.have.property('init');
    });

    it('should export isLogged function', function(){
        VISH.User.should.have.property('isLogged');
    });

    it('should export getUser function', function(){
        VISH.User.should.have.property('getUser');
    });

    it('should export setUser function', function(){
        VISH.User.should.have.property('setUser');
    });

    it('should export getName function', function(){
        VISH.User.should.have.property('getName');
    });

    it('should export getId function', function(){
        VISH.User.should.have.property('getId');
    });

    it('should export getToken function', function(){
        VISH.User.should.have.property('getToken');
    });

});
