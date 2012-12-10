/*
Copyright (c) 2003-2012, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

CKEDITOR.editorConfig = function( config )
{
	// Define changes to default configuration here. For example:
	// config.language = 'fr';
	// config.uiColor = '#AADC6E';
};

 // Set defaults for tables
  CKEDITOR.on( 'dialogDefinition', function( ev )
  {
     // Take the dialog name and its definition from the event
     // data.
     var dialogName = ev.data.name;
     var dialogDefinition = ev.data.definition;

     // Check if the definition is from the dialog we're
     // interested on (the "Table" dialog).
     if ( dialogName == 'table' )
     {
         // Get a reference to the "Table Info" tab.
         var infoTab = dialogDefinition.getContents( 'info' );
         txtWidth = infoTab.get( 'txtWidth' );
         txtWidth['default'] = 80;
         cmbWidthType = infoTab.get( 'cmbWidthType' );
         cmbWidthType['default'] = 'percents';
         txtCellPad = infoTab.get( 'txtCellPad' );
         txtCellPad['default'] = 4;
     }
   });