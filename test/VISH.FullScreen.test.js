var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.FullScreen", function(){
    
//// OBJECT CREATION

    it('should create a VISH.FullScreen object', function(){
        VISH.FullScreen.should.be.an.instanceof(Object);
    });

//// EXPORTED METHODS

    it('should export init function', function(){
        VISH.FullScreen.should.have.property('init');
    });

    it('should export canFullScreen function', function(){
        VISH.FullScreen.should.have.property('canFullScreen');
    });

    it('should export isFullScreen function', function(){
        VISH.FullScreen.should.have.property('isFullScreen');
    });

    it('should export enableFullScreen function', function(){
        VISH.FullScreen.should.have.property('enableFullScreen');
    });

    it('should export exitFromNativeFullScreen function', function(){
        VISH.FullScreen.should.have.property('exitFromNativeFullScreen');
    });

    it('should export isOtherElementInFullScreen function', function(){
        VISH.FullScreen.should.have.property('isOtherElementInFullScreen');
    });

    it('should export getFSParams function', function(){
        VISH.FullScreen.should.have.property('getFSParams');
    });

    it('should export isFullScreenSupported function', function(){
        VISH.FullScreen.should.have.property('isFullScreenSupported');
    });

//// METHOD RETURNS

    describe("#getFSParams", function(){
       it('should return unknown', function(){
           VISH.FullScreen.getFSParams().should.eql({
               "currentFSElement": undefined,
               "lastFSElement": undefined,
               "lastFSTimestamp": undefined
           });
       })
    });

});
