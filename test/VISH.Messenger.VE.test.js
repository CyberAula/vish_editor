var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.Messenger.VE", function(){
    
//// OBJECT CREATION

    it('should create a VISH.Messenger.VE object', function(){
        VISH.Messenger.VE.should.be.an.instanceof(Object);
    });

//// EXPORTED METHODS

    it('should export createMessage function', function(){
        VISH.Messenger.VE.should.have.property('createMessage');
    });

    it('should export processVEMessage function', function(){
        VISH.Messenger.VE.should.have.property('processVEMessage');
    });

//// METHOD RETURNS

    describe("#createMessage", function(){
       it('should return external object', function(){
           VISH.Messenger.VE.createMessage("VEevent", "params", "origin", "destination").should.eql('{\"vishEditor\":true,\"VEevent\":\"VEevent\",\"params\":\"params\",\"origin\":\"origin\",\"destination\":\"destination\"}');
       })
    });

});
