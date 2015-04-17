var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.Messenger.Helper", function(){
    
//// OBJECT CREATION

    it('should create a VISH.Messenger.Helper object', function(){
        VISH.Messenger.Helper.should.be.an.instanceof(Object);
    });

//// EXPORTED METHODS

    it('should export createMessage function', function(){
        VISH.Messenger.Helper.should.have.property('createMessage');
    });

    it('should export processVEMessage function', function(){
        VISH.Messenger.Helper.should.have.property('processVEMessage');
    });

//// METHOD RETURNS

    describe("#createMessage", function(){
       it('should return external object', function(){
           VISH.Messenger.Helper.createMessage("VEevent", "params", "origin", "destination").should.eql('{\"vishEditor\":true,\"VEevent\":\"VEevent\",\"params\":\"params\",\"origin\":\"origin\",\"destination\":\"destination\"}');
       })
    });

});
