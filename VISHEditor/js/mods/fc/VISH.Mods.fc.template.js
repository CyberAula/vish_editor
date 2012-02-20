VISH.Mods.fc.template = (function(V, $, undefined){

    //definition of the template sizes and the zones positions and sizes
    var TYPES = [
        {
            "x": 80,
            "y": 60,
            "width": 642,
            "height": 482,
            "closingButtonX": 672,
            "closingButtonY": 60,
            "closingButtonWidth": 50,
            "closingButtonHeight": 50,
            "image": "libimages/template1.png",
            "zones" : [
                {
                "x": 130,
                "y": 99,
                "width": 536,
                "height": 402,
                "textstyle": "italic 16px helvetica, arial, sans-serif",
                "textcolor": "blue",
                "textlinespacing": 40
                }
            ]            
        },
        {
            "x": 80,
            "y": 60,
            "width": 642,
            "height": 482,
            "closingButtonX": 672,
            "closingButtonY": 60,
            "closingButtonWidth": 50,
            "closingButtonHeight": 50,
            "image": "libimages/template1.png",
            "zones" : [
                {
                "x": 142,
                "y": 99,
                "width": 536,
                "height": 33,
                "textstyle": "bold 26px Arial",
                "textcolor": "black",
                "textlinespacing": 20
            },
            {
                "x": 132,
                "y": 175,
                "width": 536,
                "height": 331,
                "textstyle": "16px Arial",
                "textcolor": "black",
                "textlinespacing": 20
                }
            ]
        },
        {
            "x": 80,
            "y": 60,
            "width": 642,
            "height": 482,
            "closingButtonX": 672,
            "closingButtonY": 60,
            "closingButtonWidth": 50,
            "closingButtonHeight": 50,
            "image": "libimages/template1.png",
            "zones" : [
                {
                "x": 142,
                "y": 99,
                "width": 536,
                "height": 33,
                "textstyle": "bold 26px arial",
                "textcolor": "black",
                "textlinespacing": 20
                },
                {
                "x": 122,
                "y": 175,
                "width": 260,
                "height": 331,
                "textstyle": "italic 9px arial",
                "textcolor": "black",
                "textlinespacing": 20
                },
                {
                "x": 418,
                "y": 175,
                "width": 260,
                "height": 331,
                "textstyle": "12px aria",
                "textcolor": "black",
                "textlinespacing": 20
                }
            ]
        }
    ];
    
    var ctx = null;
    
    var init = function(context){
        ctx = context;
    };
    
    var draw = function(poi){
        var zone, template;
        var tmpImg, tmpWidth, tmpHeight, tmpVideo, lines, line;
        
        template = TYPES[poi.templateNumber];
        
        //first we draw the template image
        ctx.drawImage(V.Utils.loader.getImage(template.image), template.x, template.y, template.width, template.height);
        //now the closing icon
        ctx.drawImage(V.Utils.loader.getImage('libimages/closeicon.png'), template.closingButtonX, template.closingButtonY, 50, 50);
    
        //now the zones
        for(var i = 0; i < poi.zonesContent.length; i++) {            
            zone = poi.zonesContent[i];
            zoneTemplate = template.zones[i];
            
            switch(zone.type){
              case "text":
                ctx.fillStyle = 'rgba(122, 151, 438, .9)';
                ctx.fillRect(zoneTemplate.x, zoneTemplate.y, zoneTemplate.width, zoneTemplate.height);
                
                ctx.font = zoneTemplate.textstyle;
                ctx.fillStyle = zoneTemplate.textcolor;
                ctx.textBaseline = 'alphabetic';
                
                lines = V.Utils.text.getLines(ctx, zone.content, zoneTemplate.width - 20, ctx.font);
                for(line = 0; line < lines.length; line++) {
                  ctx.fillText(lines[line], zoneTemplate.x + 10, zoneTemplate.y + 25 + line*zoneTemplate.textlinespacing);
                }        
                V.Utils.canvas.drawRoundedCorners(ctx, zoneTemplate.x, zoneTemplate.y, zoneTemplate.width, zoneTemplate.height, "text");
                break;
              case "image":
                tmpImg = V.Utils.loader.getImage(zone.content);
                //lower aspect ratio, we use zone height to draw the image        
                V.Utils.canvas.drawImageWithAspectRatioAndRoundedCorners(ctx, tmpImg, zoneTemplate.x, zoneTemplate.y, zoneTemplate.width, zoneTemplate.height);  
                break;
              case "video":
                //TODO take this decission before this, not in every frame drawing
                tmpVideo = document.createElement('video');
                for(var i=0; i<zone.content.length;i++){
                    if (tmpVideo.canPlayType(zone.content[i].mimetype)) {
                      tmpVideo = V.Utils.loader.getVideo(zone.content[i].src);
                      break;
                    }
                }
                
                V.Utils.canvas.drawImageWithAspectRatioAndRoundedCorners(ctx, tmpVideo, zoneTemplate.x, zoneTemplate.y, zoneTemplate.width, zoneTemplate.height);
                
                if(tmpVideo.paused && !tmpVideo.ended){
                  ctx.drawImage(V.Utils.loader.getImage('libimages/play.png'), (zoneTemplate.x + zoneTemplate.width/2) - 128/2, (zoneTemplate.y + zoneTemplate.height/2) - 128/2, 128, 128 );
                }
                else if(tmpVideo.ended) {
                  ctx.drawImage(V.Utils.loader.getImage('libimages/play.png'), (zoneTemplate.x + zoneTemplate.width/2) - 128/2, (zoneTemplate.y + zoneTemplate.height/2) - 128/2, 128, 128 );
                }
                else{
                  canvasState.valid = false; //playing video, so draw again in next interval
                }
                break;
            }  
        }
    };
    
    return {
        init    : init,
        draw    : draw
    };

})(VISH, jQuery);