var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.Messenger", function(){
    
//// OBJECT CREATION

    it('should create a VISH.Messenger object', function(){
        VISH.Messenger.should.be.an.instanceof(Object);
    });

//// EXPORTED METHODS

    it('should export init function', function(){
        VISH.Messenger.should.have.property('init');
    });

    it('should export notifyEventByMessage function', function(){
        VISH.Messenger.should.have.property('notifyEventByMessage');
    });

});
