var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.Messenger.VE", function(){
    
    //// OBJECT CREATION

    it('should create a VISH.Messenger.VE object', function(){
        VISH.Messenger.VE.should.be.an.instanceof(Object);
    });

    //// EXPORTED METHODS

    it('should export createVEMessage function', function(){
        VISH.Messenger.VE.should.have.property('createVEMessage');
    });

    it('should export processVEMessage function', function(){
        VISH.Messenger.VE.should.have.property('processVEMessage');
    });

    //// METHOD RETURNS

    describe("#createVEMessage", function(){
       it('should return external object', function(){
           VISH.Messenger.VE.createVEMessage("VEevent", "params", "destination", "destinationId").should.eql('{\"IframeMessage\":true,\"mode\":\"EXTERNAL\",\"type\":\"VE\",\"data\":{\"VEevent\":\"VEevent\",\"params\":\"params\"},\"origin\":\"?\",\"originId\":\"?\",\"destination\":\"destination\",\"destinationId\":\"destinationId\"}');
       })
    });

});
