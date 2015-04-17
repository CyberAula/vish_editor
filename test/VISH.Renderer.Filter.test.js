var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.Renderer.Filter", function(){
    
//// OBJECT CREATION

    it('should create a VISH.Renderer.Filter object', function(){
        VISH.Renderer.Filter.should.be.an.instanceof(Object);
    });

//// EXPORTED METHODS

    it('should export init function', function(){
        VISH.Renderer.Filter.should.have.property('init');
    });

    it('should export allowElement function', function(){
        VISH.Renderer.Filter.should.have.property('allowElement');
    });

    it('should export renderContentFiltered function', function(){
        VISH.Renderer.Filter.should.have.property('renderContentFiltered');
    });

//// METHOD RETURNS

    describe("#renderContentFiltered", function(){
       it('should return unknown', function(){
           VISH.Renderer.Filter.renderContentFiltered("element", "template").should.eql("<div id='undefined' class='contentfiltered template_undefined'><img class='template_image' src='undefinedadverts/advert_new_grey.png'/></div>");
       })
    });

});
