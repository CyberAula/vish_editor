var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.Editor.Video.Repository", function(){
    
//// OBJECT CREATION

    it('should create a VISH.Editor.Video.Repository object', function(){
        VISH.Editor.Video.Repository.should.be.an.instanceof(Object);
    });

//// EXPORTED METHODS

    it('should export beforeLoadTab function', function(){
        VISH.Editor.Video.Repository.should.have.property('beforeLoadTab');
    });

    it('should export onLoadTab function', function(){
        VISH.Editor.Video.Repository.should.have.property('onLoadTab');
    });

    it('should export addSelectedVideo function', function(){
        VISH.Editor.Video.Repository.should.have.property('addSelectedVideo');
    });

});
