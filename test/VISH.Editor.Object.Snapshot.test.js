var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.Editor.Object.Snapshot", function(){
    
//// OBJECT CREATION

    it('should create a VISH.Editor.Object.Snapshot object', function(){
        VISH.Editor.Object.Snapshot.should.be.an.instanceof(Object);
    });

});
