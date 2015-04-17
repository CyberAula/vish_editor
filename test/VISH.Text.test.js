var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.Text", function(){
    
//// OBJECT CREATION

    it('should create a VISH.Text object', function(){
        VISH.Text.should.be.an.instanceof(Object);
    });

});
