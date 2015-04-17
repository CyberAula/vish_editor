var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.Utils", function(){
    
//// OBJECT CREATION

    it('should create a VISH.Utils object', function(){
        VISH.Utils.should.be.an.instanceof(Object);
    });

//// EXPORTED METHODS

    it('should export dimentionsToDraw function', function(){
        VISH.Utils.should.have.property('dimentionsToDraw');
    });

    it('should export getOptions function', function(){
        VISH.Utils.should.have.property('getOptions');
    });

    it('should export registerId function', function(){
        VISH.Utils.should.have.property('registerId');
    });

    it('should export fixPresentation function', function(){
        VISH.Utils.should.have.property('fixPresentation');
    });

    it('should export sendParentToURL function', function(){
        VISH.Utils.should.have.property('sendParentToURL');
    });

    it('should export removeParamFromUrl function', function(){
        VISH.Utils.should.have.property('removeParamFromUrl');
    });

    it('should export addParamToUrl function', function(){
        VISH.Utils.should.have.property('addParamToUrl');
    });

    it('should export getParamsFromUrl function', function(){
        VISH.Utils.should.have.property('getParamsFromUrl');
    });

    it('should export getSrcFromCSS function', function(){
        VISH.Utils.should.have.property('getSrcFromCSS');
    });

    it('should export getZoomInStyle function', function(){
        VISH.Utils.should.have.property('getZoomInStyle');
    });

    it('should export getWidthFromStyle function', function(){
        VISH.Utils.should.have.property('getWidthFromStyle');
    });

    it('should export getHeightFromStyle function', function(){
        VISH.Utils.should.have.property('getHeightFromStyle');
    });

    it('should export isObseleteVersion function', function(){
        VISH.Utils.should.have.property('isObseleteVersion');
    });

    it('should export getSlideNumberFromHash function', function(){
        VISH.Utils.should.have.property('getSlideNumberFromHash');
    });

    it('should export updateHash function', function(){
        VISH.Utils.should.have.property('updateHash');
    });

    it('should export cleanHash function', function(){
        VISH.Utils.should.have.property('cleanHash');
    });

    it('should export removeHashFromUrlString function', function(){
        VISH.Utils.should.have.property('removeHashFromUrlString');
    });

    it('should export getHashParams function', function(){
        VISH.Utils.should.have.property('getHashParams');
    });

    it('should export checkAnimationsFinish function', function(){
        VISH.Utils.should.have.property('checkAnimationsFinish');
    });

    it('should export fomatTimeForMPlayer function', function(){
        VISH.Utils.should.have.property('fomatTimeForMPlayer');
    });

    it('should export delayFunction function', function(){
        VISH.Utils.should.have.property('delayFunction');
    });

    it('should export shuffle function', function(){
        VISH.Utils.should.have.property('shuffle');
    });

    it('should export purgeString function', function(){
        VISH.Utils.should.have.property('purgeString');
    });

    it('should export getLevenshteinDistance function', function(){
        VISH.Utils.should.have.property('getLevenshteinDistance');
    });

//// METHOD RETURNS

    describe("#dimentionsToDraw", function(){
       it('should return internal object', function(){
           VISH.Utils.dimentionsToDraw(1,1,1,1).should.eql({ width: 1, height: 1 });
       })
    });

    describe("#removeParamFromUrl", function(){
       it('should return internal object', function(){
           VISH.Utils.removeParamFromUrl("url?paramName=paramValue", "paramName").should.eql("url");
       })
    });

    describe("#addParamToUrl", function(){
       it('should return internal object', function(){
           VISH.Utils.addParamToUrl("url", "paramName", "paramValue").should.eql("url?paramName=paramValue");
       })
    });

    describe("#getParamsFromUrl", function(){
       it('should return internal object', function(){
           VISH.Utils.getParamsFromUrl("url?paramName=paramValue").should.eql({ paramName: 'paramValue' });
       })
    });

    describe("#getSrcFromCSS", function(){
       it('should return internal object', function(){
           VISH.Utils.getSrcFromCSS("css").should.eql("css");
       })
    });

    describe("#getZoomInStyle", function(){
       it('should return internal object', function(){
           VISH.Utils.getZoomInStyle("zoom").should.eql("-ms-transform: scale(zoom); -ms-transform-origin: 0 0; -moz-transform: scale(zoom); -moz-transform-origin: 0 0; -o-transform: scale(zoom); -o-transform-origin: 0 0; -webkit-transform: scale(zoom); -webkit-transform-origin: 0 0; ");
       })
    });

    describe("#isObseleteVersion", function(){
       it('should return internal object', function(){
           VISH.Utils.isObseleteVersion("version").should.eql(false);
       })
    });

    describe("#removeHashFromUrlString", function(){
       it('should return internal object', function(){
           VISH.Utils.removeHashFromUrlString("url#").should.eql("url");
       })
    });

    describe("#fomatTimeForMPlayer", function(){
       it('should return internal object', function(){
           VISH.Utils.fomatTimeForMPlayer(10, 100).should.eql("0:00:10");
       })
    });

    describe("#delayFunction", function(){
       it('should return internal object', function(){
           VISH.Utils.delayFunction("functionId", "callbackFunction", "PERIOD").should.eql(false);
       })
    });

    describe("#shuffle", function(){
       it('should return internal object', function(){
           VISH.Utils.shuffle("o").should.eql("o");
       })
    });

    describe("#purgeString", function(){
       it('should return internal object', function(){
           VISH.Utils.purgeString("str").should.eql("str");
       })
    });

    describe("#getLevenshteinDistance", function(){
       it('should return internal object', function(){
           VISH.Utils.getLevenshteinDistance("a", "b").should.eql(1);
       })
    });

});
