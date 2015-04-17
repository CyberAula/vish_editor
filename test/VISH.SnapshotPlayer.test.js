var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.SnapshotPlayer", function(){
    
//// OBJECT CREATION

    it('should create a VISH.SnapshotPlayer object', function(){
        VISH.SnapshotPlayer.should.be.an.instanceof(Object);
    });

});
