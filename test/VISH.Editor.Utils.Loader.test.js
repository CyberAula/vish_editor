var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.Editor.Utils.Loader", function(){
    
//// OBJECT CREATION

    it('should create a VISH.Editor.Utils.Loader object', function(){
        VISH.Editor.Utils.Loader.should.be.an.instanceof(Object);
    });

});
