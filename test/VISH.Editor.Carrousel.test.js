var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.Editor.Carrousel", function(){
    
//// OBJECT CREATION

    it('should create a VISH.Editor.Carrousel object', function(){
        VISH.Editor.Carrousel.should.be.an.instanceof(Object);
    });

});
