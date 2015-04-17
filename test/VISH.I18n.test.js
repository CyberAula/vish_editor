var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.I18n", function(){
    
//// OBJECT CREATION

    it('should create a VISH.I18n object', function(){
        VISH.I18n.should.be.an.instanceof(Object);
    });

//// EXPORTED METHODS

    it('should export getTrans function', function(){
        VISH.I18n.should.have.property('getTrans');
    });

    it('should export getLanguage function', function(){
        VISH.I18n.should.have.property('getLanguage');
    });

});
