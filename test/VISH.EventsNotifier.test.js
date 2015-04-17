var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.EventsNotifier", function(){
    
//// OBJECT CREATION

    it('should create a VISH.EventsNotifier object', function(){
        VISH.EventsNotifier.should.be.an.instanceof(Object);
    });

//// EXPORTED METHODS

    it('should export init function', function(){
        VISH.EventsNotifier.should.have.property('init');
    });

    it('should export registerCallback function', function(){
        VISH.EventsNotifier.should.have.property('registerCallback');
    });

    it('should export unRegisterCallback function', function(){
        VISH.EventsNotifier.should.have.property('unRegisterCallback');
    });

    it('should export notifyEvent function', function(){
        VISH.EventsNotifier.should.have.property('notifyEvent');
    });

});
