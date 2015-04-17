var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.Editor.Filter", function(){
    
//// OBJECT CREATION

    it('should create a VISH.Editor.Filter object', function(){
        VISH.Editor.Filter.should.be.an.instanceof(Object);
    });

});
