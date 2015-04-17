var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.SlidesSelector", function(){
    
//// OBJECT CREATION

    it('should create a VISH.SlidesSelector object', function(){
        VISH.SlidesSelector.should.be.an.instanceof(Object);
    });

});
