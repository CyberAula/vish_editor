var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.Editor.Utils", function(){
    
//// OBJECT CREATION

    it('should create a VISH.Editor.Utils object', function(){
        VISH.Editor.Utils.should.be.an.instanceof(Object);
    });

//// EXPORTED METHODS

    it('should export getStylesInPercentages function', function(){
        VISH.Editor.Utils.should.have.property('getStylesInPercentages');
    });

    it('should export generateTable function', function(){
        VISH.Editor.Utils.should.have.property('generateTable');
    });

    it('should export autocompleteUrls function', function(){
        VISH.Editor.Utils.should.have.property('autocompleteUrls');
    });

    it('should export filterFilePath function', function(){
        VISH.Editor.Utils.should.have.property('filterFilePath');
    });

    it('should export replaceIdsForSlideJSON function', function(){
        VISH.Editor.Utils.should.have.property('replaceIdsForSlideJSON');
    });

//// METHOD RETURNS

    describe("#generateTable", function(){
       it('should return unknown', function(){
           VISH.Editor.Utils.generateTable("options").should.eql("<table class=\"metadata\"><tr class=\"even\"><td class=\"title header_left\">null</td><td class=\"title header_right\"><div class=\"height_wrapper\">Unknown</div></td></tr><tr class=\"odd\"><td class=\"title\">null</td><td class=\"info\"><div class=\"height_wrapper\"></div></td></tr><tr class=\"even\"><td colspan=\"2\" class=\"title_description\">null</td></tr><tr class=\"odd\"><td colspan=\"2\" class=\"info_description\"><div class=\"height_wrapper_description\"></div></td></tr></table>");
       })
    });

    describe("#filterFilePath", function(){
       it('should return external object', function(){
           VISH.Editor.Utils.filterFilePath("path").should.eql("path");
       })
    });

});
