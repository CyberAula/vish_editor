var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.Editor.Tools.Menu", function(){
    
//// OBJECT CREATION

    it('should create a VISH.Editor.Tools.Menu object', function(){
        VISH.Editor.Tools.Menu.should.be.an.instanceof(Object);
    });

//// EXPORTED METHODS

    it('should export onSaveButtonClicked function', function(){
        VISH.Editor.Tools.Menu.should.have.property('onSaveButtonClicked');
    });

    it('should export preview function', function(){
        VISH.Editor.Tools.Menu.should.have.property('preview');
    });

    it('should export about function', function(){
        VISH.Editor.Tools.Menu.should.have.property('about');
    });

    it('should export exportToJSON function', function(){
        VISH.Editor.Tools.Menu.should.have.property('exportToJSON');
    });

    it('should export exportToSCORM function', function(){
        VISH.Editor.Tools.Menu.should.have.property('exportToSCORM');
    });

    it('should export displaySettings function', function(){
        VISH.Editor.Tools.Menu.should.have.property('displaySettings');
    });

});
