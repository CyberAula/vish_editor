VISH.Configuration = (function(V,$,undefined){
  
  var configuration;
  
  var init = function(VEconfiguration){ 
    configuration = VEconfiguration;
    _applyConfiguration();
  };

  var _applyConfiguration = function(){
    
    /////////////////////
    // VE paths
    /////////////////////

    //Assets paths
    V.ImagesPath = configuration["ImagesPath"];
    V.StylesheetsPath = configuration["StylesheetsPath"];

    //CORE paths
    V.UploadPresentationPath = configuration["uploadPresentationPath"];
    V.PreviewPresentationPath = configuration["previewPresentationPath"];

    //Upload paths
    V.UploadImagePath = configuration["uploadImagePath"];
    V.UploadObjectPath = configuration["uploadObjectPath"];
    V.UploadPDF2PPath = configuration["uploadPDF2PPath"];
    V.UploadEPackagesPath = configuration["uploadEPackagesPath"];
    V.EnableFileImportation = (!(configuration["enableFileImportation"]===false));

    //Repository paths
    V.LREPath = V.Utils.checkUrlProtocol(configuration["LRE_path"]);
    V.ViSHInstances = [];
    if(configuration["ViSH_instances"] instanceof Array){
      for(var i=0; i<configuration["ViSH_instances"].length; i++){
        V.ViSHInstances.push(V.Utils.checkUrlProtocol(configuration["ViSH_instances"][i]));
      }
    }

    //Other services
    //Thumbnails
    V.ThumbnailsPath = configuration["thumbnailsPath"];
    //Tags
    V.TagsPath = configuration["tagsPath"];
    //TmpJSON
    V.UploadJSONPath = configuration["uploadJSONPath"];
    //Attachment
    V.UploadAttachmentPath = configuration["uploadAttachmentPath"];
    //Teacher notification
    V.NotifyTeacherPath = configuration["notifyTeacherPath"];
    V.StudentMode = configuration["userMode"]==="student";

    //Modify UI based on configuration

    ////////////////
    // Uploads
    ////////////////

    //Images
    if(typeof V.UploadImagePath == "undefined"){
      //Disable images
      $("#tab_pic_upload").css("display","none").addClass("disabled");
      $(".upload_image_help_content").css("display","none");
    }

    //Objects
    if(typeof V.UploadObjectPath == "undefined"){
      $("#tab_object_upload").css("display","none").addClass("disabled");
      $(".upload_objects_help_content").css("display","none");
    }

    //PDFs
    if((typeof V.UploadPDF2PPath == "undefined")||(typeof V.PreviewPresentationPath == "undefined")){
      $("#tab_pdfex").css("display","none").addClass("disabled");
      $("#menu a[action='insertPDFex']").hide().addClass("disabled_config");
    }

    //e-Learning packages
    if((typeof V.UploadEPackagesPath == "undefined")||(typeof V.PreviewPresentationPath == "undefined")){
      $("#tab_epackage").css("display","none").addClass("disabled");
      $("#menu a[action='insertPackage']").hide().addClass("disabled_config");
    }
    
    //Attachments
    if(typeof V.UploadAttachmentPath == "undefined"){
      $("#attachment_in_presentation_details").css("display","none").addClass("disabled");
    }

    
    ////////////////
    // Importations
    ////////////////

    //File importation
    if((V.EnableFileImportation === false)||(typeof V.PreviewPresentationPath == "undefined")){
      $("#tab_efile").css("display","none").addClass("disabled");
      $("#menu a[action='insertEFile']").hide().addClass("disabled_config");
    }


    ////////////////
    // Repositories
    ////////////////

    //ViSH
    if((configuration["ViSH"] !== true)||(typeof configuration["ViSH_instances"] != "object")||(configuration["ViSH_instances"].length < 1)){
      $("#tab_pic_repo").css("display","none").addClass("disabled");
      $("#tab_object_repo").css("display","none").addClass("disabled");
      $("#tab_video_repo").css("display","none").addClass("disabled");
      $("#tab_presentations_repo").css("display","none").addClass("disabled");
      $("#menu a[action='insertPresentation']").hide().addClass("disabled_config");
      $(".vish_help_content").css("display","none");
    }

    //Flickr
    if(configuration["Flickr"]!==true){
      $("#tab_pic_flickr").css("display","none").addClass("disabled");
      $(".flickr_help_content").css("display","none");
    }

    //XWiki
    if(configuration["XWiki"]!==true){
      $("#tab_pic_xwiki").css("display","none").addClass("disabled");
      $(".xwiki_help_content").css("display","none");
    }

    //YouTube
    if((configuration["Youtube"]!==true)||(typeof configuration["YoutubeAPIKEY"] != "string")){
      $("#tab_video_youtube").css("display","none").addClass("disabled");
      $(".youtube_help_content").css("display","none");
    }

    //SoundCloud
    if((configuration["SoundCloud"]!==true)||(typeof configuration["SoundCloudAPIKEY"] != "string")){
      $("#tab_audio_soundcloud").css("display","none").addClass("disabled");
      $(".soundcloud_help_content").css("display","none");
    }

    //LRE
    if((configuration["LRE"]!==true)||(typeof configuration["LRE_path"] != "string")){
      $("#tab_pic_lre").css("display","none").addClass("disabled");
      $("#tab_object_lre").css("display","none").addClass("disabled");
      $(".lre_help_content").css("display","none");
    }

    //Europeana
    if((configuration["Europeana"]!==true)||(typeof configuration["EuropeanaAPIKEY"] != "string")){
      $("#tab_pic_europeana").css("display","none").addClass("disabled");
      $(".europeana_help_content").css("display","none");
    }

    ////////////////
    // Other services
    ////////////////

    if(typeof V.PreviewPresentationPath == "undefined"){
      $("#toolbar_preview").hide().addClass("disabled");
      $("#menu a[action='preview']").hide().addClass("disabled_config");
      $("#menu a[action='insertPresentation']").hide().addClass("disabled_config");
    }

    if(typeof V.ThumbnailsPath == "undefined"){
      $("#tab_pic_thumbnails").css("display","none").addClass("disabled");
    }

    if(typeof V.UploadJSONPath == "undefined"){
      //Disable export
      $("#vemenu_export").hide().addClass("disabled_config");
      $("#advanced_tabs a[tab='rte-tab']").hide().addClass("disabled");
    }

    //Tags configuration
    //Default config
    var tagsSettings = {maxLength: 20, maxTags: 8, triggerKeys: ['enter', 'space', 'comma', 'tab']};

    if(typeof configuration.tagsSettings == "object"){
      if(!typeof configuration.tagsSettings.maxLength == "number"){
        configuration.tagsSettings.maxLength = tagsSettings.maxLength;
      }
      if(!typeof configuration.tagsSettings.maxTags == "number"){
        configuration.tagsSettings.maxTags = tagsSettings.maxTags;
      }
      if(!(configuration.tagsSettings.triggerKeys instanceof Array)){
        configuration.tagsSettings.triggerKeys = tagsSettings.triggerKeys;
      }
    } else {
      configuration.tagsSettings = tagsSettings;
    }

    if(typeof configuration["publishPermissions"] != "object"){
      configuration["publishPermissions"] = [];
    }
    
    if(configuration["publishPermissions"].indexOf("Comment") == -1){
      $("#allow_comment").parent("p").hide().addClass("disabled");
    }
    if(configuration["publishPermissions"].indexOf("Download") == -1){
      $("#allow_download").parent("p").hide().addClass("disabled");
    }
    if(configuration["publishPermissions"].indexOf("Clone") == -1){
      $("#allow_clone").parent("p").hide().addClass("disabled");
    }
    if($("#publication_content p").not(".disabled").length === 0){
      $("#advanced_tabs a[tab='publication-tab']").hide().addClass("disabled");
    }

    if((typeof configuration["catalog"] != "object")||(configuration["catalog"].length < 1)){
      $("#catalog_button").hide().addClass("disabled");
    }

    //Last actions

    //Hide unsefull li options on menu
    $("#menu li").each(function(index,li){
      if($(li).find("a[action]").not(".disabled_config").length < 1){
        $(li).hide().addClass("disabled_config");
      }
    });

  };
  
  var getConfiguration = function(){
    return configuration;
  };
  
  return {
      init                : init,
    getConfiguration    : getConfiguration
    };
  
}) (VISH, jQuery);
