VISH.AppletPlayer = function() {
  var loadApplet = function(element) {
    $.each(element.children(".appletelement"), function(index, value) {
      var toAppend = "<applet code='" + $(value).attr("code") + "' width='" + $(value).attr("width") + "' height='" + $(value).attr("height") + "' archive='" + $(value).attr("archive") + "'>" + $(value).attr("params") + "</applet>";
      $(value).append(toAppend)
    })
  };
  var unloadApplet = function(element) {
    $(".appletelement applet").remove()
  };
  return{loadApplet:loadApplet, unloadApplet:unloadApplet}
}(VISH, jQuery);
VISH.Dummies = function(VISH, undefined) {
  var dummies = ["<article template='t1'><div areaid='header' class='t1_header editable'></div><div areaid='left' class='t1_left editable'></div><div areaid='right' class='t1_right editable'></div></article>", "<article template='t2'><div areaid='header' class='t2_header editable'></div><div areaid='left' class='t2_left editable'></div></article>"];
  var getDummy = function(template) {
    return dummies[parseInt(template, 10) - 1]
  };
  return{getDummy:getDummy}
}(VISH);
VISH.Editor = function(V, $, undefined) {
  var params = {current_el:null};
  var MENUBAR = "<div id='menubar'>\t<div class='barbutton' id='add'>\t</div>\t<div class='barbutton' id='quiz'>\t</div>\t<div class='barbutton' id='save'>\t</div>\t</div>";
  var TEMPLATES = "<div id='thumbcontent'><div class='templatethumb' template='1'><img src='images/templatesthumbs/t1.png' /></div><div class='templatethumb' template='2'><img src='images/templatesthumbs/t2.png' /></div></div>";
  var EDITORS = "<div class='menu'><div id='textthumb' class='menuicon'><img src='images/text-editor.png' /></div><div id='picthumb' class='menuicon'><img src='images/picture-editor.png' /></div></div>";
  var MESSAGE = "This functionality has not been implemented yet, we are working on it";
  var nextImageId = 0;
  var init = function() {
    _loadCSS("stylesheets/editor.css");
    $("body").append(MENUBAR);
    $(document).on("click", ".templatethumb", _onTemplateThumbClicked);
    $(document).on("click", "#add", _onAddButtonClicked);
    $(document).on("click", "#quiz", _onQuizButtonClicked);
    $(document).on("click", "#save", _onSaveButtonClicked);
    $(document).on("click", ".editable", _onEditableClicked);
    $(document).on("click", "#textthumb", _launchTextEditor);
    $(document).on("click", "#picthumb", _launchPicEditor);
    $.getScript("./js/slides.js", function() {
      var evt = document.createEvent("Event");
      evt.initEvent("OURDOMContentLoaded", false, true);
      document.dispatchEvent(evt)
    })
  };
  var _onAddButtonClicked = function() {
    smoke.alert(TEMPLATES)
  };
  var _onQuizButtonClicked = function() {
    smoke.alert(MESSAGE)
  };
  var _onSaveButtonClicked = function() {
    var excursion = [];
    var slide = {};
    $("article").each(function(index, s) {
      slide.id = "";
      slide.template = $(s).attr("template");
      slide.elements = [];
      var element = {};
      $(s).find("div").each(function(i, div) {
        if($(div).attr("areaid") !== undefined) {
          element.type = $(div).attr("type");
          element.areaid = $(div).attr("areaid");
          if(element.type === "text") {
            element.body = $(div).html()
          }else {
            if(element.type === "image") {
              element.body = $(div).find("img").attr("src");
              element.style = $(div).find("img").attr("style")
            }
          }
          slide.elements.push(element);
          element = {}
        }
      });
      excursion.push(slide);
      slide = {}
    });
    var jsonexcursion = JSON.stringify(excursion);
    console.log(jsonexcursion);
    $("article").remove();
    $("#menubar").remove();
    V.SlideManager.init(excursion)
  };
  var _loadCSS = function(path) {
    $("head").append("<link>");
    css = $("head").children(":last");
    css.attr({rel:"stylesheet", type:"text/css", href:path})
  };
  var _onTemplateThumbClicked = function(event) {
    $(".slides").append(V.Dummies.getDummy($(this).attr("template")));
    _clearSmoke();
    var evt = document.createEvent("Event");
    evt.initEvent("OURDOMContentLoaded", false, true);
    document.dispatchEvent(evt)
  };
  var _onEditableClicked = function(event) {
    params["current_el"] = $(this);
    smoke.alert(EDITORS, function(e) {
    })
  };
  var _launchTextEditor = function(event) {
    _clearSmoke();
    smoke.prompt("Write your text", function(e) {
      if(e) {
        params["current_el"].attr("type", "text");
        params["current_el"].html(e)
      }
    })
  };
  var _launchPicEditor = function(event) {
    _clearSmoke();
    var template = params["current_el"].parent().attr("template");
    smoke.prompt("Paste image url", function(e) {
      if(e) {
        var idToDragAndResize = "draggable" + nextImageId;
        params["current_el"].attr("type", "image");
        params["current_el"].html("<img class='" + template + "_image' id='" + idToDragAndResize + "' title='Click to drag' src='" + e + "' />");
        if(params["current_el"].next().attr("class") === "theslider") {
          params["current_el"].next().remove()
        }
        params["current_el"].after("<div id='sliderId" + nextImageId + "' class='theslider'><input id='imageSlider" + nextImageId + "' type='slider' name='size' value='1' style='display: none; '></div>");
        var divPos = params["current_el"].position();
        var divHeight = params["current_el"].height();
        $("#sliderId" + nextImageId).css("top", divPos.top + divHeight - 20);
        $("#sliderId" + nextImageId).css("left", divPos.left);
        $("#sliderId" + nextImageId).css("margin-left", "12px");
        $("#imageSlider" + nextImageId).slider({from:1, to:8, step:0.5, round:1, dimension:"x", skin:"blue", onstatechange:function(value) {
          $("#" + idToDragAndResize).width(325 * value)
        }});
        $("#" + idToDragAndResize).draggable({cursor:"move"});
        nextImageId += 1
      }
    })
  };
  var _clearSmoke = function() {
    $(".smoke, .smoke-base, .smokebg").remove()
  };
  return{init:init}
}(VISH, jQuery);
VISH.Excursion = function(V, undefined) {
  var mySlides = null;
  var init = function(slides) {
    mySlides = slides;
    V.Renderer.init();
    for(var i = 0;i < slides.length;i++) {
      V.Renderer.renderSlide(slides[i])
    }
    _finishRenderer()
  };
  var _finishRenderer = function() {
    for(var i = 0;i < mySlides.length;i++) {
      for(var num = 0;num < mySlides[i].elements.length;num++) {
        if(mySlides[i].elements[num].type === "flashcard") {
          var flashcard = JSON.parse(mySlides[i].elements[num].jsoncontent);
          V.Mods.fc.loader.init(flashcard)
        }
      }
    }
    $.getScript("./js/slides.js", function() {
      var evt = document.createEvent("Event");
      evt.initEvent("OURDOMContentLoaded", false, true);
      document.dispatchEvent(evt)
    })
  };
  return{init:init}
}(VISH);
VISH.Renderer = function(V, $, undefined) {
  var SLIDE_CONTAINER = null;
  var init = function() {
    SLIDE_CONTAINER = $(".slides")
  };
  var renderSlide = function(slide) {
    var content = "";
    var classes = "";
    for(el in slide.elements) {
      if(slide.elements[el].type === "text") {
        content += _renderText(slide.elements[el], slide.template)
      }else {
        if(slide.elements[el].type === "image") {
          content += _renderImage(slide.elements[el], slide.template)
        }else {
          if(slide.elements[el].type === "swf") {
            content += _renderSwf(slide.elements[el], slide.template);
            classes += "swf "
          }else {
            if(slide.elements[el].type === "applet") {
              content += _renderApplet(slide.elements[el], slide.template);
              classes += "applet "
            }else {
              if(slide.elements[el].type === "flashcard") {
                content = _renderFlashcard(slide.elements[el], slide.template);
                classes += "flashcard"
              }else {
                if(slide.elements[el].type === "openquestion") {
                  content = _renderOpenquestion(slide.elements[el], slide.template)
                }else {
                  if(slide.elements[el].type === "mcquestion") {
                    content = _renderMcquestion(slide.elements[el], slide.template)
                  }
                }
              }
            }
          }
        }
      }
    }
    SLIDE_CONTAINER.append("<article class='" + classes + "' id='" + slide.id + "'>" + content + "</article>")
  };
  var _renderText = function(element, template) {
    return"<div class='" + template + "_" + element["areaid"] + " " + template + "_text" + "'>" + element["body"] + "</div>"
  };
  var _renderImage = function(element, template) {
    return"<div class='" + template + "_" + element["areaid"] + "'><img class='" + template + "_image' src='" + element["body"] + "' style='" + element["style"] + "' /></div>"
  };
  var _renderSwf = function(element, template) {
    return"<div class='swfelement " + template + "_" + element["areaid"] + "' templateclass='" + template + "_swf" + "' src='" + element["body"] + "'></div>"
  };
  var _renderApplet = function(element, template) {
    return"<div class='appletelement " + template + "_" + element["areaid"] + "' code='" + element["code"] + "' width='" + element["width"] + "' height='" + element["height"] + "' archive='" + element["archive"] + "' params='" + element["params"] + "' ></div>"
  };
  var _renderFlashcard = function(element, template) {
    return"<div class='template_flashcard'><canvas id='" + element["canvasid"] + "'>Your browser does not support canvas</canvas></div>"
  };
  var _renderOpenquestion = function(element, template) {
    var ret = "<div class='question_title'>" + element["body"] + "</div>";
    ret += "<form action='" + element["posturl"] + "' method='post'>";
    ret += "<label class='question_name'>Name: </label>";
    ret += "<input id='pupil_name' class='question_name_input'></input>";
    ret += "<label class='question_answer'>Answer: </label>";
    ret += "<textarea class='question_answer_input'></textarea>";
    ret += "<button type='button' class='question_button'>Send</button>";
    return ret
  };
  var _renderMcquestion = function(element, template) {
    var ret = "<div class='question_title'>" + element["body"] + "</div>";
    ret += "<form action='" + element["posturl"] + "' method='post'>";
    ret += "<label class='question_name'>Name: </label>";
    ret += "<input id='pupil_name' class='question_name_input'></input>";
    for(var i = 0;i < element["options"].length;i++) {
      ret += "<label class='mc_answer'><input type='radio' name='mc_radio' value='0'>" + element["options"][i] + "</label>"
    }
    ret += "<button type='button' class='question_button'>Send</button>";
    return ret
  };
  return{init:init, renderSlide:renderSlide}
}(VISH, jQuery);
VISH.SWFPlayer = function() {
  var loadSWF = function(element) {
    $.each(element.children(".swfelement"), function(index, value) {
      $(value).append("<embed src='" + $(value).attr("src") + "' class='" + $(value).attr("templateclass") + "' />")
    })
  };
  var unloadSWF = function(element) {
    $(".swfelement embed").remove()
  };
  return{loadSWF:loadSWF, unloadSWF:unloadSWF}
}(VISH, jQuery);
VISH.Samples = function(V, undefined) {
  var samples = [{"id":"vish1", "template":"t1", "elements":[{"type":"text", "areaid":"header", "body":"Ejemplo de flora"}, {"type":"text", "areaid":"left", "body":"<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas orci nisl, euismod a posuere ac, commodo quis ipsum. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec sollicitudin risus laoreet velit dapibus bibendum. Nullam cursus sollicitudin hendrerit. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nunc ullamcorper tempor bibendum. Morbi gravida pretium leo, vitae scelerisque quam mattis eu. Sed hendrerit molestie magna, sit amet porttitor nulla facilisis in. Donec vel massa mauris, sit amet condimentum lacus.</p>"}, 
  {"type":"image", "areaid":"right", "body":"http://www.asturtalla.com/arbol.jpg"}]}, {"id":"vish2", "template":"t2", "elements":[{"type":"text", "areaid":"header", "body":"Ejemplo de fauna..."}, {"type":"image", "areaid":"center", "body":"http://www.absoluthuelva.com/wp-content/uploads/2009/03/donana.jpg"}]}, {"id":"vish3", "template":"t1", "elements":[{"type":"text", "areaid":"header", "body":"Sensores"}, {"type":"text", "areaid":"left", "body":"<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas orci nisl, euismod a posuere ac, commodo quis ipsum. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec sollicitudin risus laoreet velit dapibus bibendum. Nullam cursus sollicitudin hendrerit. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nunc ullamcorper tempor bibendum. Morbi gravida pretium leo, vitae scelerisque quam mattis eu. Sed hendrerit molestie magna, sit amet porttitor nulla facilisis in. Donec vel massa mauris, sit amet condimentum lacus.</p>"}, 
  {"type":"image", "areaid":"right", "body":"http://www.satec.es/es-ES/NuestraActividad/CasosdeExito/PublishingImages/IMG%20Do%C3%B1ana/do%C3%B1ana_fig2.png"}]}, {"id":"vish4", "template":"t2", "elements":[{"type":"text", "areaid":"header", "body":"Puesta de sol..."}, {"type":"image", "areaid":"left", "body":"http://www.viajes.okviajar.es/wp-content/uploads/2010/11/parque-donana.jpg"}]}, {"id":"vish5", "template":"t2", "elements":[{"type":"text", "areaid":"header", "body":"Experimento virtual1"}, 
  {"type":"swf", "areaid":"left", "body":"swf/virtualexperiment_1.swf"}]}, {"id":"vish8", "template":"t2", "elements":[{"type":"flashcard", "areaid":"center", "canvasid":"myCanvas", "jsoncontent":'{"name": "myFirstFlashcard","description": "flashcard explanation","type": "flashcard","backgroundSrc": "media/images/background.jpg","pois": [{"id": 1,"x": 200,"y": 325,"templateNumber": 0,"zonesContent": [{"type": "text","content": "El tantalio o t\ufffdntalo es un elemento qu\ufffdmico de n\ufffdmero at\ufffdmico 73, que se sit\ufffda en el grupo 5 de la tabla peri\ufffddica de los elementos. Su s\ufffdmbolo es Ta. Se trata de un metal de transici\ufffdn raro, azul gris\ufffdceo, duro, que presenta brillo met\ufffdlico y resiste muy bien la corrosi\ufffdn. Se encuentra en el mineral tantalita. Es fisiol\ufffdgicamente inerte, por lo que, entre sus variadas aplicaciones, se puede emplear para la fabricaci\ufffdn de instrumentos quir\ufffdrgicos y en implantes. En ocasiones se le llama t\ufffdntalo, pero el \ufffdnico nombre reconocido por la Real Academia Espa\ufffdola es tantalio."}]},{"id": 2,"x": 458,"y": 285,"templateNumber": 1,"zonesContent": [{"type": "text","content": "Image shows silver rock"},{"type": "image","content": "media/images/3.jpg"}]},{"id": 3,"x": 658,"y": 285,"templateNumber": 0,"zonesContent": [{"type": "video","content": [{"mimetype": "video/webm","src": "media/videos/video1.webm"},{"mimetype": "video/mp4","src": "http://video-js.zencoder.com/oceans-clip.mp4"}]}]},{"id": 4,"x": 458,"y": 457,"templateNumber": 2,"zonesContent": [{"type": "text","content": "Image shows silver rock"},{"type": "empty","content": ""},{"type": "text","content": "El tantalio o t\ufffdntalo es un elemento qu\ufffdmico de n\ufffdmero at\ufffdmico 73, que se sit\ufffda en el grupo 5 de la tabla peri\ufffddica de los elementos. Su s\ufffdmbolo es Ta. Se trata de un metal de transici\ufffdn raro, azul gris\ufffdceo, duro, que presenta brillo met\ufffdlico y resiste muy bien la corrosi\ufffdn. Se encuentra en el mineral tantalita. Es fisiol\ufffdgicamente inerte, por lo que, entre sus variadas aplicaciones, se puede emplear para la fabricaci\ufffdn de instrumentos quir\ufffdrgicos y en implantes. En ocasiones se le llama t\ufffdntalo, pero el \ufffdnico nombre reconocido por la Real Academia Espa\ufffdola es tantalio."}]}]}', 
  "js":"js/mods/fc/VISH.Mods.fc.js"}]}, {"id":"vish9", "template":"t2", "elements":[{"type":"flashcard", "areaid":"center", "canvasid":"myCanvas2", "jsoncontent":'{"name": "myFirstFlashcard","description": "flashcard explanation","type": "flashcard","backgroundSrc": "media/images/background2.png","pois": [{"id": 1,"x": 200,"y": 325,"templateNumber": 0,"zonesContent": [{"type": "text","content": "texto texto texto"}]},{"id": 2,"x": 458,"y": 285,"templateNumber": 1,"zonesContent": [{"type": "text","content": "Image shows silver rock"},{"type": "image","content": "media/images/plata.jpg"}]},{"id": 3,"x": 658,"y": 285,"templateNumber": 0,"zonesContent": [{"type": "video","content": [{"mimetype": "video/webm","src": "media/videos/video1.webm"},{"mimetype": "video/mp4","src": "http://video-js.zencoder.com/oceans-clip.mp4"}]}]},{"id": 4,"x": 458,"y": 457,"templateNumber": 2,"zonesContent": [{"type": "text","content": "Image shows silver rock"},{"type": "empty","content": ""},{"type": "text","content": "texto 2 texto 2."}]}]}', 
  "js":"js/mods/fc/VISH.Mods.fc.js"}]}, {"id":"vish10", "template":"t2", "elements":[{"type":"openquestion", "areaid":"header", "body":"Do you like this slide?", "posturl":"http://localhost/quiz/adfklkdf"}]}, {"id":"vish11", "template":"t2", "elements":[{"type":"mcquestion", "areaid":"header", "body":"Do you like this slide?", "posturl":"http://localhost/quiz/adfklkdf", "options":["yes", "no", "maybe"], "rightanswer":0}]}];
  return{samples:samples}
}(VISH);
VISH.SlideManager = function(V, $, undefined) {
  var mySlides = null;
  var slideStatus = {};
  var init = function(slides) {
    mySlides = slides;
    V.Excursion.init(slides);
    $("article").on("slideenter", _onslideenter);
    $("article").on("slideleave", _onslideleave)
  };
  var getStatus = function(slideid) {
    if(!slideStatus[slideid]) {
      slideStatus[slideid] = {id:slideid, poiFrameNumber:0, drawingPoi:0}
    }
    return slideStatus[slideid]
  };
  var updateStatus = function(slideid, newStatus) {
    slideStatus[slideid] = newStatus
  };
  var _onslideenter = function(e) {
    var fcElem, slideId;
    -setTimeout(function() {
      if($(e.target).hasClass("swf")) {
        V.SWFPlayer.loadSWF($(e.target))
      }else {
        if($(e.target).hasClass("applet")) {
          V.AppletPlayer.loadApplet($(e.target))
        }
      }
    }, 500);
    if($(e.target).hasClass("flashcard")) {
      slideId = $(e.target).attr("id");
      fcElem = _getFlashcardFromSlideId(slideId);
      V.Mods.fc.player.init(fcElem, slideId)
    }
  };
  var _getFlashcardFromSlideId = function(id) {
    var fc = null;
    for(var i = 0;i < mySlides.length;i++) {
      if(mySlides[i].id === id) {
        for(var num = 0;num < mySlides[i].elements.length;num++) {
          if(mySlides[i].elements[num].type === "flashcard") {
            return mySlides[i].elements[num]
          }
        }
      }
    }
    return null
  };
  var _onslideleave = function(e) {
    V.SWFPlayer.unloadSWF();
    V.AppletPlayer.unloadApplet();
    if($(e.target).hasClass("flashcard")) {
      V.Mods.fc.player.clear()
    }
  };
  return{init:init, getStatus:getStatus, updateStatus:updateStatus}
}(VISH, jQuery);
VISH.Utils.canvas = function(V, undefined) {
  var drawImageWithAspectRatio = function(ctx, content, dx, dy, dw, dh) {
    var ratio, tmpHeight, tmpWidth, finalx, finaly, finalw, finalh;
    if(content.constructor === Image || content.constructor == HTMLImageElement) {
      ratio = content.width / content.height;
      tmpHeight = dw * content.height / content.width;
      tmpWidth = dh * content.width / content.height
    }else {
      ratio = content.videoWidth / content.videoHeight;
      tmpHeight = dw * content.videoHeight / content.videoWidth;
      tmpWidth = dh * content.videoWidth / content.videoHeight
    }
    if(ratio > dw / dh) {
      finalx = dx;
      finaly = dy + dh / 2 - tmpHeight / 2;
      finalw = dw;
      finalh = tmpHeight
    }else {
      finalx = dx + dw / 2 - tmpWidth / 2;
      finaly = dy;
      finalw = tmpWidth;
      finalh = dh
    }
    ctx.drawImage(content, finalx, finaly, finalw, finalh)
  };
  var drawImageWithAspectRatioAndRoundedCorners = function(ctx, content, dx, dy, dw, dh) {
    var ratio, tmpHeight, tmpWidth, finalx, finaly, finalw, finalh;
    if(content.constructor === Image || content.constructor == HTMLImageElement) {
      ratio = content.width / content.height;
      tmpHeight = dw * content.height / content.width;
      tmpWidth = dh * content.width / content.height
    }else {
      ratio = content.videoWidth / content.videoHeight;
      tmpHeight = dw * content.videoHeight / content.videoWidth;
      tmpWidth = dh * content.videoWidth / content.videoHeight
    }
    if(ratio > dw / dh) {
      finalx = dx;
      finaly = dy + dh / 2 - tmpHeight / 2;
      finalw = dw;
      finalh = tmpHeight
    }else {
      finalx = dx + dw / 2 - tmpWidth / 2;
      finaly = dy;
      finalw = tmpWidth;
      finalh = dh
    }
    ctx.drawImage(content, finalx, finaly, finalw, finalh);
    drawRoundedCorners(ctx, finalx, finaly, finalw, finalh)
  };
  var drawRoundedCorners = function(ctx, dx, dy, dw, dh, type) {
    var cornerFile, finalx, finaly, finalw, finalh;
    finalx = dx - 1;
    finaly = dy - 1;
    finalw = dw + 2;
    finalh = dh + 2;
    if(type === "text") {
      cornerFile = V.Utils.loader.getImage("libimages/corner_small_text.png")
    }else {
      if(finalw > 300 && finalh > 300) {
        cornerFile = V.Utils.loader.getImage("libimages/corner.png")
      }else {
        cornerFile = V.Utils.loader.getImage("libimages/corner_small.png")
      }
    }
    ctx.save();
    ctx.drawImage(cornerFile, finalx, finaly);
    ctx.translate(finalx + finalw, finaly);
    ctx.rotate(Math.PI / 2);
    ctx.drawImage(cornerFile, 0, 0);
    ctx.restore();
    ctx.save();
    ctx.translate(finalx + finalw, finaly + finalh);
    ctx.rotate(Math.PI);
    ctx.drawImage(cornerFile, 0, 0);
    ctx.restore();
    ctx.save();
    ctx.translate(finalx, finaly + finalh);
    ctx.rotate(3 * Math.PI / 2);
    ctx.drawImage(cornerFile, 0, 0);
    ctx.restore()
  };
  return{drawImageWithAspectRatioAndRoundedCorners:drawImageWithAspectRatioAndRoundedCorners, drawImageWithAspectRatio:drawImageWithAspectRatio, drawRoundedCorners:drawRoundedCorners}
}(VISH);
VISH.Utils = {};
VISH.Utils.loader = function(V, undefined) {
  var libVideos = {};
  var libImages = {};
  var getImage = function(imagePath) {
    if(libImages[imagePath]) {
      return libImages[imagePath]
    }else {
      console.log("Error, Image with path " + imagePath + " was not preloaded");
      return null
    }
  };
  var getVideo = function(videoPath) {
    if(libVideos[videoPath]) {
      return libVideos[videoPath]
    }else {
      console.log("Error, Video with path " + videoPath + " was not preloaded");
      return null
    }
  };
  var loadImage = function(src) {
    var deferred, img;
    deferred = $.Deferred();
    img = new Image;
    img.onload = function() {
      deferred.resolve()
    };
    img.src = src;
    libImages[src] = img;
    return deferred.promise()
  };
  var loadVideo = function(videoSrc, videoId) {
    var deferred, v;
    deferred = $.Deferred();
    v = document.createElement("video");
    v.setAttribute("id", "video" + videoId);
    v.setAttribute("style", "display:none");
    v.setAttribute("preload", "auto");
    v.setAttribute("src", videoSrc);
    document.body.appendChild(v);
    v.addEventListener("loadedmetadata", function() {
      deferred.resolve()
    }, false);
    libVideos[videoSrc] = v;
    return deferred.promise()
  };
  return{getImage:getImage, getVideo:getVideo, loadImage:loadImage, loadVideo:loadVideo}
}(VISH);
VISH.Utils.text = function(V, undefined) {
  var getLines = function(ctx, phrase, maxPxLength, textStyle) {
    var wa = phrase.split(" "), phraseArray = [], lastPhrase = "", l = maxPxLength, measure = 0, i = 0, w = 0;
    ctx.font = textStyle;
    for(i = 0;i < wa.length;i++) {
      w = wa[i];
      measure = ctx.measureText(lastPhrase + w).width;
      if(measure < l) {
        lastPhrase += " " + w
      }else {
        phraseArray.push(lastPhrase);
        lastPhrase = w
      }
      if(i === wa.length - 1) {
        phraseArray.push(lastPhrase);
        break
      }
    }
    return phraseArray
  };
  return{getLines:getLines}
}(VISH);
var VISH = VISH || {};
VISH.VERSION = "0.1";
VISH.AUTHORS = "GING";
VISH.Samples = function(V, undefined) {
  var samples = [{"id":"vish1", "template":"t1", "elements":[{"type":"text", "areaid":"header", "body":"Ejemplo de flora"}, {"type":"text", "areaid":"left", "body":"<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas orci nisl, euismod a posuere ac, commodo quis ipsum. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec sollicitudin risus laoreet velit dapibus bibendum. Nullam cursus sollicitudin hendrerit. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nunc ullamcorper tempor bibendum. Morbi gravida pretium leo, vitae scelerisque quam mattis eu. Sed hendrerit molestie magna, sit amet porttitor nulla facilisis in. Donec vel massa mauris, sit amet condimentum lacus.</p>"}, 
  {"type":"image", "areaid":"right", "body":"http://www.asturtalla.com/arbol.jpg"}]}, {"id":"vish2", "template":"t2", "elements":[{"type":"text", "areaid":"header", "body":"Ejemplo de fauna..."}, {"type":"image", "areaid":"center", "body":"http://www.absoluthuelva.com/wp-content/uploads/2009/03/donana.jpg"}]}, {"id":"vish3", "template":"t1", "elements":[{"type":"text", "areaid":"header", "body":"Sensores"}, {"type":"text", "areaid":"left", "body":"<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas orci nisl, euismod a posuere ac, commodo quis ipsum. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec sollicitudin risus laoreet velit dapibus bibendum. Nullam cursus sollicitudin hendrerit. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nunc ullamcorper tempor bibendum. Morbi gravida pretium leo, vitae scelerisque quam mattis eu. Sed hendrerit molestie magna, sit amet porttitor nulla facilisis in. Donec vel massa mauris, sit amet condimentum lacus.</p>"}, 
  {"type":"image", "areaid":"right", "body":"http://www.satec.es/es-ES/NuestraActividad/CasosdeExito/PublishingImages/IMG%20Do%C3%B1ana/do%C3%B1ana_fig2.png"}]}, {"id":"vish4", "template":"t2", "elements":[{"type":"text", "areaid":"header", "body":"Puesta de sol..."}, {"type":"image", "areaid":"left", "body":"http://www.viajes.okviajar.es/wp-content/uploads/2010/11/parque-donana.jpg"}]}, {"id":"vish5", "template":"t2", "elements":[{"type":"text", "areaid":"header", "body":"Experimento virtual1"}, 
  {"type":"swf", "areaid":"left", "body":"swf/virtualexperiment_1.swf"}]}, {"id":"vish6", "template":"t2", "elements":[{"type":"text", "areaid":"header", "body":"Experimento virtual2"}, {"type":"applet", "areaid":"left", "archive":"Wave.class", "code":"Wave.class", "width":200, "height":150, "params":'<param name=image value="Banna.jpg"><param name=horizMotion value=0.03>'}]}, {"id":"vish7", "template":"t2", "elements":[{"type":"text", "areaid":"header", "body":"Experimento virtual3"}, {"type":"applet", 
  "areaid":"left", "archive":"applets/Clock.class", "code":"Clock.class", "width":310, "height":160, "params":'<PARAM NAME=text VALUE="#00ff"><PARAM NAME=bgcolor VALUE="#00aaaa"><PARAM NAME=bordersize VALUE="35"><PARAM NAME=border_outside VALUE="#00ffaa"><PARAM NAME=border_inside VALUE="#0000FF"><PARAM NAME=fonttype VALUE="0"><PARAM NAME="GMT" VALUE="true"><PARAM NAME="correction" VALUE="3600000">'}]}, {"id":"vish8", "template":"t2", "elements":[{"type":"text", "areaid":"header", "body":"Ejemplo de flashcard pa t\ufffd..."}, 
  {"type":"flashcard", "areaid":"center", "canvasid":"myCanvas", "jsoncontent":'{"name": "myFirstFlashcard","description": "flashcard explanation","type": "flashcard","backgroundSrc": "media/images/background.jpg","pois": [{"id": 1,"x": 200,"y": 325,"templateNumber": 0,"zonesContent": [{"type": "text","content": "El tantalio o t\ufffdntalo es un elemento qu\ufffdmico de n\ufffdmero at\ufffdmico 73, que se sit\ufffda en el grupo 5 de la tabla peri\ufffddica de los elementos. Su s\ufffdmbolo es Ta. Se trata de un metal de transici\ufffdn raro, azul gris\ufffdceo, duro, que presenta brillo met\ufffdlico y resiste muy bien la corrosi\ufffdn. Se encuentra en el mineral tantalita. Es fisiol\ufffdgicamente inerte, por lo que, entre sus variadas aplicaciones, se puede emplear para la fabricaci\ufffdn de instrumentos quir\ufffdrgicos y en implantes. En ocasiones se le llama t\ufffdntalo, pero el \ufffdnico nombre reconocido por la Real Academia Espa\ufffdola es tantalio."}]},{"id": 2,"x": 458,"y": 285,"templateNumber": 1,"zonesContent": [{"type": "text","content": "Image shows silver rock"},{"type": "image","content": "media/images/3.jpg"}]},{"id": 3,"x": 658,"y": 285,"templateNumber": 0,"zonesContent": [{"type": "video","content": [{"mimetype": "video/webm","src": "media/videos/video1.webm"},{"mimetype": "video/mp4","src": "http://video-js.zencoder.com/oceans-clip.mp4"}]}]},{"id": 4,"x": 458,"y": 457,"templateNumber": 2,"zonesContent": [{"type": "text","content": "Image shows silver rock"},{"type": "empty","content": ""},{"type": "text","content": "El tantalio o t\ufffdntalo es un elemento qu\ufffdmico de n\ufffdmero at\ufffdmico 73, que se sit\ufffda en el grupo 5 de la tabla peri\ufffddica de los elementos. Su s\ufffdmbolo es Ta. Se trata de un metal de transici\ufffdn raro, azul gris\ufffdceo, duro, que presenta brillo met\ufffdlico y resiste muy bien la corrosi\ufffdn. Se encuentra en el mineral tantalita. Es fisiol\ufffdgicamente inerte, por lo que, entre sus variadas aplicaciones, se puede emplear para la fabricaci\ufffdn de instrumentos quir\ufffdrgicos y en implantes. En ocasiones se le llama t\ufffdntalo, pero el \ufffdnico nombre reconocido por la Real Academia Espa\ufffdola es tantalio."}]}]}', 
  "js":"js/mods/fc/VISH.Mods.fc.js"}]}, {"id":"vish9", "template":"t2", "elements":[{"type":"text", "areaid":"header", "body":"FLASHCARD 2..."}, {"type":"flashcard", "areaid":"center", "canvasid":"myCanvas2", "jsoncontent":'{"name": "myFirstFlashcard","description": "flashcard explanation","type": "flashcard","backgroundSrc": "media/images/background2.png","pois": [{"id": 1,"x": 200,"y": 325,"templateNumber": 0,"zonesContent": [{"type": "text","content": "texto texto texto"}]},{"id": 2,"x": 458,"y": 285,"templateNumber": 1,"zonesContent": [{"type": "text","content": "Image shows silver rock"},{"type": "image","content": "media/images/plata.jpg"}]},{"id": 3,"x": 658,"y": 285,"templateNumber": 0,"zonesContent": [{"type": "video","content": [{"mimetype": "video/webm","src": "media/videos/video1.webm"},{"mimetype": "video/mp4","src": "http://video-js.zencoder.com/oceans-clip.mp4"}]}]},{"id": 4,"x": 458,"y": 457,"templateNumber": 2,"zonesContent": [{"type": "text","content": "Image shows silver rock"},{"type": "empty","content": ""},{"type": "text","content": "texto 2 texto 2."}]}]}', 
  "js":"js/mods/fc/VISH.Mods.fc.js"}]}];
  return{samples:samples}
}(VISH);
var JSON;
if(!JSON) {
  JSON = {}
}
(function() {
  function f(n) {
    return n < 10 ? "0" + n : n
  }
  if(typeof Date.prototype.toJSON !== "function") {
    Date.prototype.toJSON = function(key) {
      return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z" : null
    };
    String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function(key) {
      return this.valueOf()
    }
  }
  var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, gap, indent, meta = {"\u0008":"\\b", "\t":"\\t", "\n":"\\n", "\u000c":"\\f", "\r":"\\r", '"':'\\"', "\\":"\\\\"}, rep;
  function quote(string) {
    escapable.lastIndex = 0;
    return escapable.test(string) ? '"' + string.replace(escapable, function(a) {
      var c = meta[a];
      return typeof c === "string" ? c : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
    }) + '"' : '"' + string + '"'
  }
  function str(key, holder) {
    var i, k, v, length, mind = gap, partial, value = holder[key];
    if(value && typeof value === "object" && typeof value.toJSON === "function") {
      value = value.toJSON(key)
    }
    if(typeof rep === "function") {
      value = rep.call(holder, key, value)
    }
    switch(typeof value) {
      case "string":
        return quote(value);
      case "number":
        return isFinite(value) ? String(value) : "null";
      case "boolean":
      ;
      case "null":
        return String(value);
      case "object":
        if(!value) {
          return"null"
        }
        gap += indent;
        partial = [];
        if(Object.prototype.toString.apply(value) === "[object Array]") {
          length = value.length;
          for(i = 0;i < length;i += 1) {
            partial[i] = str(i, value) || "null"
          }
          v = partial.length === 0 ? "[]" : gap ? "[\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "]" : "[" + partial.join(",") + "]";
          gap = mind;
          return v
        }
        if(rep && typeof rep === "object") {
          length = rep.length;
          for(i = 0;i < length;i += 1) {
            if(typeof rep[i] === "string") {
              k = rep[i];
              v = str(k, value);
              if(v) {
                partial.push(quote(k) + (gap ? ": " : ":") + v)
              }
            }
          }
        }else {
          for(k in value) {
            if(Object.prototype.hasOwnProperty.call(value, k)) {
              v = str(k, value);
              if(v) {
                partial.push(quote(k) + (gap ? ": " : ":") + v)
              }
            }
          }
        }
        v = partial.length === 0 ? "{}" : gap ? "{\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "}" : "{" + partial.join(",") + "}";
        gap = mind;
        return v
    }
  }
  if(typeof JSON.stringify !== "function") {
    JSON.stringify = function(value, replacer, space) {
      var i;
      gap = "";
      indent = "";
      if(typeof space === "number") {
        for(i = 0;i < space;i += 1) {
          indent += " "
        }
      }else {
        if(typeof space === "string") {
          indent = space
        }
      }
      rep = replacer;
      if(replacer && typeof replacer !== "function" && (typeof replacer !== "object" || typeof replacer.length !== "number")) {
        throw new Error("JSON.stringify");
      }
      return str("", {"":value})
    }
  }
  if(typeof JSON.parse !== "function") {
    JSON.parse = function(text, reviver) {
      var j;
      function walk(holder, key) {
        var k, v, value = holder[key];
        if(value && typeof value === "object") {
          for(k in value) {
            if(Object.prototype.hasOwnProperty.call(value, k)) {
              v = walk(value, k);
              if(v !== undefined) {
                value[k] = v
              }else {
                delete value[k]
              }
            }
          }
        }
        return reviver.call(holder, key, value)
      }
      text = String(text);
      cx.lastIndex = 0;
      if(cx.test(text)) {
        text = text.replace(cx, function(a) {
          return"\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
        })
      }
      if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) {
        j = eval("(" + text + ")");
        return typeof reviver === "function" ? walk({"":j}, "") : j
      }
      throw new SyntaxError("JSON.parse");
    }
  }
})();
(function(a, b) {
  function cy(a) {
    return f.isWindow(a) ? a : a.nodeType === 9 ? a.defaultView || a.parentWindow : !1
  }
  function cv(a) {
    if(!ck[a]) {
      var b = c.body, d = f("<" + a + ">").appendTo(b), e = d.css("display");
      d.remove();
      if(e === "none" || e === "") {
        cl || (cl = c.createElement("iframe"), cl.frameBorder = cl.width = cl.height = 0), b.appendChild(cl);
        if(!cm || !cl.createElement) {
          cm = (cl.contentWindow || cl.contentDocument).document, cm.write((c.compatMode === "CSS1Compat" ? "<!doctype html>" : "") + "<html><body>"), cm.close()
        }
        d = cm.createElement(a), cm.body.appendChild(d), e = f.css(d, "display"), b.removeChild(cl)
      }
      ck[a] = e
    }
    return ck[a]
  }
  function cu(a, b) {
    var c = {};
    f.each(cq.concat.apply([], cq.slice(0, b)), function() {
      c[this] = a
    });
    return c
  }
  function ct() {
    cr = b
  }
  function cs() {
    setTimeout(ct, 0);
    return cr = f.now()
  }
  function cj() {
    try {
      return new a.ActiveXObject("Microsoft.XMLHTTP")
    }catch(b) {
    }
  }
  function ci() {
    try {
      return new a.XMLHttpRequest
    }catch(b) {
    }
  }
  function cc(a, c) {
    a.dataFilter && (c = a.dataFilter(c, a.dataType));
    var d = a.dataTypes, e = {}, g, h, i = d.length, j, k = d[0], l, m, n, o, p;
    for(g = 1;g < i;g++) {
      if(g === 1) {
        for(h in a.converters) {
          typeof h == "string" && (e[h.toLowerCase()] = a.converters[h])
        }
      }
      l = k, k = d[g];
      if(k === "*") {
        k = l
      }else {
        if(l !== "*" && l !== k) {
          m = l + " " + k, n = e[m] || e["* " + k];
          if(!n) {
            p = b;
            for(o in e) {
              j = o.split(" ");
              if(j[0] === l || j[0] === "*") {
                p = e[j[1] + " " + k];
                if(p) {
                  o = e[o], o === !0 ? n = p : p === !0 && (n = o);
                  break
                }
              }
            }
          }
          !n && !p && f.error("No conversion from " + m.replace(" ", " to ")), n !== !0 && (c = n ? n(c) : p(o(c)))
        }
      }
    }
    return c
  }
  function cb(a, c, d) {
    var e = a.contents, f = a.dataTypes, g = a.responseFields, h, i, j, k;
    for(i in g) {
      i in d && (c[g[i]] = d[i])
    }
    while(f[0] === "*") {
      f.shift(), h === b && (h = a.mimeType || c.getResponseHeader("content-type"))
    }
    if(h) {
      for(i in e) {
        if(e[i] && e[i].test(h)) {
          f.unshift(i);
          break
        }
      }
    }
    if(f[0] in d) {
      j = f[0]
    }else {
      for(i in d) {
        if(!f[0] || a.converters[i + " " + f[0]]) {
          j = i;
          break
        }
        k || (k = i)
      }
      j = j || k
    }
    if(j) {
      j !== f[0] && f.unshift(j);
      return d[j]
    }
  }
  function ca(a, b, c, d) {
    if(f.isArray(b)) {
      f.each(b, function(b, e) {
        c || bE.test(a) ? d(a, e) : ca(a + "[" + (typeof e == "object" || f.isArray(e) ? b : "") + "]", e, c, d)
      })
    }else {
      if(!c && b != null && typeof b == "object") {
        for(var e in b) {
          ca(a + "[" + e + "]", b[e], c, d)
        }
      }else {
        d(a, b)
      }
    }
  }
  function b_(a, c) {
    var d, e, g = f.ajaxSettings.flatOptions || {};
    for(d in c) {
      c[d] !== b && ((g[d] ? a : e || (e = {}))[d] = c[d])
    }
    e && f.extend(!0, a, e)
  }
  function b$(a, c, d, e, f, g) {
    f = f || c.dataTypes[0], g = g || {}, g[f] = !0;
    var h = a[f], i = 0, j = h ? h.length : 0, k = a === bT, l;
    for(;i < j && (k || !l);i++) {
      l = h[i](c, d, e), typeof l == "string" && (!k || g[l] ? l = b : (c.dataTypes.unshift(l), l = b$(a, c, d, e, l, g)))
    }
    (k || !l) && !g["*"] && (l = b$(a, c, d, e, "*", g));
    return l
  }
  function bZ(a) {
    return function(b, c) {
      typeof b != "string" && (c = b, b = "*");
      if(f.isFunction(c)) {
        var d = b.toLowerCase().split(bP), e = 0, g = d.length, h, i, j;
        for(;e < g;e++) {
          h = d[e], j = /^\+/.test(h), j && (h = h.substr(1) || "*"), i = a[h] = a[h] || [], i[j ? "unshift" : "push"](c)
        }
      }
    }
  }
  function bC(a, b, c) {
    var d = b === "width" ? a.offsetWidth : a.offsetHeight, e = b === "width" ? bx : by, g = 0, h = e.length;
    if(d > 0) {
      if(c !== "border") {
        for(;g < h;g++) {
          c || (d -= parseFloat(f.css(a, "padding" + e[g])) || 0), c === "margin" ? d += parseFloat(f.css(a, c + e[g])) || 0 : d -= parseFloat(f.css(a, "border" + e[g] + "Width")) || 0
        }
      }
      return d + "px"
    }
    d = bz(a, b, b);
    if(d < 0 || d == null) {
      d = a.style[b] || 0
    }
    d = parseFloat(d) || 0;
    if(c) {
      for(;g < h;g++) {
        d += parseFloat(f.css(a, "padding" + e[g])) || 0, c !== "padding" && (d += parseFloat(f.css(a, "border" + e[g] + "Width")) || 0), c === "margin" && (d += parseFloat(f.css(a, c + e[g])) || 0)
      }
    }
    return d + "px"
  }
  function bp(a, b) {
    b.src ? f.ajax({url:b.src, async:!1, dataType:"script"}) : f.globalEval((b.text || b.textContent || b.innerHTML || "").replace(bf, "/*$0*/")), b.parentNode && b.parentNode.removeChild(b)
  }
  function bo(a) {
    var b = c.createElement("div");
    bh.appendChild(b), b.innerHTML = a.outerHTML;
    return b.firstChild
  }
  function bn(a) {
    var b = (a.nodeName || "").toLowerCase();
    b === "input" ? bm(a) : b !== "script" && typeof a.getElementsByTagName != "undefined" && f.grep(a.getElementsByTagName("input"), bm)
  }
  function bm(a) {
    if(a.type === "checkbox" || a.type === "radio") {
      a.defaultChecked = a.checked
    }
  }
  function bl(a) {
    return typeof a.getElementsByTagName != "undefined" ? a.getElementsByTagName("*") : typeof a.querySelectorAll != "undefined" ? a.querySelectorAll("*") : []
  }
  function bk(a, b) {
    var c;
    if(b.nodeType === 1) {
      b.clearAttributes && b.clearAttributes(), b.mergeAttributes && b.mergeAttributes(a), c = b.nodeName.toLowerCase();
      if(c === "object") {
        b.outerHTML = a.outerHTML
      }else {
        if(c !== "input" || a.type !== "checkbox" && a.type !== "radio") {
          if(c === "option") {
            b.selected = a.defaultSelected
          }else {
            if(c === "input" || c === "textarea") {
              b.defaultValue = a.defaultValue
            }
          }
        }else {
          a.checked && (b.defaultChecked = b.checked = a.checked), b.value !== a.value && (b.value = a.value)
        }
      }
      b.removeAttribute(f.expando)
    }
  }
  function bj(a, b) {
    if(b.nodeType === 1 && !!f.hasData(a)) {
      var c, d, e, g = f._data(a), h = f._data(b, g), i = g.events;
      if(i) {
        delete h.handle, h.events = {};
        for(c in i) {
          for(d = 0, e = i[c].length;d < e;d++) {
            f.event.add(b, c + (i[c][d].namespace ? "." : "") + i[c][d].namespace, i[c][d], i[c][d].data)
          }
        }
      }
      h.data && (h.data = f.extend({}, h.data))
    }
  }
  function bi(a, b) {
    return f.nodeName(a, "table") ? a.getElementsByTagName("tbody")[0] || a.appendChild(a.ownerDocument.createElement("tbody")) : a
  }
  function U(a) {
    var b = V.split("|"), c = a.createDocumentFragment();
    if(c.createElement) {
      while(b.length) {
        c.createElement(b.pop())
      }
    }
    return c
  }
  function T(a, b, c) {
    b = b || 0;
    if(f.isFunction(b)) {
      return f.grep(a, function(a, d) {
        var e = !!b.call(a, d, a);
        return e === c
      })
    }
    if(b.nodeType) {
      return f.grep(a, function(a, d) {
        return a === b === c
      })
    }
    if(typeof b == "string") {
      var d = f.grep(a, function(a) {
        return a.nodeType === 1
      });
      if(O.test(b)) {
        return f.filter(b, d, !c)
      }
      b = f.filter(b, d)
    }
    return f.grep(a, function(a, d) {
      return f.inArray(a, b) >= 0 === c
    })
  }
  function S(a) {
    return!a || !a.parentNode || a.parentNode.nodeType === 11
  }
  function K() {
    return!0
  }
  function J() {
    return!1
  }
  function n(a, b, c) {
    var d = b + "defer", e = b + "queue", g = b + "mark", h = f._data(a, d);
    h && (c === "queue" || !f._data(a, e)) && (c === "mark" || !f._data(a, g)) && setTimeout(function() {
      !f._data(a, e) && !f._data(a, g) && (f.removeData(a, d, !0), h.fire())
    }, 0)
  }
  function m(a) {
    for(var b in a) {
      if(b === "data" && f.isEmptyObject(a[b])) {
        continue
      }
      if(b !== "toJSON") {
        return!1
      }
    }
    return!0
  }
  function l(a, c, d) {
    if(d === b && a.nodeType === 1) {
      var e = "data-" + c.replace(k, "-$1").toLowerCase();
      d = a.getAttribute(e);
      if(typeof d == "string") {
        try {
          d = d === "true" ? !0 : d === "false" ? !1 : d === "null" ? null : f.isNumeric(d) ? parseFloat(d) : j.test(d) ? f.parseJSON(d) : d
        }catch(g) {
        }
        f.data(a, c, d)
      }else {
        d = b
      }
    }
    return d
  }
  function h(a) {
    var b = g[a] = {}, c, d;
    a = a.split(/\s+/);
    for(c = 0, d = a.length;c < d;c++) {
      b[a[c]] = !0
    }
    return b
  }
  var c = a.document, d = a.navigator, e = a.location, f = function() {
    function J() {
      if(!e.isReady) {
        try {
          c.documentElement.doScroll("left")
        }catch(a) {
          setTimeout(J, 1);
          return
        }
        e.ready()
      }
    }
    var e = function(a, b) {
      return new e.fn.init(a, b, h)
    }, f = a.jQuery, g = a.$, h, i = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/, j = /\S/, k = /^\s+/, l = /\s+$/, m = /^<(\w+)\s*\/?>(?:<\/\1>)?$/, n = /^[\],:{}\s]*$/, o = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, p = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, q = /(?:^|:|,)(?:\s*\[)+/g, r = /(webkit)[ \/]([\w.]+)/, s = /(opera)(?:.*version)?[ \/]([\w.]+)/, t = /(msie) ([\w.]+)/, u = /(mozilla)(?:.*? rv:([\w.]+))?/, v = /-([a-z]|[0-9])/ig, w = /^-ms-/, x = function(a, b) {
      return(b + "").toUpperCase()
    }, y = d.userAgent, z, A, B, C = Object.prototype.toString, D = Object.prototype.hasOwnProperty, E = Array.prototype.push, F = Array.prototype.slice, G = String.prototype.trim, H = Array.prototype.indexOf, I = {};
    e.fn = e.prototype = {constructor:e, init:function(a, d, f) {
      var g, h, j, k;
      if(!a) {
        return this
      }
      if(a.nodeType) {
        this.context = this[0] = a, this.length = 1;
        return this
      }
      if(a === "body" && !d && c.body) {
        this.context = c, this[0] = c.body, this.selector = a, this.length = 1;
        return this
      }
      if(typeof a == "string") {
        a.charAt(0) !== "<" || a.charAt(a.length - 1) !== ">" || a.length < 3 ? g = i.exec(a) : g = [null, a, null];
        if(g && (g[1] || !d)) {
          if(g[1]) {
            d = d instanceof e ? d[0] : d, k = d ? d.ownerDocument || d : c, j = m.exec(a), j ? e.isPlainObject(d) ? (a = [c.createElement(j[1])], e.fn.attr.call(a, d, !0)) : a = [k.createElement(j[1])] : (j = e.buildFragment([g[1]], [k]), a = (j.cacheable ? e.clone(j.fragment) : j.fragment).childNodes);
            return e.merge(this, a)
          }
          h = c.getElementById(g[2]);
          if(h && h.parentNode) {
            if(h.id !== g[2]) {
              return f.find(a)
            }
            this.length = 1, this[0] = h
          }
          this.context = c, this.selector = a;
          return this
        }
        return!d || d.jquery ? (d || f).find(a) : this.constructor(d).find(a)
      }
      if(e.isFunction(a)) {
        return f.ready(a)
      }
      a.selector !== b && (this.selector = a.selector, this.context = a.context);
      return e.makeArray(a, this)
    }, selector:"", jquery:"1.7.1", length:0, size:function() {
      return this.length
    }, toArray:function() {
      return F.call(this, 0)
    }, get:function(a) {
      return a == null ? this.toArray() : a < 0 ? this[this.length + a] : this[a]
    }, pushStack:function(a, b, c) {
      var d = this.constructor();
      e.isArray(a) ? E.apply(d, a) : e.merge(d, a), d.prevObject = this, d.context = this.context, b === "find" ? d.selector = this.selector + (this.selector ? " " : "") + c : b && (d.selector = this.selector + "." + b + "(" + c + ")");
      return d
    }, each:function(a, b) {
      return e.each(this, a, b)
    }, ready:function(a) {
      e.bindReady(), A.add(a);
      return this
    }, eq:function(a) {
      a = +a;
      return a === -1 ? this.slice(a) : this.slice(a, a + 1)
    }, first:function() {
      return this.eq(0)
    }, last:function() {
      return this.eq(-1)
    }, slice:function() {
      return this.pushStack(F.apply(this, arguments), "slice", F.call(arguments).join(","))
    }, map:function(a) {
      return this.pushStack(e.map(this, function(b, c) {
        return a.call(b, c, b)
      }))
    }, end:function() {
      return this.prevObject || this.constructor(null)
    }, push:E, sort:[].sort, splice:[].splice}, e.fn.init.prototype = e.fn, e.extend = e.fn.extend = function() {
      var a, c, d, f, g, h, i = arguments[0] || {}, j = 1, k = arguments.length, l = !1;
      typeof i == "boolean" && (l = i, i = arguments[1] || {}, j = 2), typeof i != "object" && !e.isFunction(i) && (i = {}), k === j && (i = this, --j);
      for(;j < k;j++) {
        if((a = arguments[j]) != null) {
          for(c in a) {
            d = i[c], f = a[c];
            if(i === f) {
              continue
            }
            l && f && (e.isPlainObject(f) || (g = e.isArray(f))) ? (g ? (g = !1, h = d && e.isArray(d) ? d : []) : h = d && e.isPlainObject(d) ? d : {}, i[c] = e.extend(l, h, f)) : f !== b && (i[c] = f)
          }
        }
      }
      return i
    }, e.extend({noConflict:function(b) {
      a.$ === e && (a.$ = g), b && a.jQuery === e && (a.jQuery = f);
      return e
    }, isReady:!1, readyWait:1, holdReady:function(a) {
      a ? e.readyWait++ : e.ready(!0)
    }, ready:function(a) {
      if(a === !0 && !--e.readyWait || a !== !0 && !e.isReady) {
        if(!c.body) {
          return setTimeout(e.ready, 1)
        }
        e.isReady = !0;
        if(a !== !0 && --e.readyWait > 0) {
          return
        }
        A.fireWith(c, [e]), e.fn.trigger && e(c).trigger("ready").off("ready")
      }
    }, bindReady:function() {
      if(!A) {
        A = e.Callbacks("once memory");
        if(c.readyState === "complete") {
          return setTimeout(e.ready, 1)
        }
        if(c.addEventListener) {
          c.addEventListener("DOMContentLoaded", B, !1), a.addEventListener("load", e.ready, !1)
        }else {
          if(c.attachEvent) {
            c.attachEvent("onreadystatechange", B), a.attachEvent("onload", e.ready);
            var b = !1;
            try {
              b = a.frameElement == null
            }catch(d) {
            }
            c.documentElement.doScroll && b && J()
          }
        }
      }
    }, isFunction:function(a) {
      return e.type(a) === "function"
    }, isArray:Array.isArray || function(a) {
      return e.type(a) === "array"
    }, isWindow:function(a) {
      return a && typeof a == "object" && "setInterval" in a
    }, isNumeric:function(a) {
      return!isNaN(parseFloat(a)) && isFinite(a)
    }, type:function(a) {
      return a == null ? String(a) : I[C.call(a)] || "object"
    }, isPlainObject:function(a) {
      if(!a || e.type(a) !== "object" || a.nodeType || e.isWindow(a)) {
        return!1
      }
      try {
        if(a.constructor && !D.call(a, "constructor") && !D.call(a.constructor.prototype, "isPrototypeOf")) {
          return!1
        }
      }catch(c) {
        return!1
      }
      var d;
      for(d in a) {
      }
      return d === b || D.call(a, d)
    }, isEmptyObject:function(a) {
      for(var b in a) {
        return!1
      }
      return!0
    }, error:function(a) {
      throw new Error(a);
    }, parseJSON:function(b) {
      if(typeof b != "string" || !b) {
        return null
      }
      b = e.trim(b);
      if(a.JSON && a.JSON.parse) {
        return a.JSON.parse(b)
      }
      if(n.test(b.replace(o, "@").replace(p, "]").replace(q, ""))) {
        return(new Function("return " + b))()
      }
      e.error("Invalid JSON: " + b)
    }, parseXML:function(c) {
      var d, f;
      try {
        a.DOMParser ? (f = new DOMParser, d = f.parseFromString(c, "text/xml")) : (d = new ActiveXObject("Microsoft.XMLDOM"), d.async = "false", d.loadXML(c))
      }catch(g) {
        d = b
      }
      (!d || !d.documentElement || d.getElementsByTagName("parsererror").length) && e.error("Invalid XML: " + c);
      return d
    }, noop:function() {
    }, globalEval:function(b) {
      b && j.test(b) && (a.execScript || function(b) {
        a.eval.call(a, b)
      })(b)
    }, camelCase:function(a) {
      return a.replace(w, "ms-").replace(v, x)
    }, nodeName:function(a, b) {
      return a.nodeName && a.nodeName.toUpperCase() === b.toUpperCase()
    }, each:function(a, c, d) {
      var f, g = 0, h = a.length, i = h === b || e.isFunction(a);
      if(d) {
        if(i) {
          for(f in a) {
            if(c.apply(a[f], d) === !1) {
              break
            }
          }
        }else {
          for(;g < h;) {
            if(c.apply(a[g++], d) === !1) {
              break
            }
          }
        }
      }else {
        if(i) {
          for(f in a) {
            if(c.call(a[f], f, a[f]) === !1) {
              break
            }
          }
        }else {
          for(;g < h;) {
            if(c.call(a[g], g, a[g++]) === !1) {
              break
            }
          }
        }
      }
      return a
    }, trim:G ? function(a) {
      return a == null ? "" : G.call(a)
    } : function(a) {
      return a == null ? "" : (a + "").replace(k, "").replace(l, "")
    }, makeArray:function(a, b) {
      var c = b || [];
      if(a != null) {
        var d = e.type(a);
        a.length == null || d === "string" || d === "function" || d === "regexp" || e.isWindow(a) ? E.call(c, a) : e.merge(c, a)
      }
      return c
    }, inArray:function(a, b, c) {
      var d;
      if(b) {
        if(H) {
          return H.call(b, a, c)
        }
        d = b.length, c = c ? c < 0 ? Math.max(0, d + c) : c : 0;
        for(;c < d;c++) {
          if(c in b && b[c] === a) {
            return c
          }
        }
      }
      return-1
    }, merge:function(a, c) {
      var d = a.length, e = 0;
      if(typeof c.length == "number") {
        for(var f = c.length;e < f;e++) {
          a[d++] = c[e]
        }
      }else {
        while(c[e] !== b) {
          a[d++] = c[e++]
        }
      }
      a.length = d;
      return a
    }, grep:function(a, b, c) {
      var d = [], e;
      c = !!c;
      for(var f = 0, g = a.length;f < g;f++) {
        e = !!b(a[f], f), c !== e && d.push(a[f])
      }
      return d
    }, map:function(a, c, d) {
      var f, g, h = [], i = 0, j = a.length, k = a instanceof e || j !== b && typeof j == "number" && (j > 0 && a[0] && a[j - 1] || j === 0 || e.isArray(a));
      if(k) {
        for(;i < j;i++) {
          f = c(a[i], i, d), f != null && (h[h.length] = f)
        }
      }else {
        for(g in a) {
          f = c(a[g], g, d), f != null && (h[h.length] = f)
        }
      }
      return h.concat.apply([], h)
    }, guid:1, proxy:function(a, c) {
      if(typeof c == "string") {
        var d = a[c];
        c = a, a = d
      }
      if(!e.isFunction(a)) {
        return b
      }
      var f = F.call(arguments, 2), g = function() {
        return a.apply(c, f.concat(F.call(arguments)))
      };
      g.guid = a.guid = a.guid || g.guid || e.guid++;
      return g
    }, access:function(a, c, d, f, g, h) {
      var i = a.length;
      if(typeof c == "object") {
        for(var j in c) {
          e.access(a, j, c[j], f, g, d)
        }
        return a
      }
      if(d !== b) {
        f = !h && f && e.isFunction(d);
        for(var k = 0;k < i;k++) {
          g(a[k], c, f ? d.call(a[k], k, g(a[k], c)) : d, h)
        }
        return a
      }
      return i ? g(a[0], c) : b
    }, now:function() {
      return(new Date).getTime()
    }, uaMatch:function(a) {
      a = a.toLowerCase();
      var b = r.exec(a) || s.exec(a) || t.exec(a) || a.indexOf("compatible") < 0 && u.exec(a) || [];
      return{browser:b[1] || "", version:b[2] || "0"}
    }, sub:function() {
      function a(b, c) {
        return new a.fn.init(b, c)
      }
      e.extend(!0, a, this), a.superclass = this, a.fn = a.prototype = this(), a.fn.constructor = a, a.sub = this.sub, a.fn.init = function(d, f) {
        f && f instanceof e && !(f instanceof a) && (f = a(f));
        return e.fn.init.call(this, d, f, b)
      }, a.fn.init.prototype = a.fn;
      var b = a(c);
      return a
    }, browser:{}}), e.each("Boolean Number String Function Array Date RegExp Object".split(" "), function(a, b) {
      I["[object " + b + "]"] = b.toLowerCase()
    }), z = e.uaMatch(y), z.browser && (e.browser[z.browser] = !0, e.browser.version = z.version), e.browser.webkit && (e.browser.safari = !0), j.test("\u00a0") && (k = /^[\s\xA0]+/, l = /[\s\xA0]+$/), h = e(c), c.addEventListener ? B = function() {
      c.removeEventListener("DOMContentLoaded", B, !1), e.ready()
    } : c.attachEvent && (B = function() {
      c.readyState === "complete" && (c.detachEvent("onreadystatechange", B), e.ready())
    });
    return e
  }(), g = {};
  f.Callbacks = function(a) {
    a = a ? g[a] || h(a) : {};
    var c = [], d = [], e, i, j, k, l, m = function(b) {
      var d, e, g, h, i;
      for(d = 0, e = b.length;d < e;d++) {
        g = b[d], h = f.type(g), h === "array" ? m(g) : h === "function" && (!a.unique || !o.has(g)) && c.push(g)
      }
    }, n = function(b, f) {
      f = f || [], e = !a.memory || [b, f], i = !0, l = j || 0, j = 0, k = c.length;
      for(;c && l < k;l++) {
        if(c[l].apply(b, f) === !1 && a.stopOnFalse) {
          e = !0;
          break
        }
      }
      i = !1, c && (a.once ? e === !0 ? o.disable() : c = [] : d && d.length && (e = d.shift(), o.fireWith(e[0], e[1])))
    }, o = {add:function() {
      if(c) {
        var a = c.length;
        m(arguments), i ? k = c.length : e && e !== !0 && (j = a, n(e[0], e[1]))
      }
      return this
    }, remove:function() {
      if(c) {
        var b = arguments, d = 0, e = b.length;
        for(;d < e;d++) {
          for(var f = 0;f < c.length;f++) {
            if(b[d] === c[f]) {
              i && f <= k && (k--, f <= l && l--), c.splice(f--, 1);
              if(a.unique) {
                break
              }
            }
          }
        }
      }
      return this
    }, has:function(a) {
      if(c) {
        var b = 0, d = c.length;
        for(;b < d;b++) {
          if(a === c[b]) {
            return!0
          }
        }
      }
      return!1
    }, empty:function() {
      c = [];
      return this
    }, disable:function() {
      c = d = e = b;
      return this
    }, disabled:function() {
      return!c
    }, lock:function() {
      d = b, (!e || e === !0) && o.disable();
      return this
    }, locked:function() {
      return!d
    }, fireWith:function(b, c) {
      d && (i ? a.once || d.push([b, c]) : (!a.once || !e) && n(b, c));
      return this
    }, fire:function() {
      o.fireWith(this, arguments);
      return this
    }, fired:function() {
      return!!e
    }};
    return o
  };
  var i = [].slice;
  f.extend({Deferred:function(a) {
    var b = f.Callbacks("once memory"), c = f.Callbacks("once memory"), d = f.Callbacks("memory"), e = "pending", g = {resolve:b, reject:c, notify:d}, h = {done:b.add, fail:c.add, progress:d.add, state:function() {
      return e
    }, isResolved:b.fired, isRejected:c.fired, then:function(a, b, c) {
      i.done(a).fail(b).progress(c);
      return this
    }, always:function() {
      i.done.apply(i, arguments).fail.apply(i, arguments);
      return this
    }, pipe:function(a, b, c) {
      return f.Deferred(function(d) {
        f.each({done:[a, "resolve"], fail:[b, "reject"], progress:[c, "notify"]}, function(a, b) {
          var c = b[0], e = b[1], g;
          f.isFunction(c) ? i[a](function() {
            g = c.apply(this, arguments), g && f.isFunction(g.promise) ? g.promise().then(d.resolve, d.reject, d.notify) : d[e + "With"](this === i ? d : this, [g])
          }) : i[a](d[e])
        })
      }).promise()
    }, promise:function(a) {
      if(a == null) {
        a = h
      }else {
        for(var b in h) {
          a[b] = h[b]
        }
      }
      return a
    }}, i = h.promise({}), j;
    for(j in g) {
      i[j] = g[j].fire, i[j + "With"] = g[j].fireWith
    }
    i.done(function() {
      e = "resolved"
    }, c.disable, d.lock).fail(function() {
      e = "rejected"
    }, b.disable, d.lock), a && a.call(i, i);
    return i
  }, when:function(a) {
    function m(a) {
      return function(b) {
        e[a] = arguments.length > 1 ? i.call(arguments, 0) : b, j.notifyWith(k, e)
      }
    }
    function l(a) {
      return function(c) {
        b[a] = arguments.length > 1 ? i.call(arguments, 0) : c, --g || j.resolveWith(j, b)
      }
    }
    var b = i.call(arguments, 0), c = 0, d = b.length, e = Array(d), g = d, h = d, j = d <= 1 && a && f.isFunction(a.promise) ? a : f.Deferred(), k = j.promise();
    if(d > 1) {
      for(;c < d;c++) {
        b[c] && b[c].promise && f.isFunction(b[c].promise) ? b[c].promise().then(l(c), j.reject, m(c)) : --g
      }
      g || j.resolveWith(j, b)
    }else {
      j !== a && j.resolveWith(j, d ? [a] : [])
    }
    return k
  }}), f.support = function() {
    var b, d, e, g, h, i, j, k, l, m, n, o, p, q = c.createElement("div"), r = c.documentElement;
    q.setAttribute("className", "t"), q.innerHTML = "   <link/><table></table><a href='/a' style='top:1px;float:left;opacity:.55;'>a</a><input type='checkbox'/>", d = q.getElementsByTagName("*"), e = q.getElementsByTagName("a")[0];
    if(!d || !d.length || !e) {
      return{}
    }
    g = c.createElement("select"), h = g.appendChild(c.createElement("option")), i = q.getElementsByTagName("input")[0], b = {leadingWhitespace:q.firstChild.nodeType === 3, tbody:!q.getElementsByTagName("tbody").length, htmlSerialize:!!q.getElementsByTagName("link").length, style:/top/.test(e.getAttribute("style")), hrefNormalized:e.getAttribute("href") === "/a", opacity:/^0.55/.test(e.style.opacity), cssFloat:!!e.style.cssFloat, checkOn:i.value === "on", optSelected:h.selected, getSetAttribute:q.className !== 
    "t", enctype:!!c.createElement("form").enctype, html5Clone:c.createElement("nav").cloneNode(!0).outerHTML !== "<:nav></:nav>", submitBubbles:!0, changeBubbles:!0, focusinBubbles:!1, deleteExpando:!0, noCloneEvent:!0, inlineBlockNeedsLayout:!1, shrinkWrapBlocks:!1, reliableMarginRight:!0}, i.checked = !0, b.noCloneChecked = i.cloneNode(!0).checked, g.disabled = !0, b.optDisabled = !h.disabled;
    try {
      delete q.test
    }catch(s) {
      b.deleteExpando = !1
    }
    !q.addEventListener && q.attachEvent && q.fireEvent && (q.attachEvent("onclick", function() {
      b.noCloneEvent = !1
    }), q.cloneNode(!0).fireEvent("onclick")), i = c.createElement("input"), i.value = "t", i.setAttribute("type", "radio"), b.radioValue = i.value === "t", i.setAttribute("checked", "checked"), q.appendChild(i), k = c.createDocumentFragment(), k.appendChild(q.lastChild), b.checkClone = k.cloneNode(!0).cloneNode(!0).lastChild.checked, b.appendChecked = i.checked, k.removeChild(i), k.appendChild(q), q.innerHTML = "", a.getComputedStyle && (j = c.createElement("div"), j.style.width = "0", j.style.marginRight = 
    "0", q.style.width = "2px", q.appendChild(j), b.reliableMarginRight = (parseInt((a.getComputedStyle(j, null) || {marginRight:0}).marginRight, 10) || 0) === 0);
    if(q.attachEvent) {
      for(o in{submit:1, change:1, focusin:1}) {
        n = "on" + o, p = n in q, p || (q.setAttribute(n, "return;"), p = typeof q[n] == "function"), b[o + "Bubbles"] = p
      }
    }
    k.removeChild(q), k = g = h = j = q = i = null, f(function() {
      var a, d, e, g, h, i, j, k, m, n, o, r = c.getElementsByTagName("body")[0];
      !r || (j = 1, k = "position:absolute;top:0;left:0;width:1px;height:1px;margin:0;", m = "visibility:hidden;border:0;", n = "style='" + k + "border:5px solid #000;padding:0;'", o = "<div " + n + "><div></div></div>" + "<table " + n + " cellpadding='0' cellspacing='0'>" + "<tr><td></td></tr></table>", a = c.createElement("div"), a.style.cssText = m + "width:0;height:0;position:static;top:0;margin-top:" + j + "px", r.insertBefore(a, r.firstChild), q = c.createElement("div"), a.appendChild(q), q.innerHTML = 
      "<table><tr><td style='padding:0;border:0;display:none'></td><td>t</td></tr></table>", l = q.getElementsByTagName("td"), p = l[0].offsetHeight === 0, l[0].style.display = "", l[1].style.display = "none", b.reliableHiddenOffsets = p && l[0].offsetHeight === 0, q.innerHTML = "", q.style.width = q.style.paddingLeft = "1px", f.boxModel = b.boxModel = q.offsetWidth === 2, typeof q.style.zoom != "undefined" && (q.style.display = "inline", q.style.zoom = 1, b.inlineBlockNeedsLayout = q.offsetWidth === 
      2, q.style.display = "", q.innerHTML = "<div style='width:4px;'></div>", b.shrinkWrapBlocks = q.offsetWidth !== 2), q.style.cssText = k + m, q.innerHTML = o, d = q.firstChild, e = d.firstChild, h = d.nextSibling.firstChild.firstChild, i = {doesNotAddBorder:e.offsetTop !== 5, doesAddBorderForTableAndCells:h.offsetTop === 5}, e.style.position = "fixed", e.style.top = "20px", i.fixedPosition = e.offsetTop === 20 || e.offsetTop === 15, e.style.position = e.style.top = "", d.style.overflow = "hidden", 
      d.style.position = "relative", i.subtractsBorderForOverflowNotVisible = e.offsetTop === -5, i.doesNotIncludeMarginInBodyOffset = r.offsetTop !== j, r.removeChild(a), q = a = null, f.extend(b, i))
    });
    return b
  }();
  var j = /^(?:\{.*\}|\[.*\])$/, k = /([A-Z])/g;
  f.extend({cache:{}, uuid:0, expando:"jQuery" + (f.fn.jquery + Math.random()).replace(/\D/g, ""), noData:{embed:!0, object:"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000", applet:!0}, hasData:function(a) {
    a = a.nodeType ? f.cache[a[f.expando]] : a[f.expando];
    return!!a && !m(a)
  }, data:function(a, c, d, e) {
    if(!!f.acceptData(a)) {
      var g, h, i, j = f.expando, k = typeof c == "string", l = a.nodeType, m = l ? f.cache : a, n = l ? a[j] : a[j] && j, o = c === "events";
      if((!n || !m[n] || !o && !e && !m[n].data) && k && d === b) {
        return
      }
      n || (l ? a[j] = n = ++f.uuid : n = j), m[n] || (m[n] = {}, l || (m[n].toJSON = f.noop));
      if(typeof c == "object" || typeof c == "function") {
        e ? m[n] = f.extend(m[n], c) : m[n].data = f.extend(m[n].data, c)
      }
      g = h = m[n], e || (h.data || (h.data = {}), h = h.data), d !== b && (h[f.camelCase(c)] = d);
      if(o && !h[c]) {
        return g.events
      }
      k ? (i = h[c], i == null && (i = h[f.camelCase(c)])) : i = h;
      return i
    }
  }, removeData:function(a, b, c) {
    if(!!f.acceptData(a)) {
      var d, e, g, h = f.expando, i = a.nodeType, j = i ? f.cache : a, k = i ? a[h] : h;
      if(!j[k]) {
        return
      }
      if(b) {
        d = c ? j[k] : j[k].data;
        if(d) {
          f.isArray(b) || (b in d ? b = [b] : (b = f.camelCase(b), b in d ? b = [b] : b = b.split(" ")));
          for(e = 0, g = b.length;e < g;e++) {
            delete d[b[e]]
          }
          if(!(c ? m : f.isEmptyObject)(d)) {
            return
          }
        }
      }
      if(!c) {
        delete j[k].data;
        if(!m(j[k])) {
          return
        }
      }
      f.support.deleteExpando || !j.setInterval ? delete j[k] : j[k] = null, i && (f.support.deleteExpando ? delete a[h] : a.removeAttribute ? a.removeAttribute(h) : a[h] = null)
    }
  }, _data:function(a, b, c) {
    return f.data(a, b, c, !0)
  }, acceptData:function(a) {
    if(a.nodeName) {
      var b = f.noData[a.nodeName.toLowerCase()];
      if(b) {
        return b !== !0 && a.getAttribute("classid") === b
      }
    }
    return!0
  }}), f.fn.extend({data:function(a, c) {
    var d, e, g, h = null;
    if(typeof a == "undefined") {
      if(this.length) {
        h = f.data(this[0]);
        if(this[0].nodeType === 1 && !f._data(this[0], "parsedAttrs")) {
          e = this[0].attributes;
          for(var i = 0, j = e.length;i < j;i++) {
            g = e[i].name, g.indexOf("data-") === 0 && (g = f.camelCase(g.substring(5)), l(this[0], g, h[g]))
          }
          f._data(this[0], "parsedAttrs", !0)
        }
      }
      return h
    }
    if(typeof a == "object") {
      return this.each(function() {
        f.data(this, a)
      })
    }
    d = a.split("."), d[1] = d[1] ? "." + d[1] : "";
    if(c === b) {
      h = this.triggerHandler("getData" + d[1] + "!", [d[0]]), h === b && this.length && (h = f.data(this[0], a), h = l(this[0], a, h));
      return h === b && d[1] ? this.data(d[0]) : h
    }
    return this.each(function() {
      var b = f(this), e = [d[0], c];
      b.triggerHandler("setData" + d[1] + "!", e), f.data(this, a, c), b.triggerHandler("changeData" + d[1] + "!", e)
    })
  }, removeData:function(a) {
    return this.each(function() {
      f.removeData(this, a)
    })
  }}), f.extend({_mark:function(a, b) {
    a && (b = (b || "fx") + "mark", f._data(a, b, (f._data(a, b) || 0) + 1))
  }, _unmark:function(a, b, c) {
    a !== !0 && (c = b, b = a, a = !1);
    if(b) {
      c = c || "fx";
      var d = c + "mark", e = a ? 0 : (f._data(b, d) || 1) - 1;
      e ? f._data(b, d, e) : (f.removeData(b, d, !0), n(b, c, "mark"))
    }
  }, queue:function(a, b, c) {
    var d;
    if(a) {
      b = (b || "fx") + "queue", d = f._data(a, b), c && (!d || f.isArray(c) ? d = f._data(a, b, f.makeArray(c)) : d.push(c));
      return d || []
    }
  }, dequeue:function(a, b) {
    b = b || "fx";
    var c = f.queue(a, b), d = c.shift(), e = {};
    d === "inprogress" && (d = c.shift()), d && (b === "fx" && c.unshift("inprogress"), f._data(a, b + ".run", e), d.call(a, function() {
      f.dequeue(a, b)
    }, e)), c.length || (f.removeData(a, b + "queue " + b + ".run", !0), n(a, b, "queue"))
  }}), f.fn.extend({queue:function(a, c) {
    typeof a != "string" && (c = a, a = "fx");
    if(c === b) {
      return f.queue(this[0], a)
    }
    return this.each(function() {
      var b = f.queue(this, a, c);
      a === "fx" && b[0] !== "inprogress" && f.dequeue(this, a)
    })
  }, dequeue:function(a) {
    return this.each(function() {
      f.dequeue(this, a)
    })
  }, delay:function(a, b) {
    a = f.fx ? f.fx.speeds[a] || a : a, b = b || "fx";
    return this.queue(b, function(b, c) {
      var d = setTimeout(b, a);
      c.stop = function() {
        clearTimeout(d)
      }
    })
  }, clearQueue:function(a) {
    return this.queue(a || "fx", [])
  }, promise:function(a, c) {
    function m() {
      --h || d.resolveWith(e, [e])
    }
    typeof a != "string" && (c = a, a = b), a = a || "fx";
    var d = f.Deferred(), e = this, g = e.length, h = 1, i = a + "defer", j = a + "queue", k = a + "mark", l;
    while(g--) {
      if(l = f.data(e[g], i, b, !0) || (f.data(e[g], j, b, !0) || f.data(e[g], k, b, !0)) && f.data(e[g], i, f.Callbacks("once memory"), !0)) {
        h++, l.add(m)
      }
    }
    m();
    return d.promise()
  }});
  var o = /[\n\t\r]/g, p = /\s+/, q = /\r/g, r = /^(?:button|input)$/i, s = /^(?:button|input|object|select|textarea)$/i, t = /^a(?:rea)?$/i, u = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i, v = f.support.getSetAttribute, w, x, y;
  f.fn.extend({attr:function(a, b) {
    return f.access(this, a, b, !0, f.attr)
  }, removeAttr:function(a) {
    return this.each(function() {
      f.removeAttr(this, a)
    })
  }, prop:function(a, b) {
    return f.access(this, a, b, !0, f.prop)
  }, removeProp:function(a) {
    a = f.propFix[a] || a;
    return this.each(function() {
      try {
        this[a] = b, delete this[a]
      }catch(c) {
      }
    })
  }, addClass:function(a) {
    var b, c, d, e, g, h, i;
    if(f.isFunction(a)) {
      return this.each(function(b) {
        f(this).addClass(a.call(this, b, this.className))
      })
    }
    if(a && typeof a == "string") {
      b = a.split(p);
      for(c = 0, d = this.length;c < d;c++) {
        e = this[c];
        if(e.nodeType === 1) {
          if(!e.className && b.length === 1) {
            e.className = a
          }else {
            g = " " + e.className + " ";
            for(h = 0, i = b.length;h < i;h++) {
              ~g.indexOf(" " + b[h] + " ") || (g += b[h] + " ")
            }
            e.className = f.trim(g)
          }
        }
      }
    }
    return this
  }, removeClass:function(a) {
    var c, d, e, g, h, i, j;
    if(f.isFunction(a)) {
      return this.each(function(b) {
        f(this).removeClass(a.call(this, b, this.className))
      })
    }
    if(a && typeof a == "string" || a === b) {
      c = (a || "").split(p);
      for(d = 0, e = this.length;d < e;d++) {
        g = this[d];
        if(g.nodeType === 1 && g.className) {
          if(a) {
            h = (" " + g.className + " ").replace(o, " ");
            for(i = 0, j = c.length;i < j;i++) {
              h = h.replace(" " + c[i] + " ", " ")
            }
            g.className = f.trim(h)
          }else {
            g.className = ""
          }
        }
      }
    }
    return this
  }, toggleClass:function(a, b) {
    var c = typeof a, d = typeof b == "boolean";
    if(f.isFunction(a)) {
      return this.each(function(c) {
        f(this).toggleClass(a.call(this, c, this.className, b), b)
      })
    }
    return this.each(function() {
      if(c === "string") {
        var e, g = 0, h = f(this), i = b, j = a.split(p);
        while(e = j[g++]) {
          i = d ? i : !h.hasClass(e), h[i ? "addClass" : "removeClass"](e)
        }
      }else {
        if(c === "undefined" || c === "boolean") {
          this.className && f._data(this, "__className__", this.className), this.className = this.className || a === !1 ? "" : f._data(this, "__className__") || ""
        }
      }
    })
  }, hasClass:function(a) {
    var b = " " + a + " ", c = 0, d = this.length;
    for(;c < d;c++) {
      if(this[c].nodeType === 1 && (" " + this[c].className + " ").replace(o, " ").indexOf(b) > -1) {
        return!0
      }
    }
    return!1
  }, val:function(a) {
    var c, d, e, g = this[0];
    if(!!arguments.length) {
      e = f.isFunction(a);
      return this.each(function(d) {
        var g = f(this), h;
        if(this.nodeType === 1) {
          e ? h = a.call(this, d, g.val()) : h = a, h == null ? h = "" : typeof h == "number" ? h += "" : f.isArray(h) && (h = f.map(h, function(a) {
            return a == null ? "" : a + ""
          })), c = f.valHooks[this.nodeName.toLowerCase()] || f.valHooks[this.type];
          if(!c || !("set" in c) || c.set(this, h, "value") === b) {
            this.value = h
          }
        }
      })
    }
    if(g) {
      c = f.valHooks[g.nodeName.toLowerCase()] || f.valHooks[g.type];
      if(c && "get" in c && (d = c.get(g, "value")) !== b) {
        return d
      }
      d = g.value;
      return typeof d == "string" ? d.replace(q, "") : d == null ? "" : d
    }
  }}), f.extend({valHooks:{option:{get:function(a) {
    var b = a.attributes.value;
    return!b || b.specified ? a.value : a.text
  }}, select:{get:function(a) {
    var b, c, d, e, g = a.selectedIndex, h = [], i = a.options, j = a.type === "select-one";
    if(g < 0) {
      return null
    }
    c = j ? g : 0, d = j ? g + 1 : i.length;
    for(;c < d;c++) {
      e = i[c];
      if(e.selected && (f.support.optDisabled ? !e.disabled : e.getAttribute("disabled") === null) && (!e.parentNode.disabled || !f.nodeName(e.parentNode, "optgroup"))) {
        b = f(e).val();
        if(j) {
          return b
        }
        h.push(b)
      }
    }
    if(j && !h.length && i.length) {
      return f(i[g]).val()
    }
    return h
  }, set:function(a, b) {
    var c = f.makeArray(b);
    f(a).find("option").each(function() {
      this.selected = f.inArray(f(this).val(), c) >= 0
    }), c.length || (a.selectedIndex = -1);
    return c
  }}}, attrFn:{val:!0, css:!0, html:!0, text:!0, data:!0, width:!0, height:!0, offset:!0}, attr:function(a, c, d, e) {
    var g, h, i, j = a.nodeType;
    if(!!a && j !== 3 && j !== 8 && j !== 2) {
      if(e && c in f.attrFn) {
        return f(a)[c](d)
      }
      if(typeof a.getAttribute == "undefined") {
        return f.prop(a, c, d)
      }
      i = j !== 1 || !f.isXMLDoc(a), i && (c = c.toLowerCase(), h = f.attrHooks[c] || (u.test(c) ? x : w));
      if(d !== b) {
        if(d === null) {
          f.removeAttr(a, c);
          return
        }
        if(h && "set" in h && i && (g = h.set(a, d, c)) !== b) {
          return g
        }
        a.setAttribute(c, "" + d);
        return d
      }
      if(h && "get" in h && i && (g = h.get(a, c)) !== null) {
        return g
      }
      g = a.getAttribute(c);
      return g === null ? b : g
    }
  }, removeAttr:function(a, b) {
    var c, d, e, g, h = 0;
    if(b && a.nodeType === 1) {
      d = b.toLowerCase().split(p), g = d.length;
      for(;h < g;h++) {
        e = d[h], e && (c = f.propFix[e] || e, f.attr(a, e, ""), a.removeAttribute(v ? e : c), u.test(e) && c in a && (a[c] = !1))
      }
    }
  }, attrHooks:{type:{set:function(a, b) {
    if(r.test(a.nodeName) && a.parentNode) {
      f.error("type property can't be changed")
    }else {
      if(!f.support.radioValue && b === "radio" && f.nodeName(a, "input")) {
        var c = a.value;
        a.setAttribute("type", b), c && (a.value = c);
        return b
      }
    }
  }}, value:{get:function(a, b) {
    if(w && f.nodeName(a, "button")) {
      return w.get(a, b)
    }
    return b in a ? a.value : null
  }, set:function(a, b, c) {
    if(w && f.nodeName(a, "button")) {
      return w.set(a, b, c)
    }
    a.value = b
  }}}, propFix:{tabindex:"tabIndex", readonly:"readOnly", "for":"htmlFor", "class":"className", maxlength:"maxLength", cellspacing:"cellSpacing", cellpadding:"cellPadding", rowspan:"rowSpan", colspan:"colSpan", usemap:"useMap", frameborder:"frameBorder", contenteditable:"contentEditable"}, prop:function(a, c, d) {
    var e, g, h, i = a.nodeType;
    if(!!a && i !== 3 && i !== 8 && i !== 2) {
      h = i !== 1 || !f.isXMLDoc(a), h && (c = f.propFix[c] || c, g = f.propHooks[c]);
      return d !== b ? g && "set" in g && (e = g.set(a, d, c)) !== b ? e : a[c] = d : g && "get" in g && (e = g.get(a, c)) !== null ? e : a[c]
    }
  }, propHooks:{tabIndex:{get:function(a) {
    var c = a.getAttributeNode("tabindex");
    return c && c.specified ? parseInt(c.value, 10) : s.test(a.nodeName) || t.test(a.nodeName) && a.href ? 0 : b
  }}}}), f.attrHooks.tabindex = f.propHooks.tabIndex, x = {get:function(a, c) {
    var d, e = f.prop(a, c);
    return e === !0 || typeof e != "boolean" && (d = a.getAttributeNode(c)) && d.nodeValue !== !1 ? c.toLowerCase() : b
  }, set:function(a, b, c) {
    var d;
    b === !1 ? f.removeAttr(a, c) : (d = f.propFix[c] || c, d in a && (a[d] = !0), a.setAttribute(c, c.toLowerCase()));
    return c
  }}, v || (y = {name:!0, id:!0}, w = f.valHooks.button = {get:function(a, c) {
    var d;
    d = a.getAttributeNode(c);
    return d && (y[c] ? d.nodeValue !== "" : d.specified) ? d.nodeValue : b
  }, set:function(a, b, d) {
    var e = a.getAttributeNode(d);
    e || (e = c.createAttribute(d), a.setAttributeNode(e));
    return e.nodeValue = b + ""
  }}, f.attrHooks.tabindex.set = w.set, f.each(["width", "height"], function(a, b) {
    f.attrHooks[b] = f.extend(f.attrHooks[b], {set:function(a, c) {
      if(c === "") {
        a.setAttribute(b, "auto");
        return c
      }
    }})
  }), f.attrHooks.contenteditable = {get:w.get, set:function(a, b, c) {
    b === "" && (b = "false"), w.set(a, b, c)
  }}), f.support.hrefNormalized || f.each(["href", "src", "width", "height"], function(a, c) {
    f.attrHooks[c] = f.extend(f.attrHooks[c], {get:function(a) {
      var d = a.getAttribute(c, 2);
      return d === null ? b : d
    }})
  }), f.support.style || (f.attrHooks.style = {get:function(a) {
    return a.style.cssText.toLowerCase() || b
  }, set:function(a, b) {
    return a.style.cssText = "" + b
  }}), f.support.optSelected || (f.propHooks.selected = f.extend(f.propHooks.selected, {get:function(a) {
    var b = a.parentNode;
    b && (b.selectedIndex, b.parentNode && b.parentNode.selectedIndex);
    return null
  }})), f.support.enctype || (f.propFix.enctype = "encoding"), f.support.checkOn || f.each(["radio", "checkbox"], function() {
    f.valHooks[this] = {get:function(a) {
      return a.getAttribute("value") === null ? "on" : a.value
    }}
  }), f.each(["radio", "checkbox"], function() {
    f.valHooks[this] = f.extend(f.valHooks[this], {set:function(a, b) {
      if(f.isArray(b)) {
        return a.checked = f.inArray(f(a).val(), b) >= 0
      }
    }})
  });
  var z = /^(?:textarea|input|select)$/i, A = /^([^\.]*)?(?:\.(.+))?$/, B = /\bhover(\.\S+)?\b/, C = /^key/, D = /^(?:mouse|contextmenu)|click/, E = /^(?:focusinfocus|focusoutblur)$/, F = /^(\w*)(?:#([\w\-]+))?(?:\.([\w\-]+))?$/, G = function(a) {
    var b = F.exec(a);
    b && (b[1] = (b[1] || "").toLowerCase(), b[3] = b[3] && new RegExp("(?:^|\\s)" + b[3] + "(?:\\s|$)"));
    return b
  }, H = function(a, b) {
    var c = a.attributes || {};
    return(!b[1] || a.nodeName.toLowerCase() === b[1]) && (!b[2] || (c.id || {}).value === b[2]) && (!b[3] || b[3].test((c["class"] || {}).value))
  }, I = function(a) {
    return f.event.special.hover ? a : a.replace(B, "mouseenter$1 mouseleave$1")
  };
  f.event = {add:function(a, c, d, e, g) {
    var h, i, j, k, l, m, n, o, p, q, r, s;
    if(!(a.nodeType === 3 || a.nodeType === 8 || !c || !d || !(h = f._data(a)))) {
      d.handler && (p = d, d = p.handler), d.guid || (d.guid = f.guid++), j = h.events, j || (h.events = j = {}), i = h.handle, i || (h.handle = i = function(a) {
        return typeof f != "undefined" && (!a || f.event.triggered !== a.type) ? f.event.dispatch.apply(i.elem, arguments) : b
      }, i.elem = a), c = f.trim(I(c)).split(" ");
      for(k = 0;k < c.length;k++) {
        l = A.exec(c[k]) || [], m = l[1], n = (l[2] || "").split(".").sort(), s = f.event.special[m] || {}, m = (g ? s.delegateType : s.bindType) || m, s = f.event.special[m] || {}, o = f.extend({type:m, origType:l[1], data:e, handler:d, guid:d.guid, selector:g, quick:G(g), namespace:n.join(".")}, p), r = j[m];
        if(!r) {
          r = j[m] = [], r.delegateCount = 0;
          if(!s.setup || s.setup.call(a, e, n, i) === !1) {
            a.addEventListener ? a.addEventListener(m, i, !1) : a.attachEvent && a.attachEvent("on" + m, i)
          }
        }
        s.add && (s.add.call(a, o), o.handler.guid || (o.handler.guid = d.guid)), g ? r.splice(r.delegateCount++, 0, o) : r.push(o), f.event.global[m] = !0
      }
      a = null
    }
  }, global:{}, remove:function(a, b, c, d, e) {
    var g = f.hasData(a) && f._data(a), h, i, j, k, l, m, n, o, p, q, r, s;
    if(!!g && !!(o = g.events)) {
      b = f.trim(I(b || "")).split(" ");
      for(h = 0;h < b.length;h++) {
        i = A.exec(b[h]) || [], j = k = i[1], l = i[2];
        if(!j) {
          for(j in o) {
            f.event.remove(a, j + b[h], c, d, !0)
          }
          continue
        }
        p = f.event.special[j] || {}, j = (d ? p.delegateType : p.bindType) || j, r = o[j] || [], m = r.length, l = l ? new RegExp("(^|\\.)" + l.split(".").sort().join("\\.(?:.*\\.)?") + "(\\.|$)") : null;
        for(n = 0;n < r.length;n++) {
          s = r[n], (e || k === s.origType) && (!c || c.guid === s.guid) && (!l || l.test(s.namespace)) && (!d || d === s.selector || d === "**" && s.selector) && (r.splice(n--, 1), s.selector && r.delegateCount--, p.remove && p.remove.call(a, s))
        }
        r.length === 0 && m !== r.length && ((!p.teardown || p.teardown.call(a, l) === !1) && f.removeEvent(a, j, g.handle), delete o[j])
      }
      f.isEmptyObject(o) && (q = g.handle, q && (q.elem = null), f.removeData(a, ["events", "handle"], !0))
    }
  }, customEvent:{getData:!0, setData:!0, changeData:!0}, trigger:function(c, d, e, g) {
    if(!e || e.nodeType !== 3 && e.nodeType !== 8) {
      var h = c.type || c, i = [], j, k, l, m, n, o, p, q, r, s;
      if(E.test(h + f.event.triggered)) {
        return
      }
      h.indexOf("!") >= 0 && (h = h.slice(0, -1), k = !0), h.indexOf(".") >= 0 && (i = h.split("."), h = i.shift(), i.sort());
      if((!e || f.event.customEvent[h]) && !f.event.global[h]) {
        return
      }
      c = typeof c == "object" ? c[f.expando] ? c : new f.Event(h, c) : new f.Event(h), c.type = h, c.isTrigger = !0, c.exclusive = k, c.namespace = i.join("."), c.namespace_re = c.namespace ? new RegExp("(^|\\.)" + i.join("\\.(?:.*\\.)?") + "(\\.|$)") : null, o = h.indexOf(":") < 0 ? "on" + h : "";
      if(!e) {
        j = f.cache;
        for(l in j) {
          j[l].events && j[l].events[h] && f.event.trigger(c, d, j[l].handle.elem, !0)
        }
        return
      }
      c.result = b, c.target || (c.target = e), d = d != null ? f.makeArray(d) : [], d.unshift(c), p = f.event.special[h] || {};
      if(p.trigger && p.trigger.apply(e, d) === !1) {
        return
      }
      r = [[e, p.bindType || h]];
      if(!g && !p.noBubble && !f.isWindow(e)) {
        s = p.delegateType || h, m = E.test(s + h) ? e : e.parentNode, n = null;
        for(;m;m = m.parentNode) {
          r.push([m, s]), n = m
        }
        n && n === e.ownerDocument && r.push([n.defaultView || n.parentWindow || a, s])
      }
      for(l = 0;l < r.length && !c.isPropagationStopped();l++) {
        m = r[l][0], c.type = r[l][1], q = (f._data(m, "events") || {})[c.type] && f._data(m, "handle"), q && q.apply(m, d), q = o && m[o], q && f.acceptData(m) && q.apply(m, d) === !1 && c.preventDefault()
      }
      c.type = h, !g && !c.isDefaultPrevented() && (!p._default || p._default.apply(e.ownerDocument, d) === !1) && (h !== "click" || !f.nodeName(e, "a")) && f.acceptData(e) && o && e[h] && (h !== "focus" && h !== "blur" || c.target.offsetWidth !== 0) && !f.isWindow(e) && (n = e[o], n && (e[o] = null), f.event.triggered = h, e[h](), f.event.triggered = b, n && (e[o] = n));
      return c.result
    }
  }, dispatch:function(c) {
    c = f.event.fix(c || a.event);
    var d = (f._data(this, "events") || {})[c.type] || [], e = d.delegateCount, g = [].slice.call(arguments, 0), h = !c.exclusive && !c.namespace, i = [], j, k, l, m, n, o, p, q, r, s, t;
    g[0] = c, c.delegateTarget = this;
    if(e && !c.target.disabled && (!c.button || c.type !== "click")) {
      m = f(this), m.context = this.ownerDocument || this;
      for(l = c.target;l != this;l = l.parentNode || this) {
        o = {}, q = [], m[0] = l;
        for(j = 0;j < e;j++) {
          r = d[j], s = r.selector, o[s] === b && (o[s] = r.quick ? H(l, r.quick) : m.is(s)), o[s] && q.push(r)
        }
        q.length && i.push({elem:l, matches:q})
      }
    }
    d.length > e && i.push({elem:this, matches:d.slice(e)});
    for(j = 0;j < i.length && !c.isPropagationStopped();j++) {
      p = i[j], c.currentTarget = p.elem;
      for(k = 0;k < p.matches.length && !c.isImmediatePropagationStopped();k++) {
        r = p.matches[k];
        if(h || !c.namespace && !r.namespace || c.namespace_re && c.namespace_re.test(r.namespace)) {
          c.data = r.data, c.handleObj = r, n = ((f.event.special[r.origType] || {}).handle || r.handler).apply(p.elem, g), n !== b && (c.result = n, n === !1 && (c.preventDefault(), c.stopPropagation()))
        }
      }
    }
    return c.result
  }, props:"attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "), fixHooks:{}, keyHooks:{props:"char charCode key keyCode".split(" "), filter:function(a, b) {
    a.which == null && (a.which = b.charCode != null ? b.charCode : b.keyCode);
    return a
  }}, mouseHooks:{props:"button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "), filter:function(a, d) {
    var e, f, g, h = d.button, i = d.fromElement;
    a.pageX == null && d.clientX != null && (e = a.target.ownerDocument || c, f = e.documentElement, g = e.body, a.pageX = d.clientX + (f && f.scrollLeft || g && g.scrollLeft || 0) - (f && f.clientLeft || g && g.clientLeft || 0), a.pageY = d.clientY + (f && f.scrollTop || g && g.scrollTop || 0) - (f && f.clientTop || g && g.clientTop || 0)), !a.relatedTarget && i && (a.relatedTarget = i === a.target ? d.toElement : i), !a.which && h !== b && (a.which = h & 1 ? 1 : h & 2 ? 3 : h & 4 ? 2 : 0);
    return a
  }}, fix:function(a) {
    if(a[f.expando]) {
      return a
    }
    var d, e, g = a, h = f.event.fixHooks[a.type] || {}, i = h.props ? this.props.concat(h.props) : this.props;
    a = f.Event(g);
    for(d = i.length;d;) {
      e = i[--d], a[e] = g[e]
    }
    a.target || (a.target = g.srcElement || c), a.target.nodeType === 3 && (a.target = a.target.parentNode), a.metaKey === b && (a.metaKey = a.ctrlKey);
    return h.filter ? h.filter(a, g) : a
  }, special:{ready:{setup:f.bindReady}, load:{noBubble:!0}, focus:{delegateType:"focusin"}, blur:{delegateType:"focusout"}, beforeunload:{setup:function(a, b, c) {
    f.isWindow(this) && (this.onbeforeunload = c)
  }, teardown:function(a, b) {
    this.onbeforeunload === b && (this.onbeforeunload = null)
  }}}, simulate:function(a, b, c, d) {
    var e = f.extend(new f.Event, c, {type:a, isSimulated:!0, originalEvent:{}});
    d ? f.event.trigger(e, null, b) : f.event.dispatch.call(b, e), e.isDefaultPrevented() && c.preventDefault()
  }}, f.event.handle = f.event.dispatch, f.removeEvent = c.removeEventListener ? function(a, b, c) {
    a.removeEventListener && a.removeEventListener(b, c, !1)
  } : function(a, b, c) {
    a.detachEvent && a.detachEvent("on" + b, c)
  }, f.Event = function(a, b) {
    if(!(this instanceof f.Event)) {
      return new f.Event(a, b)
    }
    a && a.type ? (this.originalEvent = a, this.type = a.type, this.isDefaultPrevented = a.defaultPrevented || a.returnValue === !1 || a.getPreventDefault && a.getPreventDefault() ? K : J) : this.type = a, b && f.extend(this, b), this.timeStamp = a && a.timeStamp || f.now(), this[f.expando] = !0
  }, f.Event.prototype = {preventDefault:function() {
    this.isDefaultPrevented = K;
    var a = this.originalEvent;
    !a || (a.preventDefault ? a.preventDefault() : a.returnValue = !1)
  }, stopPropagation:function() {
    this.isPropagationStopped = K;
    var a = this.originalEvent;
    !a || (a.stopPropagation && a.stopPropagation(), a.cancelBubble = !0)
  }, stopImmediatePropagation:function() {
    this.isImmediatePropagationStopped = K, this.stopPropagation()
  }, isDefaultPrevented:J, isPropagationStopped:J, isImmediatePropagationStopped:J}, f.each({mouseenter:"mouseover", mouseleave:"mouseout"}, function(a, b) {
    f.event.special[a] = {delegateType:b, bindType:b, handle:function(a) {
      var c = this, d = a.relatedTarget, e = a.handleObj, g = e.selector, h;
      if(!d || d !== c && !f.contains(c, d)) {
        a.type = e.origType, h = e.handler.apply(this, arguments), a.type = b
      }
      return h
    }}
  }), f.support.submitBubbles || (f.event.special.submit = {setup:function() {
    if(f.nodeName(this, "form")) {
      return!1
    }
    f.event.add(this, "click._submit keypress._submit", function(a) {
      var c = a.target, d = f.nodeName(c, "input") || f.nodeName(c, "button") ? c.form : b;
      d && !d._submit_attached && (f.event.add(d, "submit._submit", function(a) {
        this.parentNode && !a.isTrigger && f.event.simulate("submit", this.parentNode, a, !0)
      }), d._submit_attached = !0)
    })
  }, teardown:function() {
    if(f.nodeName(this, "form")) {
      return!1
    }
    f.event.remove(this, "._submit")
  }}), f.support.changeBubbles || (f.event.special.change = {setup:function() {
    if(z.test(this.nodeName)) {
      if(this.type === "checkbox" || this.type === "radio") {
        f.event.add(this, "propertychange._change", function(a) {
          a.originalEvent.propertyName === "checked" && (this._just_changed = !0)
        }), f.event.add(this, "click._change", function(a) {
          this._just_changed && !a.isTrigger && (this._just_changed = !1, f.event.simulate("change", this, a, !0))
        })
      }
      return!1
    }
    f.event.add(this, "beforeactivate._change", function(a) {
      var b = a.target;
      z.test(b.nodeName) && !b._change_attached && (f.event.add(b, "change._change", function(a) {
        this.parentNode && !a.isSimulated && !a.isTrigger && f.event.simulate("change", this.parentNode, a, !0)
      }), b._change_attached = !0)
    })
  }, handle:function(a) {
    var b = a.target;
    if(this !== b || a.isSimulated || a.isTrigger || b.type !== "radio" && b.type !== "checkbox") {
      return a.handleObj.handler.apply(this, arguments)
    }
  }, teardown:function() {
    f.event.remove(this, "._change");
    return z.test(this.nodeName)
  }}), f.support.focusinBubbles || f.each({focus:"focusin", blur:"focusout"}, function(a, b) {
    var d = 0, e = function(a) {
      f.event.simulate(b, a.target, f.event.fix(a), !0)
    };
    f.event.special[b] = {setup:function() {
      d++ === 0 && c.addEventListener(a, e, !0)
    }, teardown:function() {
      --d === 0 && c.removeEventListener(a, e, !0)
    }}
  }), f.fn.extend({on:function(a, c, d, e, g) {
    var h, i;
    if(typeof a == "object") {
      typeof c != "string" && (d = c, c = b);
      for(i in a) {
        this.on(i, c, d, a[i], g)
      }
      return this
    }
    d == null && e == null ? (e = c, d = c = b) : e == null && (typeof c == "string" ? (e = d, d = b) : (e = d, d = c, c = b));
    if(e === !1) {
      e = J
    }else {
      if(!e) {
        return this
      }
    }
    g === 1 && (h = e, e = function(a) {
      f().off(a);
      return h.apply(this, arguments)
    }, e.guid = h.guid || (h.guid = f.guid++));
    return this.each(function() {
      f.event.add(this, a, e, d, c)
    })
  }, one:function(a, b, c, d) {
    return this.on.call(this, a, b, c, d, 1)
  }, off:function(a, c, d) {
    if(a && a.preventDefault && a.handleObj) {
      var e = a.handleObj;
      f(a.delegateTarget).off(e.namespace ? e.type + "." + e.namespace : e.type, e.selector, e.handler);
      return this
    }
    if(typeof a == "object") {
      for(var g in a) {
        this.off(g, c, a[g])
      }
      return this
    }
    if(c === !1 || typeof c == "function") {
      d = c, c = b
    }
    d === !1 && (d = J);
    return this.each(function() {
      f.event.remove(this, a, d, c)
    })
  }, bind:function(a, b, c) {
    return this.on(a, null, b, c)
  }, unbind:function(a, b) {
    return this.off(a, null, b)
  }, live:function(a, b, c) {
    f(this.context).on(a, this.selector, b, c);
    return this
  }, die:function(a, b) {
    f(this.context).off(a, this.selector || "**", b);
    return this
  }, delegate:function(a, b, c, d) {
    return this.on(b, a, c, d)
  }, undelegate:function(a, b, c) {
    return arguments.length == 1 ? this.off(a, "**") : this.off(b, a, c)
  }, trigger:function(a, b) {
    return this.each(function() {
      f.event.trigger(a, b, this)
    })
  }, triggerHandler:function(a, b) {
    if(this[0]) {
      return f.event.trigger(a, b, this[0], !0)
    }
  }, toggle:function(a) {
    var b = arguments, c = a.guid || f.guid++, d = 0, e = function(c) {
      var e = (f._data(this, "lastToggle" + a.guid) || 0) % d;
      f._data(this, "lastToggle" + a.guid, e + 1), c.preventDefault();
      return b[e].apply(this, arguments) || !1
    };
    e.guid = c;
    while(d < b.length) {
      b[d++].guid = c
    }
    return this.click(e)
  }, hover:function(a, b) {
    return this.mouseenter(a).mouseleave(b || a)
  }}), f.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function(a, b) {
    f.fn[b] = function(a, c) {
      c == null && (c = a, a = null);
      return arguments.length > 0 ? this.on(b, null, a, c) : this.trigger(b)
    }, f.attrFn && (f.attrFn[b] = !0), C.test(b) && (f.event.fixHooks[b] = f.event.keyHooks), D.test(b) && (f.event.fixHooks[b] = f.event.mouseHooks)
  }), function() {
    function x(a, b, c, e, f, g) {
      for(var h = 0, i = e.length;h < i;h++) {
        var j = e[h];
        if(j) {
          var k = !1;
          j = j[a];
          while(j) {
            if(j[d] === c) {
              k = e[j.sizset];
              break
            }
            if(j.nodeType === 1) {
              g || (j[d] = c, j.sizset = h);
              if(typeof b != "string") {
                if(j === b) {
                  k = !0;
                  break
                }
              }else {
                if(m.filter(b, [j]).length > 0) {
                  k = j;
                  break
                }
              }
            }
            j = j[a]
          }
          e[h] = k
        }
      }
    }
    function w(a, b, c, e, f, g) {
      for(var h = 0, i = e.length;h < i;h++) {
        var j = e[h];
        if(j) {
          var k = !1;
          j = j[a];
          while(j) {
            if(j[d] === c) {
              k = e[j.sizset];
              break
            }
            j.nodeType === 1 && !g && (j[d] = c, j.sizset = h);
            if(j.nodeName.toLowerCase() === b) {
              k = j;
              break
            }
            j = j[a]
          }
          e[h] = k
        }
      }
    }
    var a = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g, d = "sizcache" + (Math.random() + "").replace(".", ""), e = 0, g = Object.prototype.toString, h = !1, i = !0, j = /\\/g, k = /\r\n/g, l = /\W/;
    [0, 0].sort(function() {
      i = !1;
      return 0
    });
    var m = function(b, d, e, f) {
      e = e || [], d = d || c;
      var h = d;
      if(d.nodeType !== 1 && d.nodeType !== 9) {
        return[]
      }
      if(!b || typeof b != "string") {
        return e
      }
      var i, j, k, l, n, q, r, t, u = !0, v = m.isXML(d), w = [], x = b;
      do {
        a.exec(""), i = a.exec(x);
        if(i) {
          x = i[3], w.push(i[1]);
          if(i[2]) {
            l = i[3];
            break
          }
        }
      }while(i);
      if(w.length > 1 && p.exec(b)) {
        if(w.length === 2 && o.relative[w[0]]) {
          j = y(w[0] + w[1], d, f)
        }else {
          j = o.relative[w[0]] ? [d] : m(w.shift(), d);
          while(w.length) {
            b = w.shift(), o.relative[b] && (b += w.shift()), j = y(b, j, f)
          }
        }
      }else {
        !f && w.length > 1 && d.nodeType === 9 && !v && o.match.ID.test(w[0]) && !o.match.ID.test(w[w.length - 1]) && (n = m.find(w.shift(), d, v), d = n.expr ? m.filter(n.expr, n.set)[0] : n.set[0]);
        if(d) {
          n = f ? {expr:w.pop(), set:s(f)} : m.find(w.pop(), w.length === 1 && (w[0] === "~" || w[0] === "+") && d.parentNode ? d.parentNode : d, v), j = n.expr ? m.filter(n.expr, n.set) : n.set, w.length > 0 ? k = s(j) : u = !1;
          while(w.length) {
            q = w.pop(), r = q, o.relative[q] ? r = w.pop() : q = "", r == null && (r = d), o.relative[q](k, r, v)
          }
        }else {
          k = w = []
        }
      }
      k || (k = j), k || m.error(q || b);
      if(g.call(k) === "[object Array]") {
        if(!u) {
          e.push.apply(e, k)
        }else {
          if(d && d.nodeType === 1) {
            for(t = 0;k[t] != null;t++) {
              k[t] && (k[t] === !0 || k[t].nodeType === 1 && m.contains(d, k[t])) && e.push(j[t])
            }
          }else {
            for(t = 0;k[t] != null;t++) {
              k[t] && k[t].nodeType === 1 && e.push(j[t])
            }
          }
        }
      }else {
        s(k, e)
      }
      l && (m(l, h, e, f), m.uniqueSort(e));
      return e
    };
    m.uniqueSort = function(a) {
      if(u) {
        h = i, a.sort(u);
        if(h) {
          for(var b = 1;b < a.length;b++) {
            a[b] === a[b - 1] && a.splice(b--, 1)
          }
        }
      }
      return a
    }, m.matches = function(a, b) {
      return m(a, null, null, b)
    }, m.matchesSelector = function(a, b) {
      return m(b, null, null, [a]).length > 0
    }, m.find = function(a, b, c) {
      var d, e, f, g, h, i;
      if(!a) {
        return[]
      }
      for(e = 0, f = o.order.length;e < f;e++) {
        h = o.order[e];
        if(g = o.leftMatch[h].exec(a)) {
          i = g[1], g.splice(1, 1);
          if(i.substr(i.length - 1) !== "\\") {
            g[1] = (g[1] || "").replace(j, ""), d = o.find[h](g, b, c);
            if(d != null) {
              a = a.replace(o.match[h], "");
              break
            }
          }
        }
      }
      d || (d = typeof b.getElementsByTagName != "undefined" ? b.getElementsByTagName("*") : []);
      return{set:d, expr:a}
    }, m.filter = function(a, c, d, e) {
      var f, g, h, i, j, k, l, n, p, q = a, r = [], s = c, t = c && c[0] && m.isXML(c[0]);
      while(a && c.length) {
        for(h in o.filter) {
          if((f = o.leftMatch[h].exec(a)) != null && f[2]) {
            k = o.filter[h], l = f[1], g = !1, f.splice(1, 1);
            if(l.substr(l.length - 1) === "\\") {
              continue
            }
            s === r && (r = []);
            if(o.preFilter[h]) {
              f = o.preFilter[h](f, s, d, r, e, t);
              if(!f) {
                g = i = !0
              }else {
                if(f === !0) {
                  continue
                }
              }
            }
            if(f) {
              for(n = 0;(j = s[n]) != null;n++) {
                j && (i = k(j, f, n, s), p = e ^ i, d && i != null ? p ? g = !0 : s[n] = !1 : p && (r.push(j), g = !0))
              }
            }
            if(i !== b) {
              d || (s = r), a = a.replace(o.match[h], "");
              if(!g) {
                return[]
              }
              break
            }
          }
        }
        if(a === q) {
          if(g == null) {
            m.error(a)
          }else {
            break
          }
        }
        q = a
      }
      return s
    }, m.error = function(a) {
      throw new Error("Syntax error, unrecognized expression: " + a);
    };
    var n = m.getText = function(a) {
      var b, c, d = a.nodeType, e = "";
      if(d) {
        if(d === 1 || d === 9) {
          if(typeof a.textContent == "string") {
            return a.textContent
          }
          if(typeof a.innerText == "string") {
            return a.innerText.replace(k, "")
          }
          for(a = a.firstChild;a;a = a.nextSibling) {
            e += n(a)
          }
        }else {
          if(d === 3 || d === 4) {
            return a.nodeValue
          }
        }
      }else {
        for(b = 0;c = a[b];b++) {
          c.nodeType !== 8 && (e += n(c))
        }
      }
      return e
    }, o = m.selectors = {order:["ID", "NAME", "TAG"], match:{ID:/#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/, CLASS:/\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/, NAME:/\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/, ATTR:/\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/, TAG:/^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/, CHILD:/:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/, POS:/:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/, 
    PSEUDO:/:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/}, leftMatch:{}, attrMap:{"class":"className", "for":"htmlFor"}, attrHandle:{href:function(a) {
      return a.getAttribute("href")
    }, type:function(a) {
      return a.getAttribute("type")
    }}, relative:{"+":function(a, b) {
      var c = typeof b == "string", d = c && !l.test(b), e = c && !d;
      d && (b = b.toLowerCase());
      for(var f = 0, g = a.length, h;f < g;f++) {
        if(h = a[f]) {
          while((h = h.previousSibling) && h.nodeType !== 1) {
          }
          a[f] = e || h && h.nodeName.toLowerCase() === b ? h || !1 : h === b
        }
      }
      e && m.filter(b, a, !0)
    }, ">":function(a, b) {
      var c, d = typeof b == "string", e = 0, f = a.length;
      if(d && !l.test(b)) {
        b = b.toLowerCase();
        for(;e < f;e++) {
          c = a[e];
          if(c) {
            var g = c.parentNode;
            a[e] = g.nodeName.toLowerCase() === b ? g : !1
          }
        }
      }else {
        for(;e < f;e++) {
          c = a[e], c && (a[e] = d ? c.parentNode : c.parentNode === b)
        }
        d && m.filter(b, a, !0)
      }
    }, "":function(a, b, c) {
      var d, f = e++, g = x;
      typeof b == "string" && !l.test(b) && (b = b.toLowerCase(), d = b, g = w), g("parentNode", b, f, a, d, c)
    }, "~":function(a, b, c) {
      var d, f = e++, g = x;
      typeof b == "string" && !l.test(b) && (b = b.toLowerCase(), d = b, g = w), g("previousSibling", b, f, a, d, c)
    }}, find:{ID:function(a, b, c) {
      if(typeof b.getElementById != "undefined" && !c) {
        var d = b.getElementById(a[1]);
        return d && d.parentNode ? [d] : []
      }
    }, NAME:function(a, b) {
      if(typeof b.getElementsByName != "undefined") {
        var c = [], d = b.getElementsByName(a[1]);
        for(var e = 0, f = d.length;e < f;e++) {
          d[e].getAttribute("name") === a[1] && c.push(d[e])
        }
        return c.length === 0 ? null : c
      }
    }, TAG:function(a, b) {
      if(typeof b.getElementsByTagName != "undefined") {
        return b.getElementsByTagName(a[1])
      }
    }}, preFilter:{CLASS:function(a, b, c, d, e, f) {
      a = " " + a[1].replace(j, "") + " ";
      if(f) {
        return a
      }
      for(var g = 0, h;(h = b[g]) != null;g++) {
        h && (e ^ (h.className && (" " + h.className + " ").replace(/[\t\n\r]/g, " ").indexOf(a) >= 0) ? c || d.push(h) : c && (b[g] = !1))
      }
      return!1
    }, ID:function(a) {
      return a[1].replace(j, "")
    }, TAG:function(a, b) {
      return a[1].replace(j, "").toLowerCase()
    }, CHILD:function(a) {
      if(a[1] === "nth") {
        a[2] || m.error(a[0]), a[2] = a[2].replace(/^\+|\s*/g, "");
        var b = /(-?)(\d*)(?:n([+\-]?\d*))?/.exec(a[2] === "even" && "2n" || a[2] === "odd" && "2n+1" || !/\D/.test(a[2]) && "0n+" + a[2] || a[2]);
        a[2] = b[1] + (b[2] || 1) - 0, a[3] = b[3] - 0
      }else {
        a[2] && m.error(a[0])
      }
      a[0] = e++;
      return a
    }, ATTR:function(a, b, c, d, e, f) {
      var g = a[1] = a[1].replace(j, "");
      !f && o.attrMap[g] && (a[1] = o.attrMap[g]), a[4] = (a[4] || a[5] || "").replace(j, ""), a[2] === "~=" && (a[4] = " " + a[4] + " ");
      return a
    }, PSEUDO:function(b, c, d, e, f) {
      if(b[1] === "not") {
        if((a.exec(b[3]) || "").length > 1 || /^\w/.test(b[3])) {
          b[3] = m(b[3], null, null, c)
        }else {
          var g = m.filter(b[3], c, d, !0 ^ f);
          d || e.push.apply(e, g);
          return!1
        }
      }else {
        if(o.match.POS.test(b[0]) || o.match.CHILD.test(b[0])) {
          return!0
        }
      }
      return b
    }, POS:function(a) {
      a.unshift(!0);
      return a
    }}, filters:{enabled:function(a) {
      return a.disabled === !1 && a.type !== "hidden"
    }, disabled:function(a) {
      return a.disabled === !0
    }, checked:function(a) {
      return a.checked === !0
    }, selected:function(a) {
      a.parentNode && a.parentNode.selectedIndex;
      return a.selected === !0
    }, parent:function(a) {
      return!!a.firstChild
    }, empty:function(a) {
      return!a.firstChild
    }, has:function(a, b, c) {
      return!!m(c[3], a).length
    }, header:function(a) {
      return/h\d/i.test(a.nodeName)
    }, text:function(a) {
      var b = a.getAttribute("type"), c = a.type;
      return a.nodeName.toLowerCase() === "input" && "text" === c && (b === c || b === null)
    }, radio:function(a) {
      return a.nodeName.toLowerCase() === "input" && "radio" === a.type
    }, checkbox:function(a) {
      return a.nodeName.toLowerCase() === "input" && "checkbox" === a.type
    }, file:function(a) {
      return a.nodeName.toLowerCase() === "input" && "file" === a.type
    }, password:function(a) {
      return a.nodeName.toLowerCase() === "input" && "password" === a.type
    }, submit:function(a) {
      var b = a.nodeName.toLowerCase();
      return(b === "input" || b === "button") && "submit" === a.type
    }, image:function(a) {
      return a.nodeName.toLowerCase() === "input" && "image" === a.type
    }, reset:function(a) {
      var b = a.nodeName.toLowerCase();
      return(b === "input" || b === "button") && "reset" === a.type
    }, button:function(a) {
      var b = a.nodeName.toLowerCase();
      return b === "input" && "button" === a.type || b === "button"
    }, input:function(a) {
      return/input|select|textarea|button/i.test(a.nodeName)
    }, focus:function(a) {
      return a === a.ownerDocument.activeElement
    }}, setFilters:{first:function(a, b) {
      return b === 0
    }, last:function(a, b, c, d) {
      return b === d.length - 1
    }, even:function(a, b) {
      return b % 2 === 0
    }, odd:function(a, b) {
      return b % 2 === 1
    }, lt:function(a, b, c) {
      return b < c[3] - 0
    }, gt:function(a, b, c) {
      return b > c[3] - 0
    }, nth:function(a, b, c) {
      return c[3] - 0 === b
    }, eq:function(a, b, c) {
      return c[3] - 0 === b
    }}, filter:{PSEUDO:function(a, b, c, d) {
      var e = b[1], f = o.filters[e];
      if(f) {
        return f(a, c, b, d)
      }
      if(e === "contains") {
        return(a.textContent || a.innerText || n([a]) || "").indexOf(b[3]) >= 0
      }
      if(e === "not") {
        var g = b[3];
        for(var h = 0, i = g.length;h < i;h++) {
          if(g[h] === a) {
            return!1
          }
        }
        return!0
      }
      m.error(e)
    }, CHILD:function(a, b) {
      var c, e, f, g, h, i, j, k = b[1], l = a;
      switch(k) {
        case "only":
        ;
        case "first":
          while(l = l.previousSibling) {
            if(l.nodeType === 1) {
              return!1
            }
          }
          if(k === "first") {
            return!0
          }
          l = a;
        case "last":
          while(l = l.nextSibling) {
            if(l.nodeType === 1) {
              return!1
            }
          }
          return!0;
        case "nth":
          c = b[2], e = b[3];
          if(c === 1 && e === 0) {
            return!0
          }
          f = b[0], g = a.parentNode;
          if(g && (g[d] !== f || !a.nodeIndex)) {
            i = 0;
            for(l = g.firstChild;l;l = l.nextSibling) {
              l.nodeType === 1 && (l.nodeIndex = ++i)
            }
            g[d] = f
          }
          j = a.nodeIndex - e;
          return c === 0 ? j === 0 : j % c === 0 && j / c >= 0
      }
    }, ID:function(a, b) {
      return a.nodeType === 1 && a.getAttribute("id") === b
    }, TAG:function(a, b) {
      return b === "*" && a.nodeType === 1 || !!a.nodeName && a.nodeName.toLowerCase() === b
    }, CLASS:function(a, b) {
      return(" " + (a.className || a.getAttribute("class")) + " ").indexOf(b) > -1
    }, ATTR:function(a, b) {
      var c = b[1], d = m.attr ? m.attr(a, c) : o.attrHandle[c] ? o.attrHandle[c](a) : a[c] != null ? a[c] : a.getAttribute(c), e = d + "", f = b[2], g = b[4];
      return d == null ? f === "!=" : !f && m.attr ? d != null : f === "=" ? e === g : f === "*=" ? e.indexOf(g) >= 0 : f === "~=" ? (" " + e + " ").indexOf(g) >= 0 : g ? f === "!=" ? e !== g : f === "^=" ? e.indexOf(g) === 0 : f === "$=" ? e.substr(e.length - g.length) === g : f === "|=" ? e === g || e.substr(0, g.length + 1) === g + "-" : !1 : e && d !== !1
    }, POS:function(a, b, c, d) {
      var e = b[2], f = o.setFilters[e];
      if(f) {
        return f(a, c, b, d)
      }
    }}}, p = o.match.POS, q = function(a, b) {
      return"\\" + (b - 0 + 1)
    };
    for(var r in o.match) {
      o.match[r] = new RegExp(o.match[r].source + /(?![^\[]*\])(?![^\(]*\))/.source), o.leftMatch[r] = new RegExp(/(^(?:.|\r|\n)*?)/.source + o.match[r].source.replace(/\\(\d+)/g, q))
    }
    var s = function(a, b) {
      a = Array.prototype.slice.call(a, 0);
      if(b) {
        b.push.apply(b, a);
        return b
      }
      return a
    };
    try {
      Array.prototype.slice.call(c.documentElement.childNodes, 0)[0].nodeType
    }catch(t) {
      s = function(a, b) {
        var c = 0, d = b || [];
        if(g.call(a) === "[object Array]") {
          Array.prototype.push.apply(d, a)
        }else {
          if(typeof a.length == "number") {
            for(var e = a.length;c < e;c++) {
              d.push(a[c])
            }
          }else {
            for(;a[c];c++) {
              d.push(a[c])
            }
          }
        }
        return d
      }
    }
    var u, v;
    c.documentElement.compareDocumentPosition ? u = function(a, b) {
      if(a === b) {
        h = !0;
        return 0
      }
      if(!a.compareDocumentPosition || !b.compareDocumentPosition) {
        return a.compareDocumentPosition ? -1 : 1
      }
      return a.compareDocumentPosition(b) & 4 ? -1 : 1
    } : (u = function(a, b) {
      if(a === b) {
        h = !0;
        return 0
      }
      if(a.sourceIndex && b.sourceIndex) {
        return a.sourceIndex - b.sourceIndex
      }
      var c, d, e = [], f = [], g = a.parentNode, i = b.parentNode, j = g;
      if(g === i) {
        return v(a, b)
      }
      if(!g) {
        return-1
      }
      if(!i) {
        return 1
      }
      while(j) {
        e.unshift(j), j = j.parentNode
      }
      j = i;
      while(j) {
        f.unshift(j), j = j.parentNode
      }
      c = e.length, d = f.length;
      for(var k = 0;k < c && k < d;k++) {
        if(e[k] !== f[k]) {
          return v(e[k], f[k])
        }
      }
      return k === c ? v(a, f[k], -1) : v(e[k], b, 1)
    }, v = function(a, b, c) {
      if(a === b) {
        return c
      }
      var d = a.nextSibling;
      while(d) {
        if(d === b) {
          return-1
        }
        d = d.nextSibling
      }
      return 1
    }), function() {
      var a = c.createElement("div"), d = "script" + (new Date).getTime(), e = c.documentElement;
      a.innerHTML = "<a name='" + d + "'/>", e.insertBefore(a, e.firstChild), c.getElementById(d) && (o.find.ID = function(a, c, d) {
        if(typeof c.getElementById != "undefined" && !d) {
          var e = c.getElementById(a[1]);
          return e ? e.id === a[1] || typeof e.getAttributeNode != "undefined" && e.getAttributeNode("id").nodeValue === a[1] ? [e] : b : []
        }
      }, o.filter.ID = function(a, b) {
        var c = typeof a.getAttributeNode != "undefined" && a.getAttributeNode("id");
        return a.nodeType === 1 && c && c.nodeValue === b
      }), e.removeChild(a), e = a = null
    }(), function() {
      var a = c.createElement("div");
      a.appendChild(c.createComment("")), a.getElementsByTagName("*").length > 0 && (o.find.TAG = function(a, b) {
        var c = b.getElementsByTagName(a[1]);
        if(a[1] === "*") {
          var d = [];
          for(var e = 0;c[e];e++) {
            c[e].nodeType === 1 && d.push(c[e])
          }
          c = d
        }
        return c
      }), a.innerHTML = "<a href='#'></a>", a.firstChild && typeof a.firstChild.getAttribute != "undefined" && a.firstChild.getAttribute("href") !== "#" && (o.attrHandle.href = function(a) {
        return a.getAttribute("href", 2)
      }), a = null
    }(), c.querySelectorAll && function() {
      var a = m, b = c.createElement("div"), d = "__sizzle__";
      b.innerHTML = "<p class='TEST'></p>";
      if(!b.querySelectorAll || b.querySelectorAll(".TEST").length !== 0) {
        m = function(b, e, f, g) {
          e = e || c;
          if(!g && !m.isXML(e)) {
            var h = /^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec(b);
            if(h && (e.nodeType === 1 || e.nodeType === 9)) {
              if(h[1]) {
                return s(e.getElementsByTagName(b), f)
              }
              if(h[2] && o.find.CLASS && e.getElementsByClassName) {
                return s(e.getElementsByClassName(h[2]), f)
              }
            }
            if(e.nodeType === 9) {
              if(b === "body" && e.body) {
                return s([e.body], f)
              }
              if(h && h[3]) {
                var i = e.getElementById(h[3]);
                if(!i || !i.parentNode) {
                  return s([], f)
                }
                if(i.id === h[3]) {
                  return s([i], f)
                }
              }
              try {
                return s(e.querySelectorAll(b), f)
              }catch(j) {
              }
            }else {
              if(e.nodeType === 1 && e.nodeName.toLowerCase() !== "object") {
                var k = e, l = e.getAttribute("id"), n = l || d, p = e.parentNode, q = /^\s*[+~]/.test(b);
                l ? n = n.replace(/'/g, "\\$&") : e.setAttribute("id", n), q && p && (e = e.parentNode);
                try {
                  if(!q || p) {
                    return s(e.querySelectorAll("[id='" + n + "'] " + b), f)
                  }
                }catch(r) {
                }finally {
                  l || k.removeAttribute("id")
                }
              }
            }
          }
          return a(b, e, f, g)
        };
        for(var e in a) {
          m[e] = a[e]
        }
        b = null
      }
    }(), function() {
      var a = c.documentElement, b = a.matchesSelector || a.mozMatchesSelector || a.webkitMatchesSelector || a.msMatchesSelector;
      if(b) {
        var d = !b.call(c.createElement("div"), "div"), e = !1;
        try {
          b.call(c.documentElement, "[test!='']:sizzle")
        }catch(f) {
          e = !0
        }
        m.matchesSelector = function(a, c) {
          c = c.replace(/\=\s*([^'"\]]*)\s*\]/g, "='$1']");
          if(!m.isXML(a)) {
            try {
              if(e || !o.match.PSEUDO.test(c) && !/!=/.test(c)) {
                var f = b.call(a, c);
                if(f || !d || a.document && a.document.nodeType !== 11) {
                  return f
                }
              }
            }catch(g) {
            }
          }
          return m(c, null, null, [a]).length > 0
        }
      }
    }(), function() {
      var a = c.createElement("div");
      a.innerHTML = "<div class='test e'></div><div class='test'></div>";
      if(!!a.getElementsByClassName && a.getElementsByClassName("e").length !== 0) {
        a.lastChild.className = "e";
        if(a.getElementsByClassName("e").length === 1) {
          return
        }
        o.order.splice(1, 0, "CLASS"), o.find.CLASS = function(a, b, c) {
          if(typeof b.getElementsByClassName != "undefined" && !c) {
            return b.getElementsByClassName(a[1])
          }
        }, a = null
      }
    }(), c.documentElement.contains ? m.contains = function(a, b) {
      return a !== b && (a.contains ? a.contains(b) : !0)
    } : c.documentElement.compareDocumentPosition ? m.contains = function(a, b) {
      return!!(a.compareDocumentPosition(b) & 16)
    } : m.contains = function() {
      return!1
    }, m.isXML = function(a) {
      var b = (a ? a.ownerDocument || a : 0).documentElement;
      return b ? b.nodeName !== "HTML" : !1
    };
    var y = function(a, b, c) {
      var d, e = [], f = "", g = b.nodeType ? [b] : b;
      while(d = o.match.PSEUDO.exec(a)) {
        f += d[0], a = a.replace(o.match.PSEUDO, "")
      }
      a = o.relative[a] ? a + "*" : a;
      for(var h = 0, i = g.length;h < i;h++) {
        m(a, g[h], e, c)
      }
      return m.filter(f, e)
    };
    m.attr = f.attr, m.selectors.attrMap = {}, f.find = m, f.expr = m.selectors, f.expr[":"] = f.expr.filters, f.unique = m.uniqueSort, f.text = m.getText, f.isXMLDoc = m.isXML, f.contains = m.contains
  }();
  var L = /Until$/, M = /^(?:parents|prevUntil|prevAll)/, N = /,/, O = /^.[^:#\[\.,]*$/, P = Array.prototype.slice, Q = f.expr.match.POS, R = {children:!0, contents:!0, next:!0, prev:!0};
  f.fn.extend({find:function(a) {
    var b = this, c, d;
    if(typeof a != "string") {
      return f(a).filter(function() {
        for(c = 0, d = b.length;c < d;c++) {
          if(f.contains(b[c], this)) {
            return!0
          }
        }
      })
    }
    var e = this.pushStack("", "find", a), g, h, i;
    for(c = 0, d = this.length;c < d;c++) {
      g = e.length, f.find(a, this[c], e);
      if(c > 0) {
        for(h = g;h < e.length;h++) {
          for(i = 0;i < g;i++) {
            if(e[i] === e[h]) {
              e.splice(h--, 1);
              break
            }
          }
        }
      }
    }
    return e
  }, has:function(a) {
    var b = f(a);
    return this.filter(function() {
      for(var a = 0, c = b.length;a < c;a++) {
        if(f.contains(this, b[a])) {
          return!0
        }
      }
    })
  }, not:function(a) {
    return this.pushStack(T(this, a, !1), "not", a)
  }, filter:function(a) {
    return this.pushStack(T(this, a, !0), "filter", a)
  }, is:function(a) {
    return!!a && (typeof a == "string" ? Q.test(a) ? f(a, this.context).index(this[0]) >= 0 : f.filter(a, this).length > 0 : this.filter(a).length > 0)
  }, closest:function(a, b) {
    var c = [], d, e, g = this[0];
    if(f.isArray(a)) {
      var h = 1;
      while(g && g.ownerDocument && g !== b) {
        for(d = 0;d < a.length;d++) {
          f(g).is(a[d]) && c.push({selector:a[d], elem:g, level:h})
        }
        g = g.parentNode, h++
      }
      return c
    }
    var i = Q.test(a) || typeof a != "string" ? f(a, b || this.context) : 0;
    for(d = 0, e = this.length;d < e;d++) {
      g = this[d];
      while(g) {
        if(i ? i.index(g) > -1 : f.find.matchesSelector(g, a)) {
          c.push(g);
          break
        }
        g = g.parentNode;
        if(!g || !g.ownerDocument || g === b || g.nodeType === 11) {
          break
        }
      }
    }
    c = c.length > 1 ? f.unique(c) : c;
    return this.pushStack(c, "closest", a)
  }, index:function(a) {
    if(!a) {
      return this[0] && this[0].parentNode ? this.prevAll().length : -1
    }
    if(typeof a == "string") {
      return f.inArray(this[0], f(a))
    }
    return f.inArray(a.jquery ? a[0] : a, this)
  }, add:function(a, b) {
    var c = typeof a == "string" ? f(a, b) : f.makeArray(a && a.nodeType ? [a] : a), d = f.merge(this.get(), c);
    return this.pushStack(S(c[0]) || S(d[0]) ? d : f.unique(d))
  }, andSelf:function() {
    return this.add(this.prevObject)
  }}), f.each({parent:function(a) {
    var b = a.parentNode;
    return b && b.nodeType !== 11 ? b : null
  }, parents:function(a) {
    return f.dir(a, "parentNode")
  }, parentsUntil:function(a, b, c) {
    return f.dir(a, "parentNode", c)
  }, next:function(a) {
    return f.nth(a, 2, "nextSibling")
  }, prev:function(a) {
    return f.nth(a, 2, "previousSibling")
  }, nextAll:function(a) {
    return f.dir(a, "nextSibling")
  }, prevAll:function(a) {
    return f.dir(a, "previousSibling")
  }, nextUntil:function(a, b, c) {
    return f.dir(a, "nextSibling", c)
  }, prevUntil:function(a, b, c) {
    return f.dir(a, "previousSibling", c)
  }, siblings:function(a) {
    return f.sibling(a.parentNode.firstChild, a)
  }, children:function(a) {
    return f.sibling(a.firstChild)
  }, contents:function(a) {
    return f.nodeName(a, "iframe") ? a.contentDocument || a.contentWindow.document : f.makeArray(a.childNodes)
  }}, function(a, b) {
    f.fn[a] = function(c, d) {
      var e = f.map(this, b, c);
      L.test(a) || (d = c), d && typeof d == "string" && (e = f.filter(d, e)), e = this.length > 1 && !R[a] ? f.unique(e) : e, (this.length > 1 || N.test(d)) && M.test(a) && (e = e.reverse());
      return this.pushStack(e, a, P.call(arguments).join(","))
    }
  }), f.extend({filter:function(a, b, c) {
    c && (a = ":not(" + a + ")");
    return b.length === 1 ? f.find.matchesSelector(b[0], a) ? [b[0]] : [] : f.find.matches(a, b)
  }, dir:function(a, c, d) {
    var e = [], g = a[c];
    while(g && g.nodeType !== 9 && (d === b || g.nodeType !== 1 || !f(g).is(d))) {
      g.nodeType === 1 && e.push(g), g = g[c]
    }
    return e
  }, nth:function(a, b, c, d) {
    b = b || 1;
    var e = 0;
    for(;a;a = a[c]) {
      if(a.nodeType === 1 && ++e === b) {
        break
      }
    }
    return a
  }, sibling:function(a, b) {
    var c = [];
    for(;a;a = a.nextSibling) {
      a.nodeType === 1 && a !== b && c.push(a)
    }
    return c
  }});
  var V = "abbr|article|aside|audio|canvas|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video", W = / jQuery\d+="(?:\d+|null)"/g, X = /^\s+/, Y = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig, Z = /<([\w:]+)/, $ = /<tbody/i, _ = /<|&#?\w+;/, ba = /<(?:script|style)/i, bb = /<(?:script|object|embed|option|style)/i, bc = new RegExp("<(?:" + V + ")", "i"), bd = /checked\s*(?:[^=]|=\s*.checked.)/i, be = /\/(java|ecma)script/i, 
  bf = /^\s*<!(?:\[CDATA\[|\-\-)/, bg = {option:[1, "<select multiple='multiple'>", "</select>"], legend:[1, "<fieldset>", "</fieldset>"], thead:[1, "<table>", "</table>"], tr:[2, "<table><tbody>", "</tbody></table>"], td:[3, "<table><tbody><tr>", "</tr></tbody></table>"], col:[2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"], area:[1, "<map>", "</map>"], _default:[0, "", ""]}, bh = U(c);
  bg.optgroup = bg.option, bg.tbody = bg.tfoot = bg.colgroup = bg.caption = bg.thead, bg.th = bg.td, f.support.htmlSerialize || (bg._default = [1, "div<div>", "</div>"]), f.fn.extend({text:function(a) {
    if(f.isFunction(a)) {
      return this.each(function(b) {
        var c = f(this);
        c.text(a.call(this, b, c.text()))
      })
    }
    if(typeof a != "object" && a !== b) {
      return this.empty().append((this[0] && this[0].ownerDocument || c).createTextNode(a))
    }
    return f.text(this)
  }, wrapAll:function(a) {
    if(f.isFunction(a)) {
      return this.each(function(b) {
        f(this).wrapAll(a.call(this, b))
      })
    }
    if(this[0]) {
      var b = f(a, this[0].ownerDocument).eq(0).clone(!0);
      this[0].parentNode && b.insertBefore(this[0]), b.map(function() {
        var a = this;
        while(a.firstChild && a.firstChild.nodeType === 1) {
          a = a.firstChild
        }
        return a
      }).append(this)
    }
    return this
  }, wrapInner:function(a) {
    if(f.isFunction(a)) {
      return this.each(function(b) {
        f(this).wrapInner(a.call(this, b))
      })
    }
    return this.each(function() {
      var b = f(this), c = b.contents();
      c.length ? c.wrapAll(a) : b.append(a)
    })
  }, wrap:function(a) {
    var b = f.isFunction(a);
    return this.each(function(c) {
      f(this).wrapAll(b ? a.call(this, c) : a)
    })
  }, unwrap:function() {
    return this.parent().each(function() {
      f.nodeName(this, "body") || f(this).replaceWith(this.childNodes)
    }).end()
  }, append:function() {
    return this.domManip(arguments, !0, function(a) {
      this.nodeType === 1 && this.appendChild(a)
    })
  }, prepend:function() {
    return this.domManip(arguments, !0, function(a) {
      this.nodeType === 1 && this.insertBefore(a, this.firstChild)
    })
  }, before:function() {
    if(this[0] && this[0].parentNode) {
      return this.domManip(arguments, !1, function(a) {
        this.parentNode.insertBefore(a, this)
      })
    }
    if(arguments.length) {
      var a = f.clean(arguments);
      a.push.apply(a, this.toArray());
      return this.pushStack(a, "before", arguments)
    }
  }, after:function() {
    if(this[0] && this[0].parentNode) {
      return this.domManip(arguments, !1, function(a) {
        this.parentNode.insertBefore(a, this.nextSibling)
      })
    }
    if(arguments.length) {
      var a = this.pushStack(this, "after", arguments);
      a.push.apply(a, f.clean(arguments));
      return a
    }
  }, remove:function(a, b) {
    for(var c = 0, d;(d = this[c]) != null;c++) {
      if(!a || f.filter(a, [d]).length) {
        !b && d.nodeType === 1 && (f.cleanData(d.getElementsByTagName("*")), f.cleanData([d])), d.parentNode && d.parentNode.removeChild(d)
      }
    }
    return this
  }, empty:function() {
    for(var a = 0, b;(b = this[a]) != null;a++) {
      b.nodeType === 1 && f.cleanData(b.getElementsByTagName("*"));
      while(b.firstChild) {
        b.removeChild(b.firstChild)
      }
    }
    return this
  }, clone:function(a, b) {
    a = a == null ? !1 : a, b = b == null ? a : b;
    return this.map(function() {
      return f.clone(this, a, b)
    })
  }, html:function(a) {
    if(a === b) {
      return this[0] && this[0].nodeType === 1 ? this[0].innerHTML.replace(W, "") : null
    }
    if(typeof a == "string" && !ba.test(a) && (f.support.leadingWhitespace || !X.test(a)) && !bg[(Z.exec(a) || ["", ""])[1].toLowerCase()]) {
      a = a.replace(Y, "<$1></$2>");
      try {
        for(var c = 0, d = this.length;c < d;c++) {
          this[c].nodeType === 1 && (f.cleanData(this[c].getElementsByTagName("*")), this[c].innerHTML = a)
        }
      }catch(e) {
        this.empty().append(a)
      }
    }else {
      f.isFunction(a) ? this.each(function(b) {
        var c = f(this);
        c.html(a.call(this, b, c.html()))
      }) : this.empty().append(a)
    }
    return this
  }, replaceWith:function(a) {
    if(this[0] && this[0].parentNode) {
      if(f.isFunction(a)) {
        return this.each(function(b) {
          var c = f(this), d = c.html();
          c.replaceWith(a.call(this, b, d))
        })
      }
      typeof a != "string" && (a = f(a).detach());
      return this.each(function() {
        var b = this.nextSibling, c = this.parentNode;
        f(this).remove(), b ? f(b).before(a) : f(c).append(a)
      })
    }
    return this.length ? this.pushStack(f(f.isFunction(a) ? a() : a), "replaceWith", a) : this
  }, detach:function(a) {
    return this.remove(a, !0)
  }, domManip:function(a, c, d) {
    var e, g, h, i, j = a[0], k = [];
    if(!f.support.checkClone && arguments.length === 3 && typeof j == "string" && bd.test(j)) {
      return this.each(function() {
        f(this).domManip(a, c, d, !0)
      })
    }
    if(f.isFunction(j)) {
      return this.each(function(e) {
        var g = f(this);
        a[0] = j.call(this, e, c ? g.html() : b), g.domManip(a, c, d)
      })
    }
    if(this[0]) {
      i = j && j.parentNode, f.support.parentNode && i && i.nodeType === 11 && i.childNodes.length === this.length ? e = {fragment:i} : e = f.buildFragment(a, this, k), h = e.fragment, h.childNodes.length === 1 ? g = h = h.firstChild : g = h.firstChild;
      if(g) {
        c = c && f.nodeName(g, "tr");
        for(var l = 0, m = this.length, n = m - 1;l < m;l++) {
          d.call(c ? bi(this[l], g) : this[l], e.cacheable || m > 1 && l < n ? f.clone(h, !0, !0) : h)
        }
      }
      k.length && f.each(k, bp)
    }
    return this
  }}), f.buildFragment = function(a, b, d) {
    var e, g, h, i, j = a[0];
    b && b[0] && (i = b[0].ownerDocument || b[0]), i.createDocumentFragment || (i = c), a.length === 1 && typeof j == "string" && j.length < 512 && i === c && j.charAt(0) === "<" && !bb.test(j) && (f.support.checkClone || !bd.test(j)) && (f.support.html5Clone || !bc.test(j)) && (g = !0, h = f.fragments[j], h && h !== 1 && (e = h)), e || (e = i.createDocumentFragment(), f.clean(a, i, e, d)), g && (f.fragments[j] = h ? e : 1);
    return{fragment:e, cacheable:g}
  }, f.fragments = {}, f.each({appendTo:"append", prependTo:"prepend", insertBefore:"before", insertAfter:"after", replaceAll:"replaceWith"}, function(a, b) {
    f.fn[a] = function(c) {
      var d = [], e = f(c), g = this.length === 1 && this[0].parentNode;
      if(g && g.nodeType === 11 && g.childNodes.length === 1 && e.length === 1) {
        e[b](this[0]);
        return this
      }
      for(var h = 0, i = e.length;h < i;h++) {
        var j = (h > 0 ? this.clone(!0) : this).get();
        f(e[h])[b](j), d = d.concat(j)
      }
      return this.pushStack(d, a, e.selector)
    }
  }), f.extend({clone:function(a, b, c) {
    var d, e, g, h = f.support.html5Clone || !bc.test("<" + a.nodeName) ? a.cloneNode(!0) : bo(a);
    if((!f.support.noCloneEvent || !f.support.noCloneChecked) && (a.nodeType === 1 || a.nodeType === 11) && !f.isXMLDoc(a)) {
      bk(a, h), d = bl(a), e = bl(h);
      for(g = 0;d[g];++g) {
        e[g] && bk(d[g], e[g])
      }
    }
    if(b) {
      bj(a, h);
      if(c) {
        d = bl(a), e = bl(h);
        for(g = 0;d[g];++g) {
          bj(d[g], e[g])
        }
      }
    }
    d = e = null;
    return h
  }, clean:function(a, b, d, e) {
    var g;
    b = b || c, typeof b.createElement == "undefined" && (b = b.ownerDocument || b[0] && b[0].ownerDocument || c);
    var h = [], i;
    for(var j = 0, k;(k = a[j]) != null;j++) {
      typeof k == "number" && (k += "");
      if(!k) {
        continue
      }
      if(typeof k == "string") {
        if(!_.test(k)) {
          k = b.createTextNode(k)
        }else {
          k = k.replace(Y, "<$1></$2>");
          var l = (Z.exec(k) || ["", ""])[1].toLowerCase(), m = bg[l] || bg._default, n = m[0], o = b.createElement("div");
          b === c ? bh.appendChild(o) : U(b).appendChild(o), o.innerHTML = m[1] + k + m[2];
          while(n--) {
            o = o.lastChild
          }
          if(!f.support.tbody) {
            var p = $.test(k), q = l === "table" && !p ? o.firstChild && o.firstChild.childNodes : m[1] === "<table>" && !p ? o.childNodes : [];
            for(i = q.length - 1;i >= 0;--i) {
              f.nodeName(q[i], "tbody") && !q[i].childNodes.length && q[i].parentNode.removeChild(q[i])
            }
          }
          !f.support.leadingWhitespace && X.test(k) && o.insertBefore(b.createTextNode(X.exec(k)[0]), o.firstChild), k = o.childNodes
        }
      }
      var r;
      if(!f.support.appendChecked) {
        if(k[0] && typeof(r = k.length) == "number") {
          for(i = 0;i < r;i++) {
            bn(k[i])
          }
        }else {
          bn(k)
        }
      }
      k.nodeType ? h.push(k) : h = f.merge(h, k)
    }
    if(d) {
      g = function(a) {
        return!a.type || be.test(a.type)
      };
      for(j = 0;h[j];j++) {
        if(e && f.nodeName(h[j], "script") && (!h[j].type || h[j].type.toLowerCase() === "text/javascript")) {
          e.push(h[j].parentNode ? h[j].parentNode.removeChild(h[j]) : h[j])
        }else {
          if(h[j].nodeType === 1) {
            var s = f.grep(h[j].getElementsByTagName("script"), g);
            h.splice.apply(h, [j + 1, 0].concat(s))
          }
          d.appendChild(h[j])
        }
      }
    }
    return h
  }, cleanData:function(a) {
    var b, c, d = f.cache, e = f.event.special, g = f.support.deleteExpando;
    for(var h = 0, i;(i = a[h]) != null;h++) {
      if(i.nodeName && f.noData[i.nodeName.toLowerCase()]) {
        continue
      }
      c = i[f.expando];
      if(c) {
        b = d[c];
        if(b && b.events) {
          for(var j in b.events) {
            e[j] ? f.event.remove(i, j) : f.removeEvent(i, j, b.handle)
          }
          b.handle && (b.handle.elem = null)
        }
        g ? delete i[f.expando] : i.removeAttribute && i.removeAttribute(f.expando), delete d[c]
      }
    }
  }});
  var bq = /alpha\([^)]*\)/i, br = /opacity=([^)]*)/, bs = /([A-Z]|^ms)/g, bt = /^-?\d+(?:px)?$/i, bu = /^-?\d/, bv = /^([\-+])=([\-+.\de]+)/, bw = {position:"absolute", visibility:"hidden", display:"block"}, bx = ["Left", "Right"], by = ["Top", "Bottom"], bz, bA, bB;
  f.fn.css = function(a, c) {
    if(arguments.length === 2 && c === b) {
      return this
    }
    return f.access(this, a, c, !0, function(a, c, d) {
      return d !== b ? f.style(a, c, d) : f.css(a, c)
    })
  }, f.extend({cssHooks:{opacity:{get:function(a, b) {
    if(b) {
      var c = bz(a, "opacity", "opacity");
      return c === "" ? "1" : c
    }
    return a.style.opacity
  }}}, cssNumber:{fillOpacity:!0, fontWeight:!0, lineHeight:!0, opacity:!0, orphans:!0, widows:!0, zIndex:!0, zoom:!0}, cssProps:{"float":f.support.cssFloat ? "cssFloat" : "styleFloat"}, style:function(a, c, d, e) {
    if(!!a && a.nodeType !== 3 && a.nodeType !== 8 && !!a.style) {
      var g, h, i = f.camelCase(c), j = a.style, k = f.cssHooks[i];
      c = f.cssProps[i] || i;
      if(d === b) {
        if(k && "get" in k && (g = k.get(a, !1, e)) !== b) {
          return g
        }
        return j[c]
      }
      h = typeof d, h === "string" && (g = bv.exec(d)) && (d = +(g[1] + 1) * +g[2] + parseFloat(f.css(a, c)), h = "number");
      if(d == null || h === "number" && isNaN(d)) {
        return
      }
      h === "number" && !f.cssNumber[i] && (d += "px");
      if(!k || !("set" in k) || (d = k.set(a, d)) !== b) {
        try {
          j[c] = d
        }catch(l) {
        }
      }
    }
  }, css:function(a, c, d) {
    var e, g;
    c = f.camelCase(c), g = f.cssHooks[c], c = f.cssProps[c] || c, c === "cssFloat" && (c = "float");
    if(g && "get" in g && (e = g.get(a, !0, d)) !== b) {
      return e
    }
    if(bz) {
      return bz(a, c)
    }
  }, swap:function(a, b, c) {
    var d = {};
    for(var e in b) {
      d[e] = a.style[e], a.style[e] = b[e]
    }
    c.call(a);
    for(e in b) {
      a.style[e] = d[e]
    }
  }}), f.curCSS = f.css, f.each(["height", "width"], function(a, b) {
    f.cssHooks[b] = {get:function(a, c, d) {
      var e;
      if(c) {
        if(a.offsetWidth !== 0) {
          return bC(a, b, d)
        }
        f.swap(a, bw, function() {
          e = bC(a, b, d)
        });
        return e
      }
    }, set:function(a, b) {
      if(!bt.test(b)) {
        return b
      }
      b = parseFloat(b);
      if(b >= 0) {
        return b + "px"
      }
    }}
  }), f.support.opacity || (f.cssHooks.opacity = {get:function(a, b) {
    return br.test((b && a.currentStyle ? a.currentStyle.filter : a.style.filter) || "") ? parseFloat(RegExp.$1) / 100 + "" : b ? "1" : ""
  }, set:function(a, b) {
    var c = a.style, d = a.currentStyle, e = f.isNumeric(b) ? "alpha(opacity=" + b * 100 + ")" : "", g = d && d.filter || c.filter || "";
    c.zoom = 1;
    if(b >= 1 && f.trim(g.replace(bq, "")) === "") {
      c.removeAttribute("filter");
      if(d && !d.filter) {
        return
      }
    }
    c.filter = bq.test(g) ? g.replace(bq, e) : g + " " + e
  }}), f(function() {
    f.support.reliableMarginRight || (f.cssHooks.marginRight = {get:function(a, b) {
      var c;
      f.swap(a, {display:"inline-block"}, function() {
        b ? c = bz(a, "margin-right", "marginRight") : c = a.style.marginRight
      });
      return c
    }})
  }), c.defaultView && c.defaultView.getComputedStyle && (bA = function(a, b) {
    var c, d, e;
    b = b.replace(bs, "-$1").toLowerCase(), (d = a.ownerDocument.defaultView) && (e = d.getComputedStyle(a, null)) && (c = e.getPropertyValue(b), c === "" && !f.contains(a.ownerDocument.documentElement, a) && (c = f.style(a, b)));
    return c
  }), c.documentElement.currentStyle && (bB = function(a, b) {
    var c, d, e, f = a.currentStyle && a.currentStyle[b], g = a.style;
    f === null && g && (e = g[b]) && (f = e), !bt.test(f) && bu.test(f) && (c = g.left, d = a.runtimeStyle && a.runtimeStyle.left, d && (a.runtimeStyle.left = a.currentStyle.left), g.left = b === "fontSize" ? "1em" : f || 0, f = g.pixelLeft + "px", g.left = c, d && (a.runtimeStyle.left = d));
    return f === "" ? "auto" : f
  }), bz = bA || bB, f.expr && f.expr.filters && (f.expr.filters.hidden = function(a) {
    var b = a.offsetWidth, c = a.offsetHeight;
    return b === 0 && c === 0 || !f.support.reliableHiddenOffsets && (a.style && a.style.display || f.css(a, "display")) === "none"
  }, f.expr.filters.visible = function(a) {
    return!f.expr.filters.hidden(a)
  });
  var bD = /%20/g, bE = /\[\]$/, bF = /\r?\n/g, bG = /#.*$/, bH = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, bI = /^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i, bJ = /^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/, bK = /^(?:GET|HEAD)$/, bL = /^\/\//, bM = /\?/, bN = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, bO = /^(?:select|textarea)/i, bP = /\s+/, bQ = /([?&])_=[^&]*/, bR = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+))?)?/, 
  bS = f.fn.load, bT = {}, bU = {}, bV, bW, bX = ["*/"] + ["*"];
  try {
    bV = e.href
  }catch(bY) {
    bV = c.createElement("a"), bV.href = "", bV = bV.href
  }
  bW = bR.exec(bV.toLowerCase()) || [], f.fn.extend({load:function(a, c, d) {
    if(typeof a != "string" && bS) {
      return bS.apply(this, arguments)
    }
    if(!this.length) {
      return this
    }
    var e = a.indexOf(" ");
    if(e >= 0) {
      var g = a.slice(e, a.length);
      a = a.slice(0, e)
    }
    var h = "GET";
    c && (f.isFunction(c) ? (d = c, c = b) : typeof c == "object" && (c = f.param(c, f.ajaxSettings.traditional), h = "POST"));
    var i = this;
    f.ajax({url:a, type:h, dataType:"html", data:c, complete:function(a, b, c) {
      c = a.responseText, a.isResolved() && (a.done(function(a) {
        c = a
      }), i.html(g ? f("<div>").append(c.replace(bN, "")).find(g) : c)), d && i.each(d, [c, b, a])
    }});
    return this
  }, serialize:function() {
    return f.param(this.serializeArray())
  }, serializeArray:function() {
    return this.map(function() {
      return this.elements ? f.makeArray(this.elements) : this
    }).filter(function() {
      return this.name && !this.disabled && (this.checked || bO.test(this.nodeName) || bI.test(this.type))
    }).map(function(a, b) {
      var c = f(this).val();
      return c == null ? null : f.isArray(c) ? f.map(c, function(a, c) {
        return{name:b.name, value:a.replace(bF, "\r\n")}
      }) : {name:b.name, value:c.replace(bF, "\r\n")}
    }).get()
  }}), f.each("ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "), function(a, b) {
    f.fn[b] = function(a) {
      return this.on(b, a)
    }
  }), f.each(["get", "post"], function(a, c) {
    f[c] = function(a, d, e, g) {
      f.isFunction(d) && (g = g || e, e = d, d = b);
      return f.ajax({type:c, url:a, data:d, success:e, dataType:g})
    }
  }), f.extend({getScript:function(a, c) {
    return f.get(a, b, c, "script")
  }, getJSON:function(a, b, c) {
    return f.get(a, b, c, "json")
  }, ajaxSetup:function(a, b) {
    b ? b_(a, f.ajaxSettings) : (b = a, a = f.ajaxSettings), b_(a, b);
    return a
  }, ajaxSettings:{url:bV, isLocal:bJ.test(bW[1]), global:!0, type:"GET", contentType:"application/x-www-form-urlencoded", processData:!0, async:!0, accepts:{xml:"application/xml, text/xml", html:"text/html", text:"text/plain", json:"application/json, text/javascript", "*":bX}, contents:{xml:/xml/, html:/html/, json:/json/}, responseFields:{xml:"responseXML", text:"responseText"}, converters:{"* text":a.String, "text html":!0, "text json":f.parseJSON, "text xml":f.parseXML}, flatOptions:{context:!0, 
  url:!0}}, ajaxPrefilter:bZ(bT), ajaxTransport:bZ(bU), ajax:function(a, c) {
    function w(a, c, l, m) {
      if(s !== 2) {
        s = 2, q && clearTimeout(q), p = b, n = m || "", v.readyState = a > 0 ? 4 : 0;
        var o, r, u, w = c, x = l ? cb(d, v, l) : b, y, z;
        if(a >= 200 && a < 300 || a === 304) {
          if(d.ifModified) {
            if(y = v.getResponseHeader("Last-Modified")) {
              f.lastModified[k] = y
            }
            if(z = v.getResponseHeader("Etag")) {
              f.etag[k] = z
            }
          }
          if(a === 304) {
            w = "notmodified", o = !0
          }else {
            try {
              r = cc(d, x), w = "success", o = !0
            }catch(A) {
              w = "parsererror", u = A
            }
          }
        }else {
          u = w;
          if(!w || a) {
            w = "error", a < 0 && (a = 0)
          }
        }
        v.status = a, v.statusText = "" + (c || w), o ? h.resolveWith(e, [r, w, v]) : h.rejectWith(e, [v, w, u]), v.statusCode(j), j = b, t && g.trigger("ajax" + (o ? "Success" : "Error"), [v, d, o ? r : u]), i.fireWith(e, [v, w]), t && (g.trigger("ajaxComplete", [v, d]), --f.active || f.event.trigger("ajaxStop"))
      }
    }
    typeof a == "object" && (c = a, a = b), c = c || {};
    var d = f.ajaxSetup({}, c), e = d.context || d, g = e !== d && (e.nodeType || e instanceof f) ? f(e) : f.event, h = f.Deferred(), i = f.Callbacks("once memory"), j = d.statusCode || {}, k, l = {}, m = {}, n, o, p, q, r, s = 0, t, u, v = {readyState:0, setRequestHeader:function(a, b) {
      if(!s) {
        var c = a.toLowerCase();
        a = m[c] = m[c] || a, l[a] = b
      }
      return this
    }, getAllResponseHeaders:function() {
      return s === 2 ? n : null
    }, getResponseHeader:function(a) {
      var c;
      if(s === 2) {
        if(!o) {
          o = {};
          while(c = bH.exec(n)) {
            o[c[1].toLowerCase()] = c[2]
          }
        }
        c = o[a.toLowerCase()]
      }
      return c === b ? null : c
    }, overrideMimeType:function(a) {
      s || (d.mimeType = a);
      return this
    }, abort:function(a) {
      a = a || "abort", p && p.abort(a), w(0, a);
      return this
    }};
    h.promise(v), v.success = v.done, v.error = v.fail, v.complete = i.add, v.statusCode = function(a) {
      if(a) {
        var b;
        if(s < 2) {
          for(b in a) {
            j[b] = [j[b], a[b]]
          }
        }else {
          b = a[v.status], v.then(b, b)
        }
      }
      return this
    }, d.url = ((a || d.url) + "").replace(bG, "").replace(bL, bW[1] + "//"), d.dataTypes = f.trim(d.dataType || "*").toLowerCase().split(bP), d.crossDomain == null && (r = bR.exec(d.url.toLowerCase()), d.crossDomain = !(!r || r[1] == bW[1] && r[2] == bW[2] && (r[3] || (r[1] === "http:" ? 80 : 443)) == (bW[3] || (bW[1] === "http:" ? 80 : 443)))), d.data && d.processData && typeof d.data != "string" && (d.data = f.param(d.data, d.traditional)), b$(bT, d, c, v);
    if(s === 2) {
      return!1
    }
    t = d.global, d.type = d.type.toUpperCase(), d.hasContent = !bK.test(d.type), t && f.active++ === 0 && f.event.trigger("ajaxStart");
    if(!d.hasContent) {
      d.data && (d.url += (bM.test(d.url) ? "&" : "?") + d.data, delete d.data), k = d.url;
      if(d.cache === !1) {
        var x = f.now(), y = d.url.replace(bQ, "$1_=" + x);
        d.url = y + (y === d.url ? (bM.test(d.url) ? "&" : "?") + "_=" + x : "")
      }
    }
    (d.data && d.hasContent && d.contentType !== !1 || c.contentType) && v.setRequestHeader("Content-Type", d.contentType), d.ifModified && (k = k || d.url, f.lastModified[k] && v.setRequestHeader("If-Modified-Since", f.lastModified[k]), f.etag[k] && v.setRequestHeader("If-None-Match", f.etag[k])), v.setRequestHeader("Accept", d.dataTypes[0] && d.accepts[d.dataTypes[0]] ? d.accepts[d.dataTypes[0]] + (d.dataTypes[0] !== "*" ? ", " + bX + "; q=0.01" : "") : d.accepts["*"]);
    for(u in d.headers) {
      v.setRequestHeader(u, d.headers[u])
    }
    if(d.beforeSend && (d.beforeSend.call(e, v, d) === !1 || s === 2)) {
      v.abort();
      return!1
    }
    for(u in{success:1, error:1, complete:1}) {
      v[u](d[u])
    }
    p = b$(bU, d, c, v);
    if(!p) {
      w(-1, "No Transport")
    }else {
      v.readyState = 1, t && g.trigger("ajaxSend", [v, d]), d.async && d.timeout > 0 && (q = setTimeout(function() {
        v.abort("timeout")
      }, d.timeout));
      try {
        s = 1, p.send(l, w)
      }catch(z) {
        if(s < 2) {
          w(-1, z)
        }else {
          throw z;
        }
      }
    }
    return v
  }, param:function(a, c) {
    var d = [], e = function(a, b) {
      b = f.isFunction(b) ? b() : b, d[d.length] = encodeURIComponent(a) + "=" + encodeURIComponent(b)
    };
    c === b && (c = f.ajaxSettings.traditional);
    if(f.isArray(a) || a.jquery && !f.isPlainObject(a)) {
      f.each(a, function() {
        e(this.name, this.value)
      })
    }else {
      for(var g in a) {
        ca(g, a[g], c, e)
      }
    }
    return d.join("&").replace(bD, "+")
  }}), f.extend({active:0, lastModified:{}, etag:{}});
  var cd = f.now(), ce = /(\=)\?(&|$)|\?\?/i;
  f.ajaxSetup({jsonp:"callback", jsonpCallback:function() {
    return f.expando + "_" + cd++
  }}), f.ajaxPrefilter("json jsonp", function(b, c, d) {
    var e = b.contentType === "application/x-www-form-urlencoded" && typeof b.data == "string";
    if(b.dataTypes[0] === "jsonp" || b.jsonp !== !1 && (ce.test(b.url) || e && ce.test(b.data))) {
      var g, h = b.jsonpCallback = f.isFunction(b.jsonpCallback) ? b.jsonpCallback() : b.jsonpCallback, i = a[h], j = b.url, k = b.data, l = "$1" + h + "$2";
      b.jsonp !== !1 && (j = j.replace(ce, l), b.url === j && (e && (k = k.replace(ce, l)), b.data === k && (j += (/\?/.test(j) ? "&" : "?") + b.jsonp + "=" + h))), b.url = j, b.data = k, a[h] = function(a) {
        g = [a]
      }, d.always(function() {
        a[h] = i, g && f.isFunction(i) && a[h](g[0])
      }), b.converters["script json"] = function() {
        g || f.error(h + " was not called");
        return g[0]
      }, b.dataTypes[0] = "json";
      return"script"
    }
  }), f.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"}, contents:{script:/javascript|ecmascript/}, converters:{"text script":function(a) {
    f.globalEval(a);
    return a
  }}}), f.ajaxPrefilter("script", function(a) {
    a.cache === b && (a.cache = !1), a.crossDomain && (a.type = "GET", a.global = !1)
  }), f.ajaxTransport("script", function(a) {
    if(a.crossDomain) {
      var d, e = c.head || c.getElementsByTagName("head")[0] || c.documentElement;
      return{send:function(f, g) {
        d = c.createElement("script"), d.async = "async", a.scriptCharset && (d.charset = a.scriptCharset), d.src = a.url, d.onload = d.onreadystatechange = function(a, c) {
          if(c || !d.readyState || /loaded|complete/.test(d.readyState)) {
            d.onload = d.onreadystatechange = null, e && d.parentNode && e.removeChild(d), d = b, c || g(200, "success")
          }
        }, e.insertBefore(d, e.firstChild)
      }, abort:function() {
        d && d.onload(0, 1)
      }}
    }
  });
  var cf = a.ActiveXObject ? function() {
    for(var a in ch) {
      ch[a](0, 1)
    }
  } : !1, cg = 0, ch;
  f.ajaxSettings.xhr = a.ActiveXObject ? function() {
    return!this.isLocal && ci() || cj()
  } : ci, function(a) {
    f.extend(f.support, {ajax:!!a, cors:!!a && "withCredentials" in a})
  }(f.ajaxSettings.xhr()), f.support.ajax && f.ajaxTransport(function(c) {
    if(!c.crossDomain || f.support.cors) {
      var d;
      return{send:function(e, g) {
        var h = c.xhr(), i, j;
        c.username ? h.open(c.type, c.url, c.async, c.username, c.password) : h.open(c.type, c.url, c.async);
        if(c.xhrFields) {
          for(j in c.xhrFields) {
            h[j] = c.xhrFields[j]
          }
        }
        c.mimeType && h.overrideMimeType && h.overrideMimeType(c.mimeType), !c.crossDomain && !e["X-Requested-With"] && (e["X-Requested-With"] = "XMLHttpRequest");
        try {
          for(j in e) {
            h.setRequestHeader(j, e[j])
          }
        }catch(k) {
        }
        h.send(c.hasContent && c.data || null), d = function(a, e) {
          var j, k, l, m, n;
          try {
            if(d && (e || h.readyState === 4)) {
              d = b, i && (h.onreadystatechange = f.noop, cf && delete ch[i]);
              if(e) {
                h.readyState !== 4 && h.abort()
              }else {
                j = h.status, l = h.getAllResponseHeaders(), m = {}, n = h.responseXML, n && n.documentElement && (m.xml = n), m.text = h.responseText;
                try {
                  k = h.statusText
                }catch(o) {
                  k = ""
                }
                !j && c.isLocal && !c.crossDomain ? j = m.text ? 200 : 404 : j === 1223 && (j = 204)
              }
            }
          }catch(p) {
            e || g(-1, p)
          }
          m && g(j, k, m, l)
        }, !c.async || h.readyState === 4 ? d() : (i = ++cg, cf && (ch || (ch = {}, f(a).unload(cf)), ch[i] = d), h.onreadystatechange = d)
      }, abort:function() {
        d && d(0, 1)
      }}
    }
  });
  var ck = {}, cl, cm, cn = /^(?:toggle|show|hide)$/, co = /^([+\-]=)?([\d+.\-]+)([a-z%]*)$/i, cp, cq = [["height", "marginTop", "marginBottom", "paddingTop", "paddingBottom"], ["width", "marginLeft", "marginRight", "paddingLeft", "paddingRight"], ["opacity"]], cr;
  f.fn.extend({show:function(a, b, c) {
    var d, e;
    if(a || a === 0) {
      return this.animate(cu("show", 3), a, b, c)
    }
    for(var g = 0, h = this.length;g < h;g++) {
      d = this[g], d.style && (e = d.style.display, !f._data(d, "olddisplay") && e === "none" && (e = d.style.display = ""), e === "" && f.css(d, "display") === "none" && f._data(d, "olddisplay", cv(d.nodeName)))
    }
    for(g = 0;g < h;g++) {
      d = this[g];
      if(d.style) {
        e = d.style.display;
        if(e === "" || e === "none") {
          d.style.display = f._data(d, "olddisplay") || ""
        }
      }
    }
    return this
  }, hide:function(a, b, c) {
    if(a || a === 0) {
      return this.animate(cu("hide", 3), a, b, c)
    }
    var d, e, g = 0, h = this.length;
    for(;g < h;g++) {
      d = this[g], d.style && (e = f.css(d, "display"), e !== "none" && !f._data(d, "olddisplay") && f._data(d, "olddisplay", e))
    }
    for(g = 0;g < h;g++) {
      this[g].style && (this[g].style.display = "none")
    }
    return this
  }, _toggle:f.fn.toggle, toggle:function(a, b, c) {
    var d = typeof a == "boolean";
    f.isFunction(a) && f.isFunction(b) ? this._toggle.apply(this, arguments) : a == null || d ? this.each(function() {
      var b = d ? a : f(this).is(":hidden");
      f(this)[b ? "show" : "hide"]()
    }) : this.animate(cu("toggle", 3), a, b, c);
    return this
  }, fadeTo:function(a, b, c, d) {
    return this.filter(":hidden").css("opacity", 0).show().end().animate({opacity:b}, a, c, d)
  }, animate:function(a, b, c, d) {
    function g() {
      e.queue === !1 && f._mark(this);
      var b = f.extend({}, e), c = this.nodeType === 1, d = c && f(this).is(":hidden"), g, h, i, j, k, l, m, n, o;
      b.animatedProperties = {};
      for(i in a) {
        g = f.camelCase(i), i !== g && (a[g] = a[i], delete a[i]), h = a[g], f.isArray(h) ? (b.animatedProperties[g] = h[1], h = a[g] = h[0]) : b.animatedProperties[g] = b.specialEasing && b.specialEasing[g] || b.easing || "swing";
        if(h === "hide" && d || h === "show" && !d) {
          return b.complete.call(this)
        }
        c && (g === "height" || g === "width") && (b.overflow = [this.style.overflow, this.style.overflowX, this.style.overflowY], f.css(this, "display") === "inline" && f.css(this, "float") === "none" && (!f.support.inlineBlockNeedsLayout || cv(this.nodeName) === "inline" ? this.style.display = "inline-block" : this.style.zoom = 1))
      }
      b.overflow != null && (this.style.overflow = "hidden");
      for(i in a) {
        j = new f.fx(this, b, i), h = a[i], cn.test(h) ? (o = f._data(this, "toggle" + i) || (h === "toggle" ? d ? "show" : "hide" : 0), o ? (f._data(this, "toggle" + i, o === "show" ? "hide" : "show"), j[o]()) : j[h]()) : (k = co.exec(h), l = j.cur(), k ? (m = parseFloat(k[2]), n = k[3] || (f.cssNumber[i] ? "" : "px"), n !== "px" && (f.style(this, i, (m || 1) + n), l = (m || 1) / j.cur() * l, f.style(this, i, l + n)), k[1] && (m = (k[1] === "-=" ? -1 : 1) * m + l), j.custom(l, m, n)) : j.custom(l, 
        h, ""))
      }
      return!0
    }
    var e = f.speed(b, c, d);
    if(f.isEmptyObject(a)) {
      return this.each(e.complete, [!1])
    }
    a = f.extend({}, a);
    return e.queue === !1 ? this.each(g) : this.queue(e.queue, g)
  }, stop:function(a, c, d) {
    typeof a != "string" && (d = c, c = a, a = b), c && a !== !1 && this.queue(a || "fx", []);
    return this.each(function() {
      function h(a, b, c) {
        var e = b[c];
        f.removeData(a, c, !0), e.stop(d)
      }
      var b, c = !1, e = f.timers, g = f._data(this);
      d || f._unmark(!0, this);
      if(a == null) {
        for(b in g) {
          g[b] && g[b].stop && b.indexOf(".run") === b.length - 4 && h(this, g, b)
        }
      }else {
        g[b = a + ".run"] && g[b].stop && h(this, g, b)
      }
      for(b = e.length;b--;) {
        e[b].elem === this && (a == null || e[b].queue === a) && (d ? e[b](!0) : e[b].saveState(), c = !0, e.splice(b, 1))
      }
      (!d || !c) && f.dequeue(this, a)
    })
  }}), f.each({slideDown:cu("show", 1), slideUp:cu("hide", 1), slideToggle:cu("toggle", 1), fadeIn:{opacity:"show"}, fadeOut:{opacity:"hide"}, fadeToggle:{opacity:"toggle"}}, function(a, b) {
    f.fn[a] = function(a, c, d) {
      return this.animate(b, a, c, d)
    }
  }), f.extend({speed:function(a, b, c) {
    var d = a && typeof a == "object" ? f.extend({}, a) : {complete:c || !c && b || f.isFunction(a) && a, duration:a, easing:c && b || b && !f.isFunction(b) && b};
    d.duration = f.fx.off ? 0 : typeof d.duration == "number" ? d.duration : d.duration in f.fx.speeds ? f.fx.speeds[d.duration] : f.fx.speeds._default;
    if(d.queue == null || d.queue === !0) {
      d.queue = "fx"
    }
    d.old = d.complete, d.complete = function(a) {
      f.isFunction(d.old) && d.old.call(this), d.queue ? f.dequeue(this, d.queue) : a !== !1 && f._unmark(this)
    };
    return d
  }, easing:{linear:function(a, b, c, d) {
    return c + d * a
  }, swing:function(a, b, c, d) {
    return(-Math.cos(a * Math.PI) / 2 + 0.5) * d + c
  }}, timers:[], fx:function(a, b, c) {
    this.options = b, this.elem = a, this.prop = c, b.orig = b.orig || {}
  }}), f.fx.prototype = {update:function() {
    this.options.step && this.options.step.call(this.elem, this.now, this), (f.fx.step[this.prop] || f.fx.step._default)(this)
  }, cur:function() {
    if(this.elem[this.prop] != null && (!this.elem.style || this.elem.style[this.prop] == null)) {
      return this.elem[this.prop]
    }
    var a, b = f.css(this.elem, this.prop);
    return isNaN(a = parseFloat(b)) ? !b || b === "auto" ? 0 : b : a
  }, custom:function(a, c, d) {
    function h(a) {
      return e.step(a)
    }
    var e = this, g = f.fx;
    this.startTime = cr || cs(), this.end = c, this.now = this.start = a, this.pos = this.state = 0, this.unit = d || this.unit || (f.cssNumber[this.prop] ? "" : "px"), h.queue = this.options.queue, h.elem = this.elem, h.saveState = function() {
      e.options.hide && f._data(e.elem, "fxshow" + e.prop) === b && f._data(e.elem, "fxshow" + e.prop, e.start)
    }, h() && f.timers.push(h) && !cp && (cp = setInterval(g.tick, g.interval))
  }, show:function() {
    var a = f._data(this.elem, "fxshow" + this.prop);
    this.options.orig[this.prop] = a || f.style(this.elem, this.prop), this.options.show = !0, a !== b ? this.custom(this.cur(), a) : this.custom(this.prop === "width" || this.prop === "height" ? 1 : 0, this.cur()), f(this.elem).show()
  }, hide:function() {
    this.options.orig[this.prop] = f._data(this.elem, "fxshow" + this.prop) || f.style(this.elem, this.prop), this.options.hide = !0, this.custom(this.cur(), 0)
  }, step:function(a) {
    var b, c, d, e = cr || cs(), g = !0, h = this.elem, i = this.options;
    if(a || e >= i.duration + this.startTime) {
      this.now = this.end, this.pos = this.state = 1, this.update(), i.animatedProperties[this.prop] = !0;
      for(b in i.animatedProperties) {
        i.animatedProperties[b] !== !0 && (g = !1)
      }
      if(g) {
        i.overflow != null && !f.support.shrinkWrapBlocks && f.each(["", "X", "Y"], function(a, b) {
          h.style["overflow" + b] = i.overflow[a]
        }), i.hide && f(h).hide();
        if(i.hide || i.show) {
          for(b in i.animatedProperties) {
            f.style(h, b, i.orig[b]), f.removeData(h, "fxshow" + b, !0), f.removeData(h, "toggle" + b, !0)
          }
        }
        d = i.complete, d && (i.complete = !1, d.call(h))
      }
      return!1
    }
    i.duration == Infinity ? this.now = e : (c = e - this.startTime, this.state = c / i.duration, this.pos = f.easing[i.animatedProperties[this.prop]](this.state, c, 0, 1, i.duration), this.now = this.start + (this.end - this.start) * this.pos), this.update();
    return!0
  }}, f.extend(f.fx, {tick:function() {
    var a, b = f.timers, c = 0;
    for(;c < b.length;c++) {
      a = b[c], !a() && b[c] === a && b.splice(c--, 1)
    }
    b.length || f.fx.stop()
  }, interval:13, stop:function() {
    clearInterval(cp), cp = null
  }, speeds:{slow:600, fast:200, _default:400}, step:{opacity:function(a) {
    f.style(a.elem, "opacity", a.now)
  }, _default:function(a) {
    a.elem.style && a.elem.style[a.prop] != null ? a.elem.style[a.prop] = a.now + a.unit : a.elem[a.prop] = a.now
  }}}), f.each(["width", "height"], function(a, b) {
    f.fx.step[b] = function(a) {
      f.style(a.elem, b, Math.max(0, a.now) + a.unit)
    }
  }), f.expr && f.expr.filters && (f.expr.filters.animated = function(a) {
    return f.grep(f.timers, function(b) {
      return a === b.elem
    }).length
  });
  var cw = /^t(?:able|d|h)$/i, cx = /^(?:body|html)$/i;
  "getBoundingClientRect" in c.documentElement ? f.fn.offset = function(a) {
    var b = this[0], c;
    if(a) {
      return this.each(function(b) {
        f.offset.setOffset(this, a, b)
      })
    }
    if(!b || !b.ownerDocument) {
      return null
    }
    if(b === b.ownerDocument.body) {
      return f.offset.bodyOffset(b)
    }
    try {
      c = b.getBoundingClientRect()
    }catch(d) {
    }
    var e = b.ownerDocument, g = e.documentElement;
    if(!c || !f.contains(g, b)) {
      return c ? {top:c.top, left:c.left} : {top:0, left:0}
    }
    var h = e.body, i = cy(e), j = g.clientTop || h.clientTop || 0, k = g.clientLeft || h.clientLeft || 0, l = i.pageYOffset || f.support.boxModel && g.scrollTop || h.scrollTop, m = i.pageXOffset || f.support.boxModel && g.scrollLeft || h.scrollLeft, n = c.top + l - j, o = c.left + m - k;
    return{top:n, left:o}
  } : f.fn.offset = function(a) {
    var b = this[0];
    if(a) {
      return this.each(function(b) {
        f.offset.setOffset(this, a, b)
      })
    }
    if(!b || !b.ownerDocument) {
      return null
    }
    if(b === b.ownerDocument.body) {
      return f.offset.bodyOffset(b)
    }
    var c, d = b.offsetParent, e = b, g = b.ownerDocument, h = g.documentElement, i = g.body, j = g.defaultView, k = j ? j.getComputedStyle(b, null) : b.currentStyle, l = b.offsetTop, m = b.offsetLeft;
    while((b = b.parentNode) && b !== i && b !== h) {
      if(f.support.fixedPosition && k.position === "fixed") {
        break
      }
      c = j ? j.getComputedStyle(b, null) : b.currentStyle, l -= b.scrollTop, m -= b.scrollLeft, b === d && (l += b.offsetTop, m += b.offsetLeft, f.support.doesNotAddBorder && (!f.support.doesAddBorderForTableAndCells || !cw.test(b.nodeName)) && (l += parseFloat(c.borderTopWidth) || 0, m += parseFloat(c.borderLeftWidth) || 0), e = d, d = b.offsetParent), f.support.subtractsBorderForOverflowNotVisible && c.overflow !== "visible" && (l += parseFloat(c.borderTopWidth) || 0, m += parseFloat(c.borderLeftWidth) || 
      0), k = c
    }
    if(k.position === "relative" || k.position === "static") {
      l += i.offsetTop, m += i.offsetLeft
    }
    f.support.fixedPosition && k.position === "fixed" && (l += Math.max(h.scrollTop, i.scrollTop), m += Math.max(h.scrollLeft, i.scrollLeft));
    return{top:l, left:m}
  }, f.offset = {bodyOffset:function(a) {
    var b = a.offsetTop, c = a.offsetLeft;
    f.support.doesNotIncludeMarginInBodyOffset && (b += parseFloat(f.css(a, "marginTop")) || 0, c += parseFloat(f.css(a, "marginLeft")) || 0);
    return{top:b, left:c}
  }, setOffset:function(a, b, c) {
    var d = f.css(a, "position");
    d === "static" && (a.style.position = "relative");
    var e = f(a), g = e.offset(), h = f.css(a, "top"), i = f.css(a, "left"), j = (d === "absolute" || d === "fixed") && f.inArray("auto", [h, i]) > -1, k = {}, l = {}, m, n;
    j ? (l = e.position(), m = l.top, n = l.left) : (m = parseFloat(h) || 0, n = parseFloat(i) || 0), f.isFunction(b) && (b = b.call(a, c, g)), b.top != null && (k.top = b.top - g.top + m), b.left != null && (k.left = b.left - g.left + n), "using" in b ? b.using.call(a, k) : e.css(k)
  }}, f.fn.extend({position:function() {
    if(!this[0]) {
      return null
    }
    var a = this[0], b = this.offsetParent(), c = this.offset(), d = cx.test(b[0].nodeName) ? {top:0, left:0} : b.offset();
    c.top -= parseFloat(f.css(a, "marginTop")) || 0, c.left -= parseFloat(f.css(a, "marginLeft")) || 0, d.top += parseFloat(f.css(b[0], "borderTopWidth")) || 0, d.left += parseFloat(f.css(b[0], "borderLeftWidth")) || 0;
    return{top:c.top - d.top, left:c.left - d.left}
  }, offsetParent:function() {
    return this.map(function() {
      var a = this.offsetParent || c.body;
      while(a && !cx.test(a.nodeName) && f.css(a, "position") === "static") {
        a = a.offsetParent
      }
      return a
    })
  }}), f.each(["Left", "Top"], function(a, c) {
    var d = "scroll" + c;
    f.fn[d] = function(c) {
      var e, g;
      if(c === b) {
        e = this[0];
        if(!e) {
          return null
        }
        g = cy(e);
        return g ? "pageXOffset" in g ? g[a ? "pageYOffset" : "pageXOffset"] : f.support.boxModel && g.document.documentElement[d] || g.document.body[d] : e[d]
      }
      return this.each(function() {
        g = cy(this), g ? g.scrollTo(a ? f(g).scrollLeft() : c, a ? c : f(g).scrollTop()) : this[d] = c
      })
    }
  }), f.each(["Height", "Width"], function(a, c) {
    var d = c.toLowerCase();
    f.fn["inner" + c] = function() {
      var a = this[0];
      return a ? a.style ? parseFloat(f.css(a, d, "padding")) : this[d]() : null
    }, f.fn["outer" + c] = function(a) {
      var b = this[0];
      return b ? b.style ? parseFloat(f.css(b, d, a ? "margin" : "border")) : this[d]() : null
    }, f.fn[d] = function(a) {
      var e = this[0];
      if(!e) {
        return a == null ? null : this
      }
      if(f.isFunction(a)) {
        return this.each(function(b) {
          var c = f(this);
          c[d](a.call(this, b, c[d]()))
        })
      }
      if(f.isWindow(e)) {
        var g = e.document.documentElement["client" + c], h = e.document.body;
        return e.document.compatMode === "CSS1Compat" && g || h && h["client" + c] || g
      }
      if(e.nodeType === 9) {
        return Math.max(e.documentElement["client" + c], e.body["scroll" + c], e.documentElement["scroll" + c], e.body["offset" + c], e.documentElement["offset" + c])
      }
      if(a === b) {
        var i = f.css(e, d), j = parseFloat(i);
        return f.isNumeric(j) ? j : i
      }
      return this.css(d, typeof a == "string" ? a : a + "px")
    }
  }), a.jQuery = a.$ = f, typeof define == "function" && define.amd && define.amd.jQuery && define("jquery", [], function() {
    return f
  })
})(window);
(function(a, b) {
  function d(b) {
    return!a(b).parents().andSelf().filter(function() {
      return a.curCSS(this, "visibility") === "hidden" || a.expr.filters.hidden(this)
    }).length
  }
  function c(b, c) {
    var e = b.nodeName.toLowerCase();
    if("area" === e) {
      var f = b.parentNode, g = f.name, h;
      if(!b.href || !g || f.nodeName.toLowerCase() !== "map") {
        return!1
      }
      h = a("img[usemap=#" + g + "]")[0];
      return!!h && d(h)
    }
    return(/input|select|textarea|button|object/.test(e) ? !b.disabled : "a" == e ? b.href || c : c) && d(b)
  }
  a.ui = a.ui || {};
  a.ui.version || (a.extend(a.ui, {version:"1.8.18", keyCode:{ALT:18, BACKSPACE:8, CAPS_LOCK:20, COMMA:188, COMMAND:91, COMMAND_LEFT:91, COMMAND_RIGHT:93, CONTROL:17, DELETE:46, DOWN:40, END:35, ENTER:13, ESCAPE:27, HOME:36, INSERT:45, LEFT:37, MENU:93, NUMPAD_ADD:107, NUMPAD_DECIMAL:110, NUMPAD_DIVIDE:111, NUMPAD_ENTER:108, NUMPAD_MULTIPLY:106, NUMPAD_SUBTRACT:109, PAGE_DOWN:34, PAGE_UP:33, PERIOD:190, RIGHT:39, SHIFT:16, SPACE:32, TAB:9, UP:38, WINDOWS:91}}), a.fn.extend({propAttr:a.fn.prop || 
  a.fn.attr, _focus:a.fn.focus, focus:function(b, c) {
    return typeof b == "number" ? this.each(function() {
      var d = this;
      setTimeout(function() {
        a(d).focus(), c && c.call(d)
      }, b)
    }) : this._focus.apply(this, arguments)
  }, scrollParent:function() {
    var b;
    a.browser.msie && /(static|relative)/.test(this.css("position")) || /absolute/.test(this.css("position")) ? b = this.parents().filter(function() {
      return/(relative|absolute|fixed)/.test(a.curCSS(this, "position", 1)) && /(auto|scroll)/.test(a.curCSS(this, "overflow", 1) + a.curCSS(this, "overflow-y", 1) + a.curCSS(this, "overflow-x", 1))
    }).eq(0) : b = this.parents().filter(function() {
      return/(auto|scroll)/.test(a.curCSS(this, "overflow", 1) + a.curCSS(this, "overflow-y", 1) + a.curCSS(this, "overflow-x", 1))
    }).eq(0);
    return/fixed/.test(this.css("position")) || !b.length ? a(document) : b
  }, zIndex:function(c) {
    if(c !== b) {
      return this.css("zIndex", c)
    }
    if(this.length) {
      var d = a(this[0]), e, f;
      while(d.length && d[0] !== document) {
        e = d.css("position");
        if(e === "absolute" || e === "relative" || e === "fixed") {
          f = parseInt(d.css("zIndex"), 10);
          if(!isNaN(f) && f !== 0) {
            return f
          }
        }
        d = d.parent()
      }
    }
    return 0
  }, disableSelection:function() {
    return this.bind((a.support.selectstart ? "selectstart" : "mousedown") + ".ui-disableSelection", function(a) {
      a.preventDefault()
    })
  }, enableSelection:function() {
    return this.unbind(".ui-disableSelection")
  }}), a.each(["Width", "Height"], function(c, d) {
    function h(b, c, d, f) {
      a.each(e, function() {
        c -= parseFloat(a.curCSS(b, "padding" + this, !0)) || 0, d && (c -= parseFloat(a.curCSS(b, "border" + this + "Width", !0)) || 0), f && (c -= parseFloat(a.curCSS(b, "margin" + this, !0)) || 0)
      });
      return c
    }
    var e = d === "Width" ? ["Left", "Right"] : ["Top", "Bottom"], f = d.toLowerCase(), g = {innerWidth:a.fn.innerWidth, innerHeight:a.fn.innerHeight, outerWidth:a.fn.outerWidth, outerHeight:a.fn.outerHeight};
    a.fn["inner" + d] = function(c) {
      if(c === b) {
        return g["inner" + d].call(this)
      }
      return this.each(function() {
        a(this).css(f, h(this, c) + "px")
      })
    }, a.fn["outer" + d] = function(b, c) {
      if(typeof b != "number") {
        return g["outer" + d].call(this, b)
      }
      return this.each(function() {
        a(this).css(f, h(this, b, !0, c) + "px")
      })
    }
  }), a.extend(a.expr[":"], {data:function(b, c, d) {
    return!!a.data(b, d[3])
  }, focusable:function(b) {
    return c(b, !isNaN(a.attr(b, "tabindex")))
  }, tabbable:function(b) {
    var d = a.attr(b, "tabindex"), e = isNaN(d);
    return(e || d >= 0) && c(b, !e)
  }}), a(function() {
    var b = document.body, c = b.appendChild(c = document.createElement("div"));
    c.offsetHeight, a.extend(c.style, {minHeight:"100px", height:"auto", padding:0, borderWidth:0}), a.support.minHeight = c.offsetHeight === 100, a.support.selectstart = "onselectstart" in c, b.removeChild(c).style.display = "none"
  }), a.extend(a.ui, {plugin:{add:function(b, c, d) {
    var e = a.ui[b].prototype;
    for(var f in d) {
      e.plugins[f] = e.plugins[f] || [], e.plugins[f].push([c, d[f]])
    }
  }, call:function(a, b, c) {
    var d = a.plugins[b];
    if(!!d && !!a.element[0].parentNode) {
      for(var e = 0;e < d.length;e++) {
        a.options[d[e][0]] && d[e][1].apply(a.element, c)
      }
    }
  }}, contains:function(a, b) {
    return document.compareDocumentPosition ? a.compareDocumentPosition(b) & 16 : a !== b && a.contains(b)
  }, hasScroll:function(b, c) {
    if(a(b).css("overflow") === "hidden") {
      return!1
    }
    var d = c && c === "left" ? "scrollLeft" : "scrollTop", e = !1;
    if(b[d] > 0) {
      return!0
    }
    b[d] = 1, e = b[d] > 0, b[d] = 0;
    return e
  }, isOverAxis:function(a, b, c) {
    return a > b && a < b + c
  }, isOver:function(b, c, d, e, f, g) {
    return a.ui.isOverAxis(b, d, f) && a.ui.isOverAxis(c, e, g)
  }}))
})(jQuery);
(function(a, b) {
  if(a.cleanData) {
    var c = a.cleanData;
    a.cleanData = function(b) {
      for(var d = 0, e;(e = b[d]) != null;d++) {
        try {
          a(e).triggerHandler("remove")
        }catch(f) {
        }
      }
      c(b)
    }
  }else {
    var d = a.fn.remove;
    a.fn.remove = function(b, c) {
      return this.each(function() {
        c || (!b || a.filter(b, [this]).length) && a("*", this).add([this]).each(function() {
          try {
            a(this).triggerHandler("remove")
          }catch(b) {
          }
        });
        return d.call(a(this), b, c)
      })
    }
  }
  a.widget = function(b, c, d) {
    var e = b.split(".")[0], f;
    b = b.split(".")[1], f = e + "-" + b, d || (d = c, c = a.Widget), a.expr[":"][f] = function(c) {
      return!!a.data(c, b)
    }, a[e] = a[e] || {}, a[e][b] = function(a, b) {
      arguments.length && this._createWidget(a, b)
    };
    var g = new c;
    g.options = a.extend(!0, {}, g.options), a[e][b].prototype = a.extend(!0, g, {namespace:e, widgetName:b, widgetEventPrefix:a[e][b].prototype.widgetEventPrefix || b, widgetBaseClass:f}, d), a.widget.bridge(b, a[e][b])
  }, a.widget.bridge = function(c, d) {
    a.fn[c] = function(e) {
      var f = typeof e == "string", g = Array.prototype.slice.call(arguments, 1), h = this;
      e = !f && g.length ? a.extend.apply(null, [!0, e].concat(g)) : e;
      if(f && e.charAt(0) === "_") {
        return h
      }
      f ? this.each(function() {
        var d = a.data(this, c), f = d && a.isFunction(d[e]) ? d[e].apply(d, g) : d;
        if(f !== d && f !== b) {
          h = f;
          return!1
        }
      }) : this.each(function() {
        var b = a.data(this, c);
        b ? b.option(e || {})._init() : a.data(this, c, new d(e, this))
      });
      return h
    }
  }, a.Widget = function(a, b) {
    arguments.length && this._createWidget(a, b)
  }, a.Widget.prototype = {widgetName:"widget", widgetEventPrefix:"", options:{disabled:!1}, _createWidget:function(b, c) {
    a.data(c, this.widgetName, this), this.element = a(c), this.options = a.extend(!0, {}, this.options, this._getCreateOptions(), b);
    var d = this;
    this.element.bind("remove." + this.widgetName, function() {
      d.destroy()
    }), this._create(), this._trigger("create"), this._init()
  }, _getCreateOptions:function() {
    return a.metadata && a.metadata.get(this.element[0])[this.widgetName]
  }, _create:function() {
  }, _init:function() {
  }, destroy:function() {
    this.element.unbind("." + this.widgetName).removeData(this.widgetName), this.widget().unbind("." + this.widgetName).removeAttr("aria-disabled").removeClass(this.widgetBaseClass + "-disabled " + "ui-state-disabled")
  }, widget:function() {
    return this.element
  }, option:function(c, d) {
    var e = c;
    if(arguments.length === 0) {
      return a.extend({}, this.options)
    }
    if(typeof c == "string") {
      if(d === b) {
        return this.options[c]
      }
      e = {}, e[c] = d
    }
    this._setOptions(e);
    return this
  }, _setOptions:function(b) {
    var c = this;
    a.each(b, function(a, b) {
      c._setOption(a, b)
    });
    return this
  }, _setOption:function(a, b) {
    this.options[a] = b, a === "disabled" && this.widget()[b ? "addClass" : "removeClass"](this.widgetBaseClass + "-disabled" + " " + "ui-state-disabled").attr("aria-disabled", b);
    return this
  }, enable:function() {
    return this._setOption("disabled", !1)
  }, disable:function() {
    return this._setOption("disabled", !0)
  }, _trigger:function(b, c, d) {
    var e, f, g = this.options[b];
    d = d || {}, c = a.Event(c), c.type = (b === this.widgetEventPrefix ? b : this.widgetEventPrefix + b).toLowerCase(), c.target = this.element[0], f = c.originalEvent;
    if(f) {
      for(e in f) {
        e in c || (c[e] = f[e])
      }
    }
    this.element.trigger(c, d);
    return!(a.isFunction(g) && g.call(this.element[0], c, d) === !1 || c.isDefaultPrevented())
  }}
})(jQuery);
(function(a, b) {
  var c = !1;
  a(document).mouseup(function(a) {
    c = !1
  }), a.widget("ui.mouse", {options:{cancel:":input,option", distance:1, delay:0}, _mouseInit:function() {
    var b = this;
    this.element.bind("mousedown." + this.widgetName, function(a) {
      return b._mouseDown(a)
    }).bind("click." + this.widgetName, function(c) {
      if(!0 === a.data(c.target, b.widgetName + ".preventClickEvent")) {
        a.removeData(c.target, b.widgetName + ".preventClickEvent"), c.stopImmediatePropagation();
        return!1
      }
    }), this.started = !1
  }, _mouseDestroy:function() {
    this.element.unbind("." + this.widgetName)
  }, _mouseDown:function(b) {
    if(!c) {
      this._mouseStarted && this._mouseUp(b), this._mouseDownEvent = b;
      var d = this, e = b.which == 1, f = typeof this.options.cancel == "string" && b.target.nodeName ? a(b.target).closest(this.options.cancel).length : !1;
      if(!e || f || !this._mouseCapture(b)) {
        return!0
      }
      this.mouseDelayMet = !this.options.delay, this.mouseDelayMet || (this._mouseDelayTimer = setTimeout(function() {
        d.mouseDelayMet = !0
      }, this.options.delay));
      if(this._mouseDistanceMet(b) && this._mouseDelayMet(b)) {
        this._mouseStarted = this._mouseStart(b) !== !1;
        if(!this._mouseStarted) {
          b.preventDefault();
          return!0
        }
      }
      !0 === a.data(b.target, this.widgetName + ".preventClickEvent") && a.removeData(b.target, this.widgetName + ".preventClickEvent"), this._mouseMoveDelegate = function(a) {
        return d._mouseMove(a)
      }, this._mouseUpDelegate = function(a) {
        return d._mouseUp(a)
      }, a(document).bind("mousemove." + this.widgetName, this._mouseMoveDelegate).bind("mouseup." + this.widgetName, this._mouseUpDelegate), b.preventDefault(), c = !0;
      return!0
    }
  }, _mouseMove:function(b) {
    if(a.browser.msie && !(document.documentMode >= 9) && !b.button) {
      return this._mouseUp(b)
    }
    if(this._mouseStarted) {
      this._mouseDrag(b);
      return b.preventDefault()
    }
    this._mouseDistanceMet(b) && this._mouseDelayMet(b) && (this._mouseStarted = this._mouseStart(this._mouseDownEvent, b) !== !1, this._mouseStarted ? this._mouseDrag(b) : this._mouseUp(b));
    return!this._mouseStarted
  }, _mouseUp:function(b) {
    a(document).unbind("mousemove." + this.widgetName, this._mouseMoveDelegate).unbind("mouseup." + this.widgetName, this._mouseUpDelegate), this._mouseStarted && (this._mouseStarted = !1, b.target == this._mouseDownEvent.target && a.data(b.target, this.widgetName + ".preventClickEvent", !0), this._mouseStop(b));
    return!1
  }, _mouseDistanceMet:function(a) {
    return Math.max(Math.abs(this._mouseDownEvent.pageX - a.pageX), Math.abs(this._mouseDownEvent.pageY - a.pageY)) >= this.options.distance
  }, _mouseDelayMet:function(a) {
    return this.mouseDelayMet
  }, _mouseStart:function(a) {
  }, _mouseDrag:function(a) {
  }, _mouseStop:function(a) {
  }, _mouseCapture:function(a) {
    return!0
  }})
})(jQuery);
(function(a, b) {
  a.widget("ui.draggable", a.ui.mouse, {widgetEventPrefix:"drag", options:{addClasses:!0, appendTo:"parent", axis:!1, connectToSortable:!1, containment:!1, cursor:"auto", cursorAt:!1, grid:!1, handle:!1, helper:"original", iframeFix:!1, opacity:!1, refreshPositions:!1, revert:!1, revertDuration:500, scope:"default", scroll:!0, scrollSensitivity:20, scrollSpeed:20, snap:!1, snapMode:"both", snapTolerance:20, stack:!1, zIndex:!1}, _create:function() {
    this.options.helper == "original" && !/^(?:r|a|f)/.test(this.element.css("position")) && (this.element[0].style.position = "relative"), this.options.addClasses && this.element.addClass("ui-draggable"), this.options.disabled && this.element.addClass("ui-draggable-disabled"), this._mouseInit()
  }, destroy:function() {
    if(!!this.element.data("draggable")) {
      this.element.removeData("draggable").unbind(".draggable").removeClass("ui-draggable ui-draggable-dragging ui-draggable-disabled"), this._mouseDestroy();
      return this
    }
  }, _mouseCapture:function(b) {
    var c = this.options;
    if(this.helper || c.disabled || a(b.target).is(".ui-resizable-handle")) {
      return!1
    }
    this.handle = this._getHandle(b);
    if(!this.handle) {
      return!1
    }
    c.iframeFix && a(c.iframeFix === !0 ? "iframe" : c.iframeFix).each(function() {
      a('<div class="ui-draggable-iframeFix" style="background: #fff;"></div>').css({width:this.offsetWidth + "px", height:this.offsetHeight + "px", position:"absolute", opacity:"0.001", zIndex:1E3}).css(a(this).offset()).appendTo("body")
    });
    return!0
  }, _mouseStart:function(b) {
    var c = this.options;
    this.helper = this._createHelper(b), this._cacheHelperProportions(), a.ui.ddmanager && (a.ui.ddmanager.current = this), this._cacheMargins(), this.cssPosition = this.helper.css("position"), this.scrollParent = this.helper.scrollParent(), this.offset = this.positionAbs = this.element.offset(), this.offset = {top:this.offset.top - this.margins.top, left:this.offset.left - this.margins.left}, a.extend(this.offset, {click:{left:b.pageX - this.offset.left, top:b.pageY - this.offset.top}, parent:this._getParentOffset(), 
    relative:this._getRelativeOffset()}), this.originalPosition = this.position = this._generatePosition(b), this.originalPageX = b.pageX, this.originalPageY = b.pageY, c.cursorAt && this._adjustOffsetFromHelper(c.cursorAt), c.containment && this._setContainment();
    if(this._trigger("start", b) === !1) {
      this._clear();
      return!1
    }
    this._cacheHelperProportions(), a.ui.ddmanager && !c.dropBehaviour && a.ui.ddmanager.prepareOffsets(this, b), this.helper.addClass("ui-draggable-dragging"), this._mouseDrag(b, !0), a.ui.ddmanager && a.ui.ddmanager.dragStart(this, b);
    return!0
  }, _mouseDrag:function(b, c) {
    this.position = this._generatePosition(b), this.positionAbs = this._convertPositionTo("absolute");
    if(!c) {
      var d = this._uiHash();
      if(this._trigger("drag", b, d) === !1) {
        this._mouseUp({});
        return!1
      }
      this.position = d.position
    }
    if(!this.options.axis || this.options.axis != "y") {
      this.helper[0].style.left = this.position.left + "px"
    }
    if(!this.options.axis || this.options.axis != "x") {
      this.helper[0].style.top = this.position.top + "px"
    }
    a.ui.ddmanager && a.ui.ddmanager.drag(this, b);
    return!1
  }, _mouseStop:function(b) {
    var c = !1;
    a.ui.ddmanager && !this.options.dropBehaviour && (c = a.ui.ddmanager.drop(this, b)), this.dropped && (c = this.dropped, this.dropped = !1);
    if((!this.element[0] || !this.element[0].parentNode) && this.options.helper == "original") {
      return!1
    }
    if(this.options.revert == "invalid" && !c || this.options.revert == "valid" && c || this.options.revert === !0 || a.isFunction(this.options.revert) && this.options.revert.call(this.element, c)) {
      var d = this;
      a(this.helper).animate(this.originalPosition, parseInt(this.options.revertDuration, 10), function() {
        d._trigger("stop", b) !== !1 && d._clear()
      })
    }else {
      this._trigger("stop", b) !== !1 && this._clear()
    }
    return!1
  }, _mouseUp:function(b) {
    this.options.iframeFix === !0 && a("div.ui-draggable-iframeFix").each(function() {
      this.parentNode.removeChild(this)
    }), a.ui.ddmanager && a.ui.ddmanager.dragStop(this, b);
    return a.ui.mouse.prototype._mouseUp.call(this, b)
  }, cancel:function() {
    this.helper.is(".ui-draggable-dragging") ? this._mouseUp({}) : this._clear();
    return this
  }, _getHandle:function(b) {
    var c = !this.options.handle || !a(this.options.handle, this.element).length ? !0 : !1;
    a(this.options.handle, this.element).find("*").andSelf().each(function() {
      this == b.target && (c = !0)
    });
    return c
  }, _createHelper:function(b) {
    var c = this.options, d = a.isFunction(c.helper) ? a(c.helper.apply(this.element[0], [b])) : c.helper == "clone" ? this.element.clone().removeAttr("id") : this.element;
    d.parents("body").length || d.appendTo(c.appendTo == "parent" ? this.element[0].parentNode : c.appendTo), d[0] != this.element[0] && !/(fixed|absolute)/.test(d.css("position")) && d.css("position", "absolute");
    return d
  }, _adjustOffsetFromHelper:function(b) {
    typeof b == "string" && (b = b.split(" ")), a.isArray(b) && (b = {left:+b[0], top:+b[1] || 0}), "left" in b && (this.offset.click.left = b.left + this.margins.left), "right" in b && (this.offset.click.left = this.helperProportions.width - b.right + this.margins.left), "top" in b && (this.offset.click.top = b.top + this.margins.top), "bottom" in b && (this.offset.click.top = this.helperProportions.height - b.bottom + this.margins.top)
  }, _getParentOffset:function() {
    this.offsetParent = this.helper.offsetParent();
    var b = this.offsetParent.offset();
    this.cssPosition == "absolute" && this.scrollParent[0] != document && a.ui.contains(this.scrollParent[0], this.offsetParent[0]) && (b.left += this.scrollParent.scrollLeft(), b.top += this.scrollParent.scrollTop());
    if(this.offsetParent[0] == document.body || this.offsetParent[0].tagName && this.offsetParent[0].tagName.toLowerCase() == "html" && a.browser.msie) {
      b = {top:0, left:0}
    }
    return{top:b.top + (parseInt(this.offsetParent.css("borderTopWidth"), 10) || 0), left:b.left + (parseInt(this.offsetParent.css("borderLeftWidth"), 10) || 0)}
  }, _getRelativeOffset:function() {
    if(this.cssPosition == "relative") {
      var a = this.element.position();
      return{top:a.top - (parseInt(this.helper.css("top"), 10) || 0) + this.scrollParent.scrollTop(), left:a.left - (parseInt(this.helper.css("left"), 10) || 0) + this.scrollParent.scrollLeft()}
    }
    return{top:0, left:0}
  }, _cacheMargins:function() {
    this.margins = {left:parseInt(this.element.css("marginLeft"), 10) || 0, top:parseInt(this.element.css("marginTop"), 10) || 0, right:parseInt(this.element.css("marginRight"), 10) || 0, bottom:parseInt(this.element.css("marginBottom"), 10) || 0}
  }, _cacheHelperProportions:function() {
    this.helperProportions = {width:this.helper.outerWidth(), height:this.helper.outerHeight()}
  }, _setContainment:function() {
    var b = this.options;
    b.containment == "parent" && (b.containment = this.helper[0].parentNode);
    if(b.containment == "document" || b.containment == "window") {
      this.containment = [b.containment == "document" ? 0 : a(window).scrollLeft() - this.offset.relative.left - this.offset.parent.left, b.containment == "document" ? 0 : a(window).scrollTop() - this.offset.relative.top - this.offset.parent.top, (b.containment == "document" ? 0 : a(window).scrollLeft()) + a(b.containment == "document" ? document : window).width() - this.helperProportions.width - this.margins.left, (b.containment == "document" ? 0 : a(window).scrollTop()) + (a(b.containment == "document" ? 
      document : window).height() || document.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top]
    }
    if(!/^(document|window|parent)$/.test(b.containment) && b.containment.constructor != Array) {
      var c = a(b.containment), d = c[0];
      if(!d) {
        return
      }
      var e = c.offset(), f = a(d).css("overflow") != "hidden";
      this.containment = [(parseInt(a(d).css("borderLeftWidth"), 10) || 0) + (parseInt(a(d).css("paddingLeft"), 10) || 0), (parseInt(a(d).css("borderTopWidth"), 10) || 0) + (parseInt(a(d).css("paddingTop"), 10) || 0), (f ? Math.max(d.scrollWidth, d.offsetWidth) : d.offsetWidth) - (parseInt(a(d).css("borderLeftWidth"), 10) || 0) - (parseInt(a(d).css("paddingRight"), 10) || 0) - this.helperProportions.width - this.margins.left - this.margins.right, (f ? Math.max(d.scrollHeight, d.offsetHeight) : d.offsetHeight) - 
      (parseInt(a(d).css("borderTopWidth"), 10) || 0) - (parseInt(a(d).css("paddingBottom"), 10) || 0) - this.helperProportions.height - this.margins.top - this.margins.bottom], this.relative_container = c
    }else {
      b.containment.constructor == Array && (this.containment = b.containment)
    }
  }, _convertPositionTo:function(b, c) {
    c || (c = this.position);
    var d = b == "absolute" ? 1 : -1, e = this.options, f = this.cssPosition == "absolute" && (this.scrollParent[0] == document || !a.ui.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent, g = /(html|body)/i.test(f[0].tagName);
    return{top:c.top + this.offset.relative.top * d + this.offset.parent.top * d - (a.browser.safari && a.browser.version < 526 && this.cssPosition == "fixed" ? 0 : (this.cssPosition == "fixed" ? -this.scrollParent.scrollTop() : g ? 0 : f.scrollTop()) * d), left:c.left + this.offset.relative.left * d + this.offset.parent.left * d - (a.browser.safari && a.browser.version < 526 && this.cssPosition == "fixed" ? 0 : (this.cssPosition == "fixed" ? -this.scrollParent.scrollLeft() : g ? 0 : f.scrollLeft()) * 
    d)}
  }, _generatePosition:function(b) {
    var c = this.options, d = this.cssPosition == "absolute" && (this.scrollParent[0] == document || !a.ui.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent, e = /(html|body)/i.test(d[0].tagName), f = b.pageX, g = b.pageY;
    if(this.originalPosition) {
      var h;
      if(this.containment) {
        if(this.relative_container) {
          var i = this.relative_container.offset();
          h = [this.containment[0] + i.left, this.containment[1] + i.top, this.containment[2] + i.left, this.containment[3] + i.top]
        }else {
          h = this.containment
        }
        b.pageX - this.offset.click.left < h[0] && (f = h[0] + this.offset.click.left), b.pageY - this.offset.click.top < h[1] && (g = h[1] + this.offset.click.top), b.pageX - this.offset.click.left > h[2] && (f = h[2] + this.offset.click.left), b.pageY - this.offset.click.top > h[3] && (g = h[3] + this.offset.click.top)
      }
      if(c.grid) {
        var j = c.grid[1] ? this.originalPageY + Math.round((g - this.originalPageY) / c.grid[1]) * c.grid[1] : this.originalPageY;
        g = h ? j - this.offset.click.top < h[1] || j - this.offset.click.top > h[3] ? j - this.offset.click.top < h[1] ? j + c.grid[1] : j - c.grid[1] : j : j;
        var k = c.grid[0] ? this.originalPageX + Math.round((f - this.originalPageX) / c.grid[0]) * c.grid[0] : this.originalPageX;
        f = h ? k - this.offset.click.left < h[0] || k - this.offset.click.left > h[2] ? k - this.offset.click.left < h[0] ? k + c.grid[0] : k - c.grid[0] : k : k
      }
    }
    return{top:g - this.offset.click.top - this.offset.relative.top - this.offset.parent.top + (a.browser.safari && a.browser.version < 526 && this.cssPosition == "fixed" ? 0 : this.cssPosition == "fixed" ? -this.scrollParent.scrollTop() : e ? 0 : d.scrollTop()), left:f - this.offset.click.left - this.offset.relative.left - this.offset.parent.left + (a.browser.safari && a.browser.version < 526 && this.cssPosition == "fixed" ? 0 : this.cssPosition == "fixed" ? -this.scrollParent.scrollLeft() : e ? 
    0 : d.scrollLeft())}
  }, _clear:function() {
    this.helper.removeClass("ui-draggable-dragging"), this.helper[0] != this.element[0] && !this.cancelHelperRemoval && this.helper.remove(), this.helper = null, this.cancelHelperRemoval = !1
  }, _trigger:function(b, c, d) {
    d = d || this._uiHash(), a.ui.plugin.call(this, b, [c, d]), b == "drag" && (this.positionAbs = this._convertPositionTo("absolute"));
    return a.Widget.prototype._trigger.call(this, b, c, d)
  }, plugins:{}, _uiHash:function(a) {
    return{helper:this.helper, position:this.position, originalPosition:this.originalPosition, offset:this.positionAbs}
  }}), a.extend(a.ui.draggable, {version:"1.8.18"}), a.ui.plugin.add("draggable", "connectToSortable", {start:function(b, c) {
    var d = a(this).data("draggable"), e = d.options, f = a.extend({}, c, {item:d.element});
    d.sortables = [], a(e.connectToSortable).each(function() {
      var c = a.data(this, "sortable");
      c && !c.options.disabled && (d.sortables.push({instance:c, shouldRevert:c.options.revert}), c.refreshPositions(), c._trigger("activate", b, f))
    })
  }, stop:function(b, c) {
    var d = a(this).data("draggable"), e = a.extend({}, c, {item:d.element});
    a.each(d.sortables, function() {
      this.instance.isOver ? (this.instance.isOver = 0, d.cancelHelperRemoval = !0, this.instance.cancelHelperRemoval = !1, this.shouldRevert && (this.instance.options.revert = !0), this.instance._mouseStop(b), this.instance.options.helper = this.instance.options._helper, d.options.helper == "original" && this.instance.currentItem.css({top:"auto", left:"auto"})) : (this.instance.cancelHelperRemoval = !1, this.instance._trigger("deactivate", b, e))
    })
  }, drag:function(b, c) {
    var d = a(this).data("draggable"), e = this, f = function(b) {
      var c = this.offset.click.top, d = this.offset.click.left, e = this.positionAbs.top, f = this.positionAbs.left, g = b.height, h = b.width, i = b.top, j = b.left;
      return a.ui.isOver(e + c, f + d, i, j, g, h)
    };
    a.each(d.sortables, function(f) {
      this.instance.positionAbs = d.positionAbs, this.instance.helperProportions = d.helperProportions, this.instance.offset.click = d.offset.click, this.instance._intersectsWith(this.instance.containerCache) ? (this.instance.isOver || (this.instance.isOver = 1, this.instance.currentItem = a(e).clone().removeAttr("id").appendTo(this.instance.element).data("sortable-item", !0), this.instance.options._helper = this.instance.options.helper, this.instance.options.helper = function() {
        return c.helper[0]
      }, b.target = this.instance.currentItem[0], this.instance._mouseCapture(b, !0), this.instance._mouseStart(b, !0, !0), this.instance.offset.click.top = d.offset.click.top, this.instance.offset.click.left = d.offset.click.left, this.instance.offset.parent.left -= d.offset.parent.left - this.instance.offset.parent.left, this.instance.offset.parent.top -= d.offset.parent.top - this.instance.offset.parent.top, d._trigger("toSortable", b), d.dropped = this.instance.element, d.currentItem = d.element, 
      this.instance.fromOutside = d), this.instance.currentItem && this.instance._mouseDrag(b)) : this.instance.isOver && (this.instance.isOver = 0, this.instance.cancelHelperRemoval = !0, this.instance.options.revert = !1, this.instance._trigger("out", b, this.instance._uiHash(this.instance)), this.instance._mouseStop(b, !0), this.instance.options.helper = this.instance.options._helper, this.instance.currentItem.remove(), this.instance.placeholder && this.instance.placeholder.remove(), d._trigger("fromSortable", 
      b), d.dropped = !1)
    })
  }}), a.ui.plugin.add("draggable", "cursor", {start:function(b, c) {
    var d = a("body"), e = a(this).data("draggable").options;
    d.css("cursor") && (e._cursor = d.css("cursor")), d.css("cursor", e.cursor)
  }, stop:function(b, c) {
    var d = a(this).data("draggable").options;
    d._cursor && a("body").css("cursor", d._cursor)
  }}), a.ui.plugin.add("draggable", "opacity", {start:function(b, c) {
    var d = a(c.helper), e = a(this).data("draggable").options;
    d.css("opacity") && (e._opacity = d.css("opacity")), d.css("opacity", e.opacity)
  }, stop:function(b, c) {
    var d = a(this).data("draggable").options;
    d._opacity && a(c.helper).css("opacity", d._opacity)
  }}), a.ui.plugin.add("draggable", "scroll", {start:function(b, c) {
    var d = a(this).data("draggable");
    d.scrollParent[0] != document && d.scrollParent[0].tagName != "HTML" && (d.overflowOffset = d.scrollParent.offset())
  }, drag:function(b, c) {
    var d = a(this).data("draggable"), e = d.options, f = !1;
    if(d.scrollParent[0] != document && d.scrollParent[0].tagName != "HTML") {
      if(!e.axis || e.axis != "x") {
        d.overflowOffset.top + d.scrollParent[0].offsetHeight - b.pageY < e.scrollSensitivity ? d.scrollParent[0].scrollTop = f = d.scrollParent[0].scrollTop + e.scrollSpeed : b.pageY - d.overflowOffset.top < e.scrollSensitivity && (d.scrollParent[0].scrollTop = f = d.scrollParent[0].scrollTop - e.scrollSpeed)
      }
      if(!e.axis || e.axis != "y") {
        d.overflowOffset.left + d.scrollParent[0].offsetWidth - b.pageX < e.scrollSensitivity ? d.scrollParent[0].scrollLeft = f = d.scrollParent[0].scrollLeft + e.scrollSpeed : b.pageX - d.overflowOffset.left < e.scrollSensitivity && (d.scrollParent[0].scrollLeft = f = d.scrollParent[0].scrollLeft - e.scrollSpeed)
      }
    }else {
      if(!e.axis || e.axis != "x") {
        b.pageY - a(document).scrollTop() < e.scrollSensitivity ? f = a(document).scrollTop(a(document).scrollTop() - e.scrollSpeed) : a(window).height() - (b.pageY - a(document).scrollTop()) < e.scrollSensitivity && (f = a(document).scrollTop(a(document).scrollTop() + e.scrollSpeed))
      }
      if(!e.axis || e.axis != "y") {
        b.pageX - a(document).scrollLeft() < e.scrollSensitivity ? f = a(document).scrollLeft(a(document).scrollLeft() - e.scrollSpeed) : a(window).width() - (b.pageX - a(document).scrollLeft()) < e.scrollSensitivity && (f = a(document).scrollLeft(a(document).scrollLeft() + e.scrollSpeed))
      }
    }
    f !== !1 && a.ui.ddmanager && !e.dropBehaviour && a.ui.ddmanager.prepareOffsets(d, b)
  }}), a.ui.plugin.add("draggable", "snap", {start:function(b, c) {
    var d = a(this).data("draggable"), e = d.options;
    d.snapElements = [], a(e.snap.constructor != String ? e.snap.items || ":data(draggable)" : e.snap).each(function() {
      var b = a(this), c = b.offset();
      this != d.element[0] && d.snapElements.push({item:this, width:b.outerWidth(), height:b.outerHeight(), top:c.top, left:c.left})
    })
  }, drag:function(b, c) {
    var d = a(this).data("draggable"), e = d.options, f = e.snapTolerance, g = c.offset.left, h = g + d.helperProportions.width, i = c.offset.top, j = i + d.helperProportions.height;
    for(var k = d.snapElements.length - 1;k >= 0;k--) {
      var l = d.snapElements[k].left, m = l + d.snapElements[k].width, n = d.snapElements[k].top, o = n + d.snapElements[k].height;
      if(!(l - f < g && g < m + f && n - f < i && i < o + f || l - f < g && g < m + f && n - f < j && j < o + f || l - f < h && h < m + f && n - f < i && i < o + f || l - f < h && h < m + f && n - f < j && j < o + f)) {
        d.snapElements[k].snapping && d.options.snap.release && d.options.snap.release.call(d.element, b, a.extend(d._uiHash(), {snapItem:d.snapElements[k].item})), d.snapElements[k].snapping = !1;
        continue
      }
      if(e.snapMode != "inner") {
        var p = Math.abs(n - j) <= f, q = Math.abs(o - i) <= f, r = Math.abs(l - h) <= f, s = Math.abs(m - g) <= f;
        p && (c.position.top = d._convertPositionTo("relative", {top:n - d.helperProportions.height, left:0}).top - d.margins.top), q && (c.position.top = d._convertPositionTo("relative", {top:o, left:0}).top - d.margins.top), r && (c.position.left = d._convertPositionTo("relative", {top:0, left:l - d.helperProportions.width}).left - d.margins.left), s && (c.position.left = d._convertPositionTo("relative", {top:0, left:m}).left - d.margins.left)
      }
      var t = p || q || r || s;
      if(e.snapMode != "outer") {
        var p = Math.abs(n - i) <= f, q = Math.abs(o - j) <= f, r = Math.abs(l - g) <= f, s = Math.abs(m - h) <= f;
        p && (c.position.top = d._convertPositionTo("relative", {top:n, left:0}).top - d.margins.top), q && (c.position.top = d._convertPositionTo("relative", {top:o - d.helperProportions.height, left:0}).top - d.margins.top), r && (c.position.left = d._convertPositionTo("relative", {top:0, left:l}).left - d.margins.left), s && (c.position.left = d._convertPositionTo("relative", {top:0, left:m - d.helperProportions.width}).left - d.margins.left)
      }
      !d.snapElements[k].snapping && (p || q || r || s || t) && d.options.snap.snap && d.options.snap.snap.call(d.element, b, a.extend(d._uiHash(), {snapItem:d.snapElements[k].item})), d.snapElements[k].snapping = p || q || r || s || t
    }
  }}), a.ui.plugin.add("draggable", "stack", {start:function(b, c) {
    var d = a(this).data("draggable").options, e = a.makeArray(a(d.stack)).sort(function(b, c) {
      return(parseInt(a(b).css("zIndex"), 10) || 0) - (parseInt(a(c).css("zIndex"), 10) || 0)
    });
    if(!!e.length) {
      var f = parseInt(e[0].style.zIndex) || 0;
      a(e).each(function(a) {
        this.style.zIndex = f + a
      }), this[0].style.zIndex = f + e.length
    }
  }}), a.ui.plugin.add("draggable", "zIndex", {start:function(b, c) {
    var d = a(c.helper), e = a(this).data("draggable").options;
    d.css("zIndex") && (e._zIndex = d.css("zIndex")), d.css("zIndex", e.zIndex)
  }, stop:function(b, c) {
    var d = a(this).data("draggable").options;
    d._zIndex && a(c.helper).css("zIndex", d._zIndex)
  }})
})(jQuery);
var Hashtable = function() {
  function c(b) {
    var d;
    if(typeof b == "string") {
      return b
    }
    if(typeof b.hashCode == a) {
      return d = b.hashCode(), typeof d == "string" ? d : c(d)
    }
    if(typeof b.toString == a) {
      return b.toString()
    }
    try {
      return String(b)
    }catch(e) {
      return Object.prototype.toString.call(b)
    }
  }
  function d(a, b) {
    return a.equals(b)
  }
  function e(b, c) {
    return typeof c.equals == a ? c.equals(b) : b === c
  }
  function f(a) {
    return function(b) {
      if(b === null) {
        throw new Error("null is not a valid " + a);
      }
      if(typeof b == "undefined") {
        throw new Error(a + " must not be undefined");
      }
    }
  }
  function i(a, b, c, d) {
    this[0] = a, this.entries = [], this.addEntry(b, c), d !== null && (this.getEqualityFunction = function() {
      return d
    })
  }
  function m(a) {
    return function(b) {
      var c = this.entries.length, d, e = this.getEqualityFunction(b);
      while(c--) {
        d = this.entries[c];
        if(e(b, d[0])) {
          switch(a) {
            case j:
              return!0;
            case k:
              return d;
            case l:
              return[c, d[1]]
          }
        }
      }
      return!1
    }
  }
  function n(a) {
    return function(b) {
      var c = b.length;
      for(var d = 0, e = this.entries.length;d < e;++d) {
        b[c + d] = this.entries[d][a]
      }
    }
  }
  function o(a, b) {
    var c = a.length, d;
    while(c--) {
      d = a[c];
      if(b === d[0]) {
        return c
      }
    }
    return null
  }
  function p(a, b) {
    var c = a[b];
    return c && c instanceof i ? c : null
  }
  function q(d, e) {
    var f = this, j = [], k = {}, l = typeof d == a ? d : c, m = typeof e == a ? e : null;
    this.put = function(a, b) {
      g(a), h(b);
      var c = l(a), d, e, f = null;
      return d = p(k, c), d ? (e = d.getEntryForKey(a), e ? (f = e[1], e[1] = b) : d.addEntry(a, b)) : (d = new i(c, a, b, m), j[j.length] = d, k[c] = d), f
    }, this.get = function(a) {
      g(a);
      var b = l(a), c = p(k, b);
      if(c) {
        var d = c.getEntryForKey(a);
        if(d) {
          return d[1]
        }
      }
      return null
    }, this.containsKey = function(a) {
      g(a);
      var b = l(a), c = p(k, b);
      return c ? c.containsKey(a) : !1
    }, this.containsValue = function(a) {
      h(a);
      var b = j.length;
      while(b--) {
        if(j[b].containsValue(a)) {
          return!0
        }
      }
      return!1
    }, this.clear = function() {
      j.length = 0, k = {}
    }, this.isEmpty = function() {
      return!j.length
    };
    var n = function(a) {
      return function() {
        var b = [], c = j.length;
        while(c--) {
          j[c][a](b)
        }
        return b
      }
    };
    this.keys = n("keys"), this.values = n("values"), this.entries = n("getEntries"), this.remove = function(a) {
      g(a);
      var c = l(a), d, e = null, f = p(k, c);
      return f && (e = f.removeEntryForKey(a), e !== null && (f.entries.length || (d = o(j, c), b(j, d), delete k[c]))), e
    }, this.size = function() {
      var a = 0, b = j.length;
      while(b--) {
        a += j[b].entries.length
      }
      return a
    }, this.each = function(a) {
      var b = f.entries(), c = b.length, d;
      while(c--) {
        d = b[c], a(d[0], d[1])
      }
    }, this.putAll = function(b, c) {
      var d = b.entries(), e, g, h, i, j = d.length, k = typeof c == a;
      while(j--) {
        e = d[j], g = e[0], h = e[1], k && (i = f.get(g)) && (h = c(g, i, h)), f.put(g, h)
      }
    }, this.clone = function() {
      var a = new q(d, e);
      return a.putAll(f), a
    }
  }
  var a = "function", b = typeof Array.prototype.splice == a ? function(a, b) {
    a.splice(b, 1)
  } : function(a, b) {
    var c, d, e;
    if(b === a.length - 1) {
      a.length = b
    }else {
      c = a.slice(b + 1), a.length = b;
      for(d = 0, e = c.length;d < e;++d) {
        a[b + d] = c[d]
      }
    }
  }, g = f("key"), h = f("value"), j = 0, k = 1, l = 2;
  return i.prototype = {getEqualityFunction:function(b) {
    return typeof b.equals == a ? d : e
  }, getEntryForKey:m(k), getEntryAndIndexForKey:m(l), removeEntryForKey:function(a) {
    var c = this.getEntryAndIndexForKey(a);
    return c ? (b(this.entries, c[0]), c[1]) : null
  }, addEntry:function(a, b) {
    this.entries[this.entries.length] = [a, b]
  }, keys:n(0), values:n(1), getEntries:function(a) {
    var b = a.length;
    for(var c = 0, d = this.entries.length;c < d;++c) {
      a[b + c] = this.entries[c].slice(0)
    }
  }, containsKey:m(j), containsValue:function(a) {
    var b = this.entries.length;
    while(b--) {
      if(a === this.entries[b][1]) {
        return!0
      }
    }
    return!1
  }}, q
}();
(function(a) {
  function i(a, b, c) {
    this.dec = a, this.group = b, this.neg = c
  }
  function j() {
    for(var a = 0;a < h.length;a++) {
      localeGroup = h[a];
      for(var c = 0;c < localeGroup.length;c++) {
        b.put(localeGroup[c], a)
      }
    }
  }
  function k(a) {
    b.size() == 0 && j();
    var c = ".", d = ",", e = "-", f = b.get(a);
    if(f) {
      var h = g[f];
      h && (c = h[0], d = h[1])
    }
    return new i(c, d, e)
  }
  var b = new Hashtable, c = ["ae", "au", "ca", "cn", "eg", "gb", "hk", "il", "in", "jp", "sk", "th", "tw", "us"], d = ["at", "br", "de", "dk", "es", "gr", "it", "nl", "pt", "tr", "vn"], e = ["cz", "fi", "fr", "ru", "se", "pl"], f = ["ch"], g = [[".", ","], [",", "."], [",", " "], [".", "'"]], h = [c, d, e, f];
  a.fn.formatNumber = function(b, c, d) {
    return this.each(function() {
      c == null && (c = !0), d == null && (d = !0);
      var e;
      a(this).is(":input") ? e = new String(a(this).val()) : e = new String(a(this).text());
      var f = a.formatNumber(e, b);
      c && (a(this).is(":input") ? a(this).val(f) : a(this).text(f));
      if(d) {
        return f
      }
    })
  }, a.formatNumber = function(b, c) {
    var c = a.extend({}, a.fn.formatNumber.defaults, c), d = k(c.locale.toLowerCase()), e = d.dec, f = d.group, g = d.neg, h = "0#-,.", i = "", j = !1;
    for(var l = 0;l < c.format.length;l++) {
      if(h.indexOf(c.format.charAt(l)) != -1) {
        if(l == 0 && c.format.charAt(l) == "-") {
          j = !0;
          continue
        }
        break
      }
      i += c.format.charAt(l)
    }
    var m = "";
    for(var l = c.format.length - 1;l >= 0;l--) {
      if(h.indexOf(c.format.charAt(l)) != -1) {
        break
      }
      m = c.format.charAt(l) + m
    }
    c.format = c.format.substring(i.length), c.format = c.format.substring(0, c.format.length - m.length);
    var n = new Number(b);
    return a._formatNumber(n, c, m, i, j)
  }, a._formatNumber = function(b, c, d, e, f) {
    var c = a.extend({}, a.fn.formatNumber.defaults, c), g = k(c.locale.toLowerCase()), h = g.dec, i = g.group, j = g.neg, l = !1;
    if(isNaN(b)) {
      if(c.nanForceZero != 1) {
        return null
      }
      b = 0, l = !0
    }
    d == "%" && (b *= 100);
    var m = "";
    if(c.format.indexOf(".") > -1) {
      var n = h, o = c.format.substring(c.format.lastIndexOf(".") + 1);
      if(c.round == 1) {
        b = new Number(b.toFixed(o.length))
      }else {
        var p = b.toString();
        p = p.substring(0, p.lastIndexOf(".") + o.length + 1), b = new Number(p)
      }
      var q = b % 1, r = new String(q.toFixed(o.length));
      r = r.substring(r.lastIndexOf(".") + 1);
      for(var s = 0;s < o.length;s++) {
        if(o.charAt(s) == "#" && r.charAt(s) != "0") {
          n += r.charAt(s);
          continue
        }
        if(o.charAt(s) == "#" && r.charAt(s) == "0") {
          var t = r.substring(s);
          if(t.match("[1-9]")) {
            n += r.charAt(s);
            continue
          }
          break
        }
        o.charAt(s) == "0" && (n += r.charAt(s))
      }
      m += n
    }else {
      b = Math.round(b)
    }
    var u = Math.floor(b);
    b < 0 && (u = Math.ceil(b));
    var v = "";
    c.format.indexOf(".") == -1 ? v = c.format : v = c.format.substring(0, c.format.indexOf("."));
    var w = "";
    if(u != 0 || v.substr(v.length - 1) != "#" || l) {
      var x = new String(Math.abs(u)), y = 9999;
      v.lastIndexOf(",") != -1 && (y = v.length - v.lastIndexOf(",") - 1);
      var z = 0;
      for(var s = x.length - 1;s > -1;s--) {
        w = x.charAt(s) + w, z++, z == y && s != 0 && (w = i + w, z = 0)
      }
      if(v.length > w.length) {
        var A = v.indexOf("0");
        if(A != -1) {
          var B = v.length - A;
          while(w.length < B) {
            w = "0" + w
          }
        }
      }
    }
    return!w && v.indexOf("0", v.length - 1) !== -1 && (w = "0"), m = w + m, b < 0 && f && e.length > 0 ? e = j + e : b < 0 && (m = j + m), c.decimalSeparatorAlwaysShown || m.lastIndexOf(h) == m.length - 1 && (m = m.substring(0, m.length - 1)), m = e + m + d, m
  }, a.fn.parseNumber = function(b, c, d) {
    c == null && (c = !0), d == null && (d = !0);
    var e;
    a(this).is(":input") ? e = new String(a(this).val()) : e = new String(a(this).text());
    var f = a.parseNumber(e, b);
    if(f) {
      c && (a(this).is(":input") ? a(this).val(f.toString()) : a(this).text(f.toString()));
      if(d) {
        return f
      }
    }
  }, a.parseNumber = function(b, c) {
    var c = a.extend({}, a.fn.parseNumber.defaults, c), d = k(c.locale.toLowerCase()), e = d.dec, f = d.group, g = d.neg, h = "1234567890.-";
    while(b.indexOf(f) > -1) {
      b = b.replace(f, "")
    }
    b = b.replace(e, ".").replace(g, "-");
    var i = "", j = !1;
    b.charAt(b.length - 1) == "%" && (j = !0);
    for(var l = 0;l < b.length;l++) {
      h.indexOf(b.charAt(l)) > -1 && (i += b.charAt(l))
    }
    var m = new Number(i);
    return j && (m /= 100, m = m.toFixed(i.length - 1)), m
  }, a.fn.parseNumber.defaults = {locale:"us", decimalSeparatorAlwaysShown:!1}, a.fn.formatNumber.defaults = {format:"#,###.00", locale:"us", decimalSeparatorAlwaysShown:!1, nanForceZero:!0, round:!0}, Number.prototype.toFixed = function(a) {
    return $._roundNumber(this, a)
  }, a._roundNumber = function(a, b) {
    var c = Math.pow(10, b || 0), d = String(Math.round(a * c) / c);
    if(b > 0) {
      var e = d.indexOf(".");
      e == -1 ? (d += ".", e = 0) : e = d.length - (e + 1);
      while(e < b) {
        d += "0", e++
      }
    }
    return d
  }
})(jQuery), function() {
  var a = {};
  this.tmpl = function b(c, d) {
    var e = /\W/.test(c) ? new Function("obj", "var p=[],print=function(){p.push.apply(p,arguments);};with(obj){p.push('" + c.replace(/[\r\t\n]/g, " ").split("<%").join("\t").replace(/((^|%>)[^\t]*)'/g, "$1\r").replace(/\t=(.*?)%>/g, "',$1,'").split("\t").join("');").split("%>").join("p.push('").split("\r").join("\\'") + "');}return p.join('');") : a[c] = a[c] || b(document.getElementById(c).innerHTML);
    return d ? e(d) : e
  }
}(), function(a) {
  a.baseClass = function(b) {
    return b = a(b), b.get(0).className.match(/([^ ]+)/)[1]
  }, a.fn.addDependClass = function(b, c) {
    var d = {delimiter:c ? c : "-"};
    return this.each(function() {
      var c = a.baseClass(this);
      c && a(this).addClass(c + d.delimiter + b)
    })
  }, a.fn.removeDependClass = function(b, c) {
    var d = {delimiter:c ? c : "-"};
    return this.each(function() {
      var c = a.baseClass(this);
      c && a(this).removeClass(c + d.delimiter + b)
    })
  }, a.fn.toggleDependClass = function(b, c) {
    var d = {delimiter:c ? c : "-"};
    return this.each(function() {
      var c = a.baseClass(this);
      c && (a(this).is("." + c + d.delimiter + b) ? a(this).removeClass(c + d.delimiter + b) : a(this).addClass(c + d.delimiter + b))
    })
  }
}(jQuery), function(a) {
  function b() {
    this._init.apply(this, arguments)
  }
  b.prototype.oninit = function() {
  }, b.prototype.events = function() {
  }, b.prototype.onmousedown = function() {
    this.ptr.css({position:"absolute"})
  }, b.prototype.onmousemove = function(a, b, c) {
    this.ptr.css({left:b, top:c})
  }, b.prototype.onmouseup = function() {
  }, b.prototype.isDefault = {drag:!1, clicked:!1, toclick:!0, mouseup:!1}, b.prototype._init = function() {
    if(arguments.length > 0) {
      this.ptr = a(arguments[0]), this.outer = a(".draggable-outer"), this.is = {}, a.extend(this.is, this.isDefault);
      var b = this.ptr.offset();
      this.d = {left:b.left, top:b.top, width:this.ptr.width(), height:this.ptr.height()}, this.oninit.apply(this, arguments), this._events()
    }
  }, b.prototype._getPageCoords = function(a) {
    return a.targetTouches && a.targetTouches[0] ? {x:a.targetTouches[0].pageX, y:a.targetTouches[0].pageY} : {x:a.pageX, y:a.pageY}
  }, b.prototype._bindEvent = function(a, b, c) {
    var d = this;
    this.supportTouches_ ? a.get(0).addEventListener(this.events_[b], c, !1) : a.bind(this.events_[b], c)
  }, b.prototype._events = function() {
    var b = this;
    this.supportTouches_ = a.browser.webkit && navigator.userAgent.indexOf("Mobile") != -1, this.events_ = {click:this.supportTouches_ ? "touchstart" : "click", down:this.supportTouches_ ? "touchstart" : "mousedown", move:this.supportTouches_ ? "touchmove" : "mousemove", up:this.supportTouches_ ? "touchend" : "mouseup"}, this._bindEvent(a(document), "move", function(a) {
      b.is.drag && (a.stopPropagation(), a.preventDefault(), b._mousemove(a))
    }), this._bindEvent(a(document), "down", function(a) {
      b.is.drag && (a.stopPropagation(), a.preventDefault())
    }), this._bindEvent(a(document), "up", function(a) {
      b._mouseup(a)
    }), this._bindEvent(this.ptr, "down", function(a) {
      return b._mousedown(a), !1
    }), this._bindEvent(this.ptr, "up", function(a) {
      b._mouseup(a)
    }), this.ptr.find("a").click(function() {
      b.is.clicked = !0;
      if(!b.is.toclick) {
        return b.is.toclick = !0, !1
      }
    }).mousedown(function(a) {
      return b._mousedown(a), !1
    }), this.events()
  }, b.prototype._mousedown = function(b) {
    this.is.drag = !0, this.is.clicked = !1, this.is.mouseup = !1;
    var c = this.ptr.offset(), d = this._getPageCoords(b);
    this.cx = d.x - c.left, this.cy = d.y - c.top, a.extend(this.d, {left:c.left, top:c.top, width:this.ptr.width(), height:this.ptr.height()}), this.outer && this.outer.get(0) && this.outer.css({height:Math.max(this.outer.height(), a(document.body).height()), overflow:"hidden"}), this.onmousedown(b)
  }, b.prototype._mousemove = function(a) {
    this.is.toclick = !1;
    var b = this._getPageCoords(a);
    this.onmousemove(a, b.x - this.cx, b.y - this.cy)
  }, b.prototype._mouseup = function(b) {
    var c = this;
    this.is.drag && (this.is.drag = !1, this.outer && this.outer.get(0) && (a.browser.mozilla ? this.outer.css({overflow:"hidden"}) : this.outer.css({overflow:"visible"}), a.browser.msie && a.browser.version == "6.0" ? this.outer.css({height:"100%"}) : this.outer.css({height:"auto"})), this.onmouseup(b))
  }, window.Draggable = b
}(jQuery), function(a) {
  function b(a) {
    return typeof a == "undefined" ? !1 : a instanceof Array || !(a instanceof Object) && Object.prototype.toString.call(a) == "[object Array]" || typeof a.length == "number" && typeof a.splice != "undefined" && typeof a.propertyIsEnumerable != "undefined" && !a.propertyIsEnumerable("splice") ? !0 : !1
  }
  function d() {
    return this.init.apply(this, arguments)
  }
  function e() {
    Draggable.apply(this, arguments)
  }
  a.slider = function(b, c) {
    var e = a(b);
    return e.data("jslider") || e.data("jslider", new d(b, c)), e.data("jslider")
  }, a.fn.slider = function(c, d) {
    function g(a) {
      return a !== undefined
    }
    function h(a) {
      return a != null
    }
    var e, f = arguments;
    return this.each(function() {
      var i = a.slider(this, c);
      if(typeof c == "string") {
        switch(c) {
          case "value":
            if(g(f[1]) && g(f[2])) {
              var j = i.getPointers();
              h(j[0]) && h(f[1]) && (j[0].set(f[1]), j[0].setIndexOver()), h(j[1]) && h(f[2]) && (j[1].set(f[2]), j[1].setIndexOver())
            }else {
              if(g(f[1])) {
                var j = i.getPointers();
                h(j[0]) && h(f[1]) && (j[0].set(f[1]), j[0].setIndexOver())
              }else {
                e = i.getValue()
              }
            }
            break;
          case "prc":
            if(g(f[1]) && g(f[2])) {
              var j = i.getPointers();
              h(j[0]) && h(f[1]) && (j[0]._set(f[1]), j[0].setIndexOver()), h(j[1]) && h(f[2]) && (j[1]._set(f[2]), j[1].setIndexOver())
            }else {
              if(g(f[1])) {
                var j = i.getPointers();
                h(j[0]) && h(f[1]) && (j[0]._set(f[1]), j[0].setIndexOver())
              }else {
                e = i.getPrcValue()
              }
            }
            break;
          case "calculatedValue":
            var k = i.getValue().split(";");
            e = "";
            for(var l = 0;l < k.length;l++) {
              e += (l > 0 ? ";" : "") + i.nice(k[l])
            }
            break;
          case "skin":
            i.setSkin(f[1])
        }
      }else {
        !c && !d && (b(e) || (e = []), e.push(slider))
      }
    }), b(e) && e.length == 1 && (e = e[0]), e || this
  };
  var c = {settings:{from:1, to:10, step:1, smooth:!0, limits:!0, round:0, format:{format:"#,###.##"}, value:"5;7", dimension:""}, className:"jslider", selector:".jslider-", template:tmpl('<span class="<%=className%>"><table><tr><td><div class="<%=className%>-bg"><i class="l"></i><i class="r"></i><i class="v"></i></div><div class="<%=className%>-pointer"></div><div class="<%=className%>-pointer <%=className%>-pointer-to"></div><div class="<%=className%>-label"><span><%=settings.from%></span></div><div class="<%=className%>-label <%=className%>-label-to"><span><%=settings.to%></span><%=settings.dimension%></div><div class="<%=className%>-value"><span></span><%=settings.dimension%></div><div class="<%=className%>-value <%=className%>-value-to"><span></span><%=settings.dimension%></div><div class="<%=className%>-scale"><%=scale%></div></td></tr></table></span>')};
  d.prototype.init = function(b, d) {
    this.settings = a.extend(!0, {}, c.settings, d ? d : {}), this.inputNode = a(b).hide(), this.settings.interval = this.settings.to - this.settings.from, this.settings.value = this.inputNode.attr("value"), this.settings.calculate && a.isFunction(this.settings.calculate) && (this.nice = this.settings.calculate), this.settings.onstatechange && a.isFunction(this.settings.onstatechange) && (this.onstatechange = this.settings.onstatechange), this.is = {init:!1}, this.o = {}, this.create()
  }, d.prototype.onstatechange = function() {
  }, d.prototype.create = function() {
    var b = this;
    this.domNode = a(c.template({className:c.className, settings:{from:this.nice(this.settings.from), to:this.nice(this.settings.to), dimension:this.settings.dimension}, scale:this.generateScale()})), this.inputNode.after(this.domNode), this.drawScale(), this.settings.skin && this.settings.skin.length > 0 && this.setSkin(this.settings.skin), this.sizes = {domWidth:this.domNode.width(), domOffset:this.domNode.offset()}, a.extend(this.o, {pointers:{}, labels:{"0":{o:this.domNode.find(c.selector + "value").not(c.selector + 
    "value-to")}, 1:{o:this.domNode.find(c.selector + "value").filter(c.selector + "value-to")}}, limits:{"0":this.domNode.find(c.selector + "label").not(c.selector + "label-to"), 1:this.domNode.find(c.selector + "label").filter(c.selector + "label-to")}}), a.extend(this.o.labels[0], {value:this.o.labels[0].o.find("span")}), a.extend(this.o.labels[1], {value:this.o.labels[1].o.find("span")}), b.settings.value.split(";")[1] || (this.settings.single = !0, this.domNode.addDependClass("single")), b.settings.limits || 
    this.domNode.addDependClass("limitless"), this.domNode.find(c.selector + "pointer").each(function(a) {
      var c = b.settings.value.split(";")[a];
      if(c) {
        b.o.pointers[a] = new e(this, a, b);
        var d = b.settings.value.split(";")[a - 1];
        d && new Number(c) < new Number(d) && (c = d), c = c < b.settings.from ? b.settings.from : c, c = c > b.settings.to ? b.settings.to : c, b.o.pointers[a].set(c, !0)
      }
    }), this.o.value = this.domNode.find(".v"), this.is.init = !0, a.each(this.o.pointers, function(a) {
      b.redraw(this)
    }), function(b) {
      a(window).resize(function() {
        b.onresize()
      })
    }(this)
  }, d.prototype.setSkin = function(a) {
    this.skin_ && this.domNode.removeDependClass(this.skin_, "_"), this.domNode.addDependClass(this.skin_ = a, "_")
  }, d.prototype.setPointersIndex = function(b) {
    a.each(this.getPointers(), function(a) {
      this.index(a)
    })
  }, d.prototype.getPointers = function() {
    return this.o.pointers
  }, d.prototype.generateScale = function() {
    if(this.settings.scale && this.settings.scale.length > 0) {
      var a = "", b = this.settings.scale, c = Math.round(100 / (b.length - 1) * 10) / 10;
      for(var d = 0;d < b.length;d++) {
        a += '<span style="left: ' + d * c + '%">' + (b[d] != "|" ? "<ins>" + b[d] + "</ins>" : "") + "</span>"
      }
      return a
    }
    return""
  }, d.prototype.drawScale = function() {
    this.domNode.find(c.selector + "scale span ins").each(function() {
      a(this).css({marginLeft:-a(this).outerWidth() / 2})
    })
  }, d.prototype.onresize = function() {
    var b = this;
    this.sizes = {domWidth:this.domNode.width(), domOffset:this.domNode.offset()}, a.each(this.o.pointers, function(a) {
      b.redraw(this)
    })
  }, d.prototype.limits = function(a, b) {
    if(!this.settings.smooth) {
      var c = this.settings.step * 100 / this.settings.interval;
      a = Math.round(a / c) * c
    }
    var d = this.o.pointers[1 - b.uid];
    return d && b.uid && a < d.value.prc && (a = d.value.prc), d && !b.uid && a > d.value.prc && (a = d.value.prc), a < 0 && (a = 0), a > 100 && (a = 100), Math.round(a * 10) / 10
  }, d.prototype.redraw = function(a) {
    if(!this.is.init) {
      return!1
    }
    this.setValue(), this.o.pointers[0] && this.o.pointers[1] && this.o.value.css({left:this.o.pointers[0].value.prc + "%", width:this.o.pointers[1].value.prc - this.o.pointers[0].value.prc + "%"}), this.o.labels[a.uid].value.html(this.nice(a.value.origin)), this.redrawLabels(a)
  }, d.prototype.redrawLabels = function(a) {
    function b(a, b, d) {
      return b.margin = -b.label / 2, label_left = b.border + b.margin, label_left < 0 && (b.margin -= label_left), b.border + b.label / 2 > c.sizes.domWidth ? (b.margin = 0, b.right = !0) : b.right = !1, a.o.css({left:d + "%", marginLeft:b.margin, right:"auto"}), b.right && a.o.css({left:"auto", right:0}), b
    }
    var c = this, d = this.o.labels[a.uid], e = a.value.prc, f = {label:d.o.outerWidth(), right:!1, border:e * this.sizes.domWidth / 100};
    if(!this.settings.single) {
      var g = this.o.pointers[1 - a.uid], h = this.o.labels[g.uid];
      switch(a.uid) {
        case 0:
          f.border + f.label / 2 > h.o.offset().left - this.sizes.domOffset.left ? (h.o.css({visibility:"hidden"}), h.value.html(this.nice(g.value.origin)), d.o.css({visibility:"visible"}), e = (g.value.prc - e) / 2 + e, g.value.prc != a.value.prc && (d.value.html(this.nice(a.value.origin) + "&nbsp;&ndash;&nbsp;" + this.nice(g.value.origin)), f.label = d.o.outerWidth(), f.border = e * this.sizes.domWidth / 100)) : h.o.css({visibility:"visible"});
          break;
        case 1:
          f.border - f.label / 2 < h.o.offset().left - this.sizes.domOffset.left + h.o.outerWidth() ? (h.o.css({visibility:"hidden"}), h.value.html(this.nice(g.value.origin)), d.o.css({visibility:"visible"}), e = (e - g.value.prc) / 2 + g.value.prc, g.value.prc != a.value.prc && (d.value.html(this.nice(g.value.origin) + "&nbsp;&ndash;&nbsp;" + this.nice(a.value.origin)), f.label = d.o.outerWidth(), f.border = e * this.sizes.domWidth / 100)) : h.o.css({visibility:"visible"})
      }
    }
    f = b(d, f, e);
    if(h) {
      var f = {label:h.o.outerWidth(), right:!1, border:g.value.prc * this.sizes.domWidth / 100};
      f = b(h, f, g.value.prc)
    }
    this.redrawLimits()
  }, d.prototype.redrawLimits = function() {
    if(this.settings.limits) {
      var a = [!0, !0];
      for(key in this.o.pointers) {
        if(!this.settings.single || key == 0) {
          var b = this.o.pointers[key], c = this.o.labels[b.uid], d = c.o.offset().left - this.sizes.domOffset.left, e = this.o.limits[0];
          d < e.outerWidth() && (a[0] = !1);
          var e = this.o.limits[1];
          d + c.o.outerWidth() > this.sizes.domWidth - e.outerWidth() && (a[1] = !1)
        }
      }
      for(var f = 0;f < a.length;f++) {
        a[f] ? this.o.limits[f].fadeIn("fast") : this.o.limits[f].fadeOut("fast")
      }
    }
  }, d.prototype.setValue = function() {
    var a = this.getValue();
    this.inputNode.attr("value", a), this.onstatechange.call(this, a)
  }, d.prototype.getValue = function() {
    if(!this.is.init) {
      return!1
    }
    var b = this, c = "";
    return a.each(this.o.pointers, function(a) {
      this.value.prc != undefined && !isNaN(this.value.prc) && (c += (a > 0 ? ";" : "") + b.prcToValue(this.value.prc))
    }), c
  }, d.prototype.getPrcValue = function() {
    if(!this.is.init) {
      return!1
    }
    var b = this, c = "";
    return a.each(this.o.pointers, function(a) {
      this.value.prc != undefined && !isNaN(this.value.prc) && (c += (a > 0 ? ";" : "") + this.value.prc)
    }), c
  }, d.prototype.prcToValue = function(a) {
    if(this.settings.heterogeneity && this.settings.heterogeneity.length > 0) {
      var b = this.settings.heterogeneity, c = 0, d = this.settings.from;
      for(var e = 0;e <= b.length;e++) {
        if(b[e]) {
          var f = b[e].split("/")
        }else {
          var f = [100, this.settings.to]
        }
        f[0] = new Number(f[0]), f[1] = new Number(f[1]);
        if(a >= c && a <= f[0]) {
          var g = d + (a - c) * (f[1] - d) / (f[0] - c)
        }
        c = f[0], d = f[1]
      }
    }else {
      var g = this.settings.from + a * this.settings.interval / 100
    }
    return this.round(g)
  }, d.prototype.valueToPrc = function(a, b) {
    if(this.settings.heterogeneity && this.settings.heterogeneity.length > 0) {
      var c = this.settings.heterogeneity, d = 0, e = this.settings.from;
      for(var f = 0;f <= c.length;f++) {
        if(c[f]) {
          var g = c[f].split("/")
        }else {
          var g = [100, this.settings.to]
        }
        g[0] = new Number(g[0]), g[1] = new Number(g[1]);
        if(a >= e && a <= g[1]) {
          var h = b.limits(d + (a - e) * (g[0] - d) / (g[1] - e))
        }
        d = g[0], e = g[1]
      }
    }else {
      var h = b.limits((a - this.settings.from) * 100 / this.settings.interval)
    }
    return h
  }, d.prototype.round = function(a) {
    return a = Math.round(a / this.settings.step) * this.settings.step, this.settings.round ? a = Math.round(a * Math.pow(10, this.settings.round)) / Math.pow(10, this.settings.round) : a = Math.round(a), a
  }, d.prototype.nice = function(b) {
    return b = b.toString().replace(/,/gi, ".").replace(/ /gi, ""), a.formatNumber ? a.formatNumber(new Number(b), this.settings.format || {}).replace(/-/gi, "&minus;") : new Number(b)
  }, e.prototype = new Draggable, e.prototype.oninit = function(a, b, c) {
    this.uid = b, this.parent = c, this.value = {}, this.settings = this.parent.settings
  }, e.prototype.onmousedown = function(a) {
    this._parent = {offset:this.parent.domNode.offset(), width:this.parent.domNode.width()}, this.ptr.addDependClass("hover"), this.setIndexOver()
  }, e.prototype.onmousemove = function(a, b) {
    var c = this._getPageCoords(a);
    this._set(this.calc(c.x))
  }, e.prototype.onmouseup = function(b) {
    this.parent.settings.callback && a.isFunction(this.parent.settings.callback) && this.parent.settings.callback.call(this.parent, this.parent.getValue()), this.ptr.removeDependClass("hover")
  }, e.prototype.setIndexOver = function() {
    this.parent.setPointersIndex(1), this.index(2)
  }, e.prototype.index = function(a) {
    this.ptr.css({zIndex:a})
  }, e.prototype.limits = function(a) {
    return this.parent.limits(a, this)
  }, e.prototype.calc = function(a) {
    var b = this.limits((a - this._parent.offset.left) * 100 / this._parent.width);
    return b
  }, e.prototype.set = function(a, b) {
    this.value.origin = this.parent.round(a), this._set(this.parent.valueToPrc(a, this), b)
  }, e.prototype._set = function(a, b) {
    b || (this.value.origin = this.parent.prcToValue(a)), this.value.prc = a, this.ptr.css({left:a + "%"}), this.parent.redraw(this)
  }
}(jQuery);
(function(a, b) {
  function d(b) {
    return!a(b).parents().andSelf().filter(function() {
      return a.curCSS(this, "visibility") === "hidden" || a.expr.filters.hidden(this)
    }).length
  }
  function c(b, c) {
    var e = b.nodeName.toLowerCase();
    if("area" === e) {
      var f = b.parentNode, g = f.name, h;
      if(!b.href || !g || f.nodeName.toLowerCase() !== "map") {
        return!1
      }
      h = a("img[usemap=#" + g + "]")[0];
      return!!h && d(h)
    }
    return(/input|select|textarea|button|object/.test(e) ? !b.disabled : "a" == e ? b.href || c : c) && d(b)
  }
  a.ui = a.ui || {};
  a.ui.version || (a.extend(a.ui, {version:"1.8.18", keyCode:{ALT:18, BACKSPACE:8, CAPS_LOCK:20, COMMA:188, COMMAND:91, COMMAND_LEFT:91, COMMAND_RIGHT:93, CONTROL:17, DELETE:46, DOWN:40, END:35, ENTER:13, ESCAPE:27, HOME:36, INSERT:45, LEFT:37, MENU:93, NUMPAD_ADD:107, NUMPAD_DECIMAL:110, NUMPAD_DIVIDE:111, NUMPAD_ENTER:108, NUMPAD_MULTIPLY:106, NUMPAD_SUBTRACT:109, PAGE_DOWN:34, PAGE_UP:33, PERIOD:190, RIGHT:39, SHIFT:16, SPACE:32, TAB:9, UP:38, WINDOWS:91}}), a.fn.extend({propAttr:a.fn.prop || 
  a.fn.attr, _focus:a.fn.focus, focus:function(b, c) {
    return typeof b == "number" ? this.each(function() {
      var d = this;
      setTimeout(function() {
        a(d).focus(), c && c.call(d)
      }, b)
    }) : this._focus.apply(this, arguments)
  }, scrollParent:function() {
    var b;
    a.browser.msie && /(static|relative)/.test(this.css("position")) || /absolute/.test(this.css("position")) ? b = this.parents().filter(function() {
      return/(relative|absolute|fixed)/.test(a.curCSS(this, "position", 1)) && /(auto|scroll)/.test(a.curCSS(this, "overflow", 1) + a.curCSS(this, "overflow-y", 1) + a.curCSS(this, "overflow-x", 1))
    }).eq(0) : b = this.parents().filter(function() {
      return/(auto|scroll)/.test(a.curCSS(this, "overflow", 1) + a.curCSS(this, "overflow-y", 1) + a.curCSS(this, "overflow-x", 1))
    }).eq(0);
    return/fixed/.test(this.css("position")) || !b.length ? a(document) : b
  }, zIndex:function(c) {
    if(c !== b) {
      return this.css("zIndex", c)
    }
    if(this.length) {
      var d = a(this[0]), e, f;
      while(d.length && d[0] !== document) {
        e = d.css("position");
        if(e === "absolute" || e === "relative" || e === "fixed") {
          f = parseInt(d.css("zIndex"), 10);
          if(!isNaN(f) && f !== 0) {
            return f
          }
        }
        d = d.parent()
      }
    }
    return 0
  }, disableSelection:function() {
    return this.bind((a.support.selectstart ? "selectstart" : "mousedown") + ".ui-disableSelection", function(a) {
      a.preventDefault()
    })
  }, enableSelection:function() {
    return this.unbind(".ui-disableSelection")
  }}), a.each(["Width", "Height"], function(c, d) {
    function h(b, c, d, f) {
      a.each(e, function() {
        c -= parseFloat(a.curCSS(b, "padding" + this, !0)) || 0, d && (c -= parseFloat(a.curCSS(b, "border" + this + "Width", !0)) || 0), f && (c -= parseFloat(a.curCSS(b, "margin" + this, !0)) || 0)
      });
      return c
    }
    var e = d === "Width" ? ["Left", "Right"] : ["Top", "Bottom"], f = d.toLowerCase(), g = {innerWidth:a.fn.innerWidth, innerHeight:a.fn.innerHeight, outerWidth:a.fn.outerWidth, outerHeight:a.fn.outerHeight};
    a.fn["inner" + d] = function(c) {
      if(c === b) {
        return g["inner" + d].call(this)
      }
      return this.each(function() {
        a(this).css(f, h(this, c) + "px")
      })
    }, a.fn["outer" + d] = function(b, c) {
      if(typeof b != "number") {
        return g["outer" + d].call(this, b)
      }
      return this.each(function() {
        a(this).css(f, h(this, b, !0, c) + "px")
      })
    }
  }), a.extend(a.expr[":"], {data:function(b, c, d) {
    return!!a.data(b, d[3])
  }, focusable:function(b) {
    return c(b, !isNaN(a.attr(b, "tabindex")))
  }, tabbable:function(b) {
    var d = a.attr(b, "tabindex"), e = isNaN(d);
    return(e || d >= 0) && c(b, !e)
  }}), a(function() {
    var b = document.body, c = b.appendChild(c = document.createElement("div"));
    c.offsetHeight, a.extend(c.style, {minHeight:"100px", height:"auto", padding:0, borderWidth:0}), a.support.minHeight = c.offsetHeight === 100, a.support.selectstart = "onselectstart" in c, b.removeChild(c).style.display = "none"
  }), a.extend(a.ui, {plugin:{add:function(b, c, d) {
    var e = a.ui[b].prototype;
    for(var f in d) {
      e.plugins[f] = e.plugins[f] || [], e.plugins[f].push([c, d[f]])
    }
  }, call:function(a, b, c) {
    var d = a.plugins[b];
    if(!!d && !!a.element[0].parentNode) {
      for(var e = 0;e < d.length;e++) {
        a.options[d[e][0]] && d[e][1].apply(a.element, c)
      }
    }
  }}, contains:function(a, b) {
    return document.compareDocumentPosition ? a.compareDocumentPosition(b) & 16 : a !== b && a.contains(b)
  }, hasScroll:function(b, c) {
    if(a(b).css("overflow") === "hidden") {
      return!1
    }
    var d = c && c === "left" ? "scrollLeft" : "scrollTop", e = !1;
    if(b[d] > 0) {
      return!0
    }
    b[d] = 1, e = b[d] > 0, b[d] = 0;
    return e
  }, isOverAxis:function(a, b, c) {
    return a > b && a < b + c
  }, isOver:function(b, c, d, e, f, g) {
    return a.ui.isOverAxis(b, d, f) && a.ui.isOverAxis(c, e, g)
  }}))
})(jQuery);
(function(a, b) {
  a.widget("ui.draggable", a.ui.mouse, {widgetEventPrefix:"drag", options:{addClasses:!0, appendTo:"parent", axis:!1, connectToSortable:!1, containment:!1, cursor:"auto", cursorAt:!1, grid:!1, handle:!1, helper:"original", iframeFix:!1, opacity:!1, refreshPositions:!1, revert:!1, revertDuration:500, scope:"default", scroll:!0, scrollSensitivity:20, scrollSpeed:20, snap:!1, snapMode:"both", snapTolerance:20, stack:!1, zIndex:!1}, _create:function() {
    this.options.helper == "original" && !/^(?:r|a|f)/.test(this.element.css("position")) && (this.element[0].style.position = "relative"), this.options.addClasses && this.element.addClass("ui-draggable"), this.options.disabled && this.element.addClass("ui-draggable-disabled"), this._mouseInit()
  }, destroy:function() {
    if(!!this.element.data("draggable")) {
      this.element.removeData("draggable").unbind(".draggable").removeClass("ui-draggable ui-draggable-dragging ui-draggable-disabled"), this._mouseDestroy();
      return this
    }
  }, _mouseCapture:function(b) {
    var c = this.options;
    if(this.helper || c.disabled || a(b.target).is(".ui-resizable-handle")) {
      return!1
    }
    this.handle = this._getHandle(b);
    if(!this.handle) {
      return!1
    }
    c.iframeFix && a(c.iframeFix === !0 ? "iframe" : c.iframeFix).each(function() {
      a('<div class="ui-draggable-iframeFix" style="background: #fff;"></div>').css({width:this.offsetWidth + "px", height:this.offsetHeight + "px", position:"absolute", opacity:"0.001", zIndex:1E3}).css(a(this).offset()).appendTo("body")
    });
    return!0
  }, _mouseStart:function(b) {
    var c = this.options;
    this.helper = this._createHelper(b), this._cacheHelperProportions(), a.ui.ddmanager && (a.ui.ddmanager.current = this), this._cacheMargins(), this.cssPosition = this.helper.css("position"), this.scrollParent = this.helper.scrollParent(), this.offset = this.positionAbs = this.element.offset(), this.offset = {top:this.offset.top - this.margins.top, left:this.offset.left - this.margins.left}, a.extend(this.offset, {click:{left:b.pageX - this.offset.left, top:b.pageY - this.offset.top}, parent:this._getParentOffset(), 
    relative:this._getRelativeOffset()}), this.originalPosition = this.position = this._generatePosition(b), this.originalPageX = b.pageX, this.originalPageY = b.pageY, c.cursorAt && this._adjustOffsetFromHelper(c.cursorAt), c.containment && this._setContainment();
    if(this._trigger("start", b) === !1) {
      this._clear();
      return!1
    }
    this._cacheHelperProportions(), a.ui.ddmanager && !c.dropBehaviour && a.ui.ddmanager.prepareOffsets(this, b), this.helper.addClass("ui-draggable-dragging"), this._mouseDrag(b, !0), a.ui.ddmanager && a.ui.ddmanager.dragStart(this, b);
    return!0
  }, _mouseDrag:function(b, c) {
    this.position = this._generatePosition(b), this.positionAbs = this._convertPositionTo("absolute");
    if(!c) {
      var d = this._uiHash();
      if(this._trigger("drag", b, d) === !1) {
        this._mouseUp({});
        return!1
      }
      this.position = d.position
    }
    if(!this.options.axis || this.options.axis != "y") {
      this.helper[0].style.left = this.position.left + "px"
    }
    if(!this.options.axis || this.options.axis != "x") {
      this.helper[0].style.top = this.position.top + "px"
    }
    a.ui.ddmanager && a.ui.ddmanager.drag(this, b);
    return!1
  }, _mouseStop:function(b) {
    var c = !1;
    a.ui.ddmanager && !this.options.dropBehaviour && (c = a.ui.ddmanager.drop(this, b)), this.dropped && (c = this.dropped, this.dropped = !1);
    if((!this.element[0] || !this.element[0].parentNode) && this.options.helper == "original") {
      return!1
    }
    if(this.options.revert == "invalid" && !c || this.options.revert == "valid" && c || this.options.revert === !0 || a.isFunction(this.options.revert) && this.options.revert.call(this.element, c)) {
      var d = this;
      a(this.helper).animate(this.originalPosition, parseInt(this.options.revertDuration, 10), function() {
        d._trigger("stop", b) !== !1 && d._clear()
      })
    }else {
      this._trigger("stop", b) !== !1 && this._clear()
    }
    return!1
  }, _mouseUp:function(b) {
    this.options.iframeFix === !0 && a("div.ui-draggable-iframeFix").each(function() {
      this.parentNode.removeChild(this)
    }), a.ui.ddmanager && a.ui.ddmanager.dragStop(this, b);
    return a.ui.mouse.prototype._mouseUp.call(this, b)
  }, cancel:function() {
    this.helper.is(".ui-draggable-dragging") ? this._mouseUp({}) : this._clear();
    return this
  }, _getHandle:function(b) {
    var c = !this.options.handle || !a(this.options.handle, this.element).length ? !0 : !1;
    a(this.options.handle, this.element).find("*").andSelf().each(function() {
      this == b.target && (c = !0)
    });
    return c
  }, _createHelper:function(b) {
    var c = this.options, d = a.isFunction(c.helper) ? a(c.helper.apply(this.element[0], [b])) : c.helper == "clone" ? this.element.clone().removeAttr("id") : this.element;
    d.parents("body").length || d.appendTo(c.appendTo == "parent" ? this.element[0].parentNode : c.appendTo), d[0] != this.element[0] && !/(fixed|absolute)/.test(d.css("position")) && d.css("position", "absolute");
    return d
  }, _adjustOffsetFromHelper:function(b) {
    typeof b == "string" && (b = b.split(" ")), a.isArray(b) && (b = {left:+b[0], top:+b[1] || 0}), "left" in b && (this.offset.click.left = b.left + this.margins.left), "right" in b && (this.offset.click.left = this.helperProportions.width - b.right + this.margins.left), "top" in b && (this.offset.click.top = b.top + this.margins.top), "bottom" in b && (this.offset.click.top = this.helperProportions.height - b.bottom + this.margins.top)
  }, _getParentOffset:function() {
    this.offsetParent = this.helper.offsetParent();
    var b = this.offsetParent.offset();
    this.cssPosition == "absolute" && this.scrollParent[0] != document && a.ui.contains(this.scrollParent[0], this.offsetParent[0]) && (b.left += this.scrollParent.scrollLeft(), b.top += this.scrollParent.scrollTop());
    if(this.offsetParent[0] == document.body || this.offsetParent[0].tagName && this.offsetParent[0].tagName.toLowerCase() == "html" && a.browser.msie) {
      b = {top:0, left:0}
    }
    return{top:b.top + (parseInt(this.offsetParent.css("borderTopWidth"), 10) || 0), left:b.left + (parseInt(this.offsetParent.css("borderLeftWidth"), 10) || 0)}
  }, _getRelativeOffset:function() {
    if(this.cssPosition == "relative") {
      var a = this.element.position();
      return{top:a.top - (parseInt(this.helper.css("top"), 10) || 0) + this.scrollParent.scrollTop(), left:a.left - (parseInt(this.helper.css("left"), 10) || 0) + this.scrollParent.scrollLeft()}
    }
    return{top:0, left:0}
  }, _cacheMargins:function() {
    this.margins = {left:parseInt(this.element.css("marginLeft"), 10) || 0, top:parseInt(this.element.css("marginTop"), 10) || 0, right:parseInt(this.element.css("marginRight"), 10) || 0, bottom:parseInt(this.element.css("marginBottom"), 10) || 0}
  }, _cacheHelperProportions:function() {
    this.helperProportions = {width:this.helper.outerWidth(), height:this.helper.outerHeight()}
  }, _setContainment:function() {
    var b = this.options;
    b.containment == "parent" && (b.containment = this.helper[0].parentNode);
    if(b.containment == "document" || b.containment == "window") {
      this.containment = [b.containment == "document" ? 0 : a(window).scrollLeft() - this.offset.relative.left - this.offset.parent.left, b.containment == "document" ? 0 : a(window).scrollTop() - this.offset.relative.top - this.offset.parent.top, (b.containment == "document" ? 0 : a(window).scrollLeft()) + a(b.containment == "document" ? document : window).width() - this.helperProportions.width - this.margins.left, (b.containment == "document" ? 0 : a(window).scrollTop()) + (a(b.containment == "document" ? 
      document : window).height() || document.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top]
    }
    if(!/^(document|window|parent)$/.test(b.containment) && b.containment.constructor != Array) {
      var c = a(b.containment), d = c[0];
      if(!d) {
        return
      }
      var e = c.offset(), f = a(d).css("overflow") != "hidden";
      this.containment = [(parseInt(a(d).css("borderLeftWidth"), 10) || 0) + (parseInt(a(d).css("paddingLeft"), 10) || 0), (parseInt(a(d).css("borderTopWidth"), 10) || 0) + (parseInt(a(d).css("paddingTop"), 10) || 0), (f ? Math.max(d.scrollWidth, d.offsetWidth) : d.offsetWidth) - (parseInt(a(d).css("borderLeftWidth"), 10) || 0) - (parseInt(a(d).css("paddingRight"), 10) || 0) - this.helperProportions.width - this.margins.left - this.margins.right, (f ? Math.max(d.scrollHeight, d.offsetHeight) : d.offsetHeight) - 
      (parseInt(a(d).css("borderTopWidth"), 10) || 0) - (parseInt(a(d).css("paddingBottom"), 10) || 0) - this.helperProportions.height - this.margins.top - this.margins.bottom], this.relative_container = c
    }else {
      b.containment.constructor == Array && (this.containment = b.containment)
    }
  }, _convertPositionTo:function(b, c) {
    c || (c = this.position);
    var d = b == "absolute" ? 1 : -1, e = this.options, f = this.cssPosition == "absolute" && (this.scrollParent[0] == document || !a.ui.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent, g = /(html|body)/i.test(f[0].tagName);
    return{top:c.top + this.offset.relative.top * d + this.offset.parent.top * d - (a.browser.safari && a.browser.version < 526 && this.cssPosition == "fixed" ? 0 : (this.cssPosition == "fixed" ? -this.scrollParent.scrollTop() : g ? 0 : f.scrollTop()) * d), left:c.left + this.offset.relative.left * d + this.offset.parent.left * d - (a.browser.safari && a.browser.version < 526 && this.cssPosition == "fixed" ? 0 : (this.cssPosition == "fixed" ? -this.scrollParent.scrollLeft() : g ? 0 : f.scrollLeft()) * 
    d)}
  }, _generatePosition:function(b) {
    var c = this.options, d = this.cssPosition == "absolute" && (this.scrollParent[0] == document || !a.ui.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent, e = /(html|body)/i.test(d[0].tagName), f = b.pageX, g = b.pageY;
    if(this.originalPosition) {
      var h;
      if(this.containment) {
        if(this.relative_container) {
          var i = this.relative_container.offset();
          h = [this.containment[0] + i.left, this.containment[1] + i.top, this.containment[2] + i.left, this.containment[3] + i.top]
        }else {
          h = this.containment
        }
        b.pageX - this.offset.click.left < h[0] && (f = h[0] + this.offset.click.left), b.pageY - this.offset.click.top < h[1] && (g = h[1] + this.offset.click.top), b.pageX - this.offset.click.left > h[2] && (f = h[2] + this.offset.click.left), b.pageY - this.offset.click.top > h[3] && (g = h[3] + this.offset.click.top)
      }
      if(c.grid) {
        var j = c.grid[1] ? this.originalPageY + Math.round((g - this.originalPageY) / c.grid[1]) * c.grid[1] : this.originalPageY;
        g = h ? j - this.offset.click.top < h[1] || j - this.offset.click.top > h[3] ? j - this.offset.click.top < h[1] ? j + c.grid[1] : j - c.grid[1] : j : j;
        var k = c.grid[0] ? this.originalPageX + Math.round((f - this.originalPageX) / c.grid[0]) * c.grid[0] : this.originalPageX;
        f = h ? k - this.offset.click.left < h[0] || k - this.offset.click.left > h[2] ? k - this.offset.click.left < h[0] ? k + c.grid[0] : k - c.grid[0] : k : k
      }
    }
    return{top:g - this.offset.click.top - this.offset.relative.top - this.offset.parent.top + (a.browser.safari && a.browser.version < 526 && this.cssPosition == "fixed" ? 0 : this.cssPosition == "fixed" ? -this.scrollParent.scrollTop() : e ? 0 : d.scrollTop()), left:f - this.offset.click.left - this.offset.relative.left - this.offset.parent.left + (a.browser.safari && a.browser.version < 526 && this.cssPosition == "fixed" ? 0 : this.cssPosition == "fixed" ? -this.scrollParent.scrollLeft() : e ? 
    0 : d.scrollLeft())}
  }, _clear:function() {
    this.helper.removeClass("ui-draggable-dragging"), this.helper[0] != this.element[0] && !this.cancelHelperRemoval && this.helper.remove(), this.helper = null, this.cancelHelperRemoval = !1
  }, _trigger:function(b, c, d) {
    d = d || this._uiHash(), a.ui.plugin.call(this, b, [c, d]), b == "drag" && (this.positionAbs = this._convertPositionTo("absolute"));
    return a.Widget.prototype._trigger.call(this, b, c, d)
  }, plugins:{}, _uiHash:function(a) {
    return{helper:this.helper, position:this.position, originalPosition:this.originalPosition, offset:this.positionAbs}
  }}), a.extend(a.ui.draggable, {version:"1.8.18"}), a.ui.plugin.add("draggable", "connectToSortable", {start:function(b, c) {
    var d = a(this).data("draggable"), e = d.options, f = a.extend({}, c, {item:d.element});
    d.sortables = [], a(e.connectToSortable).each(function() {
      var c = a.data(this, "sortable");
      c && !c.options.disabled && (d.sortables.push({instance:c, shouldRevert:c.options.revert}), c.refreshPositions(), c._trigger("activate", b, f))
    })
  }, stop:function(b, c) {
    var d = a(this).data("draggable"), e = a.extend({}, c, {item:d.element});
    a.each(d.sortables, function() {
      this.instance.isOver ? (this.instance.isOver = 0, d.cancelHelperRemoval = !0, this.instance.cancelHelperRemoval = !1, this.shouldRevert && (this.instance.options.revert = !0), this.instance._mouseStop(b), this.instance.options.helper = this.instance.options._helper, d.options.helper == "original" && this.instance.currentItem.css({top:"auto", left:"auto"})) : (this.instance.cancelHelperRemoval = !1, this.instance._trigger("deactivate", b, e))
    })
  }, drag:function(b, c) {
    var d = a(this).data("draggable"), e = this, f = function(b) {
      var c = this.offset.click.top, d = this.offset.click.left, e = this.positionAbs.top, f = this.positionAbs.left, g = b.height, h = b.width, i = b.top, j = b.left;
      return a.ui.isOver(e + c, f + d, i, j, g, h)
    };
    a.each(d.sortables, function(f) {
      this.instance.positionAbs = d.positionAbs, this.instance.helperProportions = d.helperProportions, this.instance.offset.click = d.offset.click, this.instance._intersectsWith(this.instance.containerCache) ? (this.instance.isOver || (this.instance.isOver = 1, this.instance.currentItem = a(e).clone().removeAttr("id").appendTo(this.instance.element).data("sortable-item", !0), this.instance.options._helper = this.instance.options.helper, this.instance.options.helper = function() {
        return c.helper[0]
      }, b.target = this.instance.currentItem[0], this.instance._mouseCapture(b, !0), this.instance._mouseStart(b, !0, !0), this.instance.offset.click.top = d.offset.click.top, this.instance.offset.click.left = d.offset.click.left, this.instance.offset.parent.left -= d.offset.parent.left - this.instance.offset.parent.left, this.instance.offset.parent.top -= d.offset.parent.top - this.instance.offset.parent.top, d._trigger("toSortable", b), d.dropped = this.instance.element, d.currentItem = d.element, 
      this.instance.fromOutside = d), this.instance.currentItem && this.instance._mouseDrag(b)) : this.instance.isOver && (this.instance.isOver = 0, this.instance.cancelHelperRemoval = !0, this.instance.options.revert = !1, this.instance._trigger("out", b, this.instance._uiHash(this.instance)), this.instance._mouseStop(b, !0), this.instance.options.helper = this.instance.options._helper, this.instance.currentItem.remove(), this.instance.placeholder && this.instance.placeholder.remove(), d._trigger("fromSortable", 
      b), d.dropped = !1)
    })
  }}), a.ui.plugin.add("draggable", "cursor", {start:function(b, c) {
    var d = a("body"), e = a(this).data("draggable").options;
    d.css("cursor") && (e._cursor = d.css("cursor")), d.css("cursor", e.cursor)
  }, stop:function(b, c) {
    var d = a(this).data("draggable").options;
    d._cursor && a("body").css("cursor", d._cursor)
  }}), a.ui.plugin.add("draggable", "opacity", {start:function(b, c) {
    var d = a(c.helper), e = a(this).data("draggable").options;
    d.css("opacity") && (e._opacity = d.css("opacity")), d.css("opacity", e.opacity)
  }, stop:function(b, c) {
    var d = a(this).data("draggable").options;
    d._opacity && a(c.helper).css("opacity", d._opacity)
  }}), a.ui.plugin.add("draggable", "scroll", {start:function(b, c) {
    var d = a(this).data("draggable");
    d.scrollParent[0] != document && d.scrollParent[0].tagName != "HTML" && (d.overflowOffset = d.scrollParent.offset())
  }, drag:function(b, c) {
    var d = a(this).data("draggable"), e = d.options, f = !1;
    if(d.scrollParent[0] != document && d.scrollParent[0].tagName != "HTML") {
      if(!e.axis || e.axis != "x") {
        d.overflowOffset.top + d.scrollParent[0].offsetHeight - b.pageY < e.scrollSensitivity ? d.scrollParent[0].scrollTop = f = d.scrollParent[0].scrollTop + e.scrollSpeed : b.pageY - d.overflowOffset.top < e.scrollSensitivity && (d.scrollParent[0].scrollTop = f = d.scrollParent[0].scrollTop - e.scrollSpeed)
      }
      if(!e.axis || e.axis != "y") {
        d.overflowOffset.left + d.scrollParent[0].offsetWidth - b.pageX < e.scrollSensitivity ? d.scrollParent[0].scrollLeft = f = d.scrollParent[0].scrollLeft + e.scrollSpeed : b.pageX - d.overflowOffset.left < e.scrollSensitivity && (d.scrollParent[0].scrollLeft = f = d.scrollParent[0].scrollLeft - e.scrollSpeed)
      }
    }else {
      if(!e.axis || e.axis != "x") {
        b.pageY - a(document).scrollTop() < e.scrollSensitivity ? f = a(document).scrollTop(a(document).scrollTop() - e.scrollSpeed) : a(window).height() - (b.pageY - a(document).scrollTop()) < e.scrollSensitivity && (f = a(document).scrollTop(a(document).scrollTop() + e.scrollSpeed))
      }
      if(!e.axis || e.axis != "y") {
        b.pageX - a(document).scrollLeft() < e.scrollSensitivity ? f = a(document).scrollLeft(a(document).scrollLeft() - e.scrollSpeed) : a(window).width() - (b.pageX - a(document).scrollLeft()) < e.scrollSensitivity && (f = a(document).scrollLeft(a(document).scrollLeft() + e.scrollSpeed))
      }
    }
    f !== !1 && a.ui.ddmanager && !e.dropBehaviour && a.ui.ddmanager.prepareOffsets(d, b)
  }}), a.ui.plugin.add("draggable", "snap", {start:function(b, c) {
    var d = a(this).data("draggable"), e = d.options;
    d.snapElements = [], a(e.snap.constructor != String ? e.snap.items || ":data(draggable)" : e.snap).each(function() {
      var b = a(this), c = b.offset();
      this != d.element[0] && d.snapElements.push({item:this, width:b.outerWidth(), height:b.outerHeight(), top:c.top, left:c.left})
    })
  }, drag:function(b, c) {
    var d = a(this).data("draggable"), e = d.options, f = e.snapTolerance, g = c.offset.left, h = g + d.helperProportions.width, i = c.offset.top, j = i + d.helperProportions.height;
    for(var k = d.snapElements.length - 1;k >= 0;k--) {
      var l = d.snapElements[k].left, m = l + d.snapElements[k].width, n = d.snapElements[k].top, o = n + d.snapElements[k].height;
      if(!(l - f < g && g < m + f && n - f < i && i < o + f || l - f < g && g < m + f && n - f < j && j < o + f || l - f < h && h < m + f && n - f < i && i < o + f || l - f < h && h < m + f && n - f < j && j < o + f)) {
        d.snapElements[k].snapping && d.options.snap.release && d.options.snap.release.call(d.element, b, a.extend(d._uiHash(), {snapItem:d.snapElements[k].item})), d.snapElements[k].snapping = !1;
        continue
      }
      if(e.snapMode != "inner") {
        var p = Math.abs(n - j) <= f, q = Math.abs(o - i) <= f, r = Math.abs(l - h) <= f, s = Math.abs(m - g) <= f;
        p && (c.position.top = d._convertPositionTo("relative", {top:n - d.helperProportions.height, left:0}).top - d.margins.top), q && (c.position.top = d._convertPositionTo("relative", {top:o, left:0}).top - d.margins.top), r && (c.position.left = d._convertPositionTo("relative", {top:0, left:l - d.helperProportions.width}).left - d.margins.left), s && (c.position.left = d._convertPositionTo("relative", {top:0, left:m}).left - d.margins.left)
      }
      var t = p || q || r || s;
      if(e.snapMode != "outer") {
        var p = Math.abs(n - i) <= f, q = Math.abs(o - j) <= f, r = Math.abs(l - g) <= f, s = Math.abs(m - h) <= f;
        p && (c.position.top = d._convertPositionTo("relative", {top:n, left:0}).top - d.margins.top), q && (c.position.top = d._convertPositionTo("relative", {top:o - d.helperProportions.height, left:0}).top - d.margins.top), r && (c.position.left = d._convertPositionTo("relative", {top:0, left:l}).left - d.margins.left), s && (c.position.left = d._convertPositionTo("relative", {top:0, left:m - d.helperProportions.width}).left - d.margins.left)
      }
      !d.snapElements[k].snapping && (p || q || r || s || t) && d.options.snap.snap && d.options.snap.snap.call(d.element, b, a.extend(d._uiHash(), {snapItem:d.snapElements[k].item})), d.snapElements[k].snapping = p || q || r || s || t
    }
  }}), a.ui.plugin.add("draggable", "stack", {start:function(b, c) {
    var d = a(this).data("draggable").options, e = a.makeArray(a(d.stack)).sort(function(b, c) {
      return(parseInt(a(b).css("zIndex"), 10) || 0) - (parseInt(a(c).css("zIndex"), 10) || 0)
    });
    if(!!e.length) {
      var f = parseInt(e[0].style.zIndex) || 0;
      a(e).each(function(a) {
        this.style.zIndex = f + a
      }), this[0].style.zIndex = f + e.length
    }
  }}), a.ui.plugin.add("draggable", "zIndex", {start:function(b, c) {
    var d = a(c.helper), e = a(this).data("draggable").options;
    d.css("zIndex") && (e._zIndex = d.css("zIndex")), d.css("zIndex", e.zIndex)
  }, stop:function(b, c) {
    var d = a(this).data("draggable").options;
    d._zIndex && a(c.helper).css("zIndex", d._zIndex)
  }})
})(jQuery);
(function(a, b) {
  var c = !1;
  a(document).mouseup(function(a) {
    c = !1
  }), a.widget("ui.mouse", {options:{cancel:":input,option", distance:1, delay:0}, _mouseInit:function() {
    var b = this;
    this.element.bind("mousedown." + this.widgetName, function(a) {
      return b._mouseDown(a)
    }).bind("click." + this.widgetName, function(c) {
      if(!0 === a.data(c.target, b.widgetName + ".preventClickEvent")) {
        a.removeData(c.target, b.widgetName + ".preventClickEvent"), c.stopImmediatePropagation();
        return!1
      }
    }), this.started = !1
  }, _mouseDestroy:function() {
    this.element.unbind("." + this.widgetName)
  }, _mouseDown:function(b) {
    if(!c) {
      this._mouseStarted && this._mouseUp(b), this._mouseDownEvent = b;
      var d = this, e = b.which == 1, f = typeof this.options.cancel == "string" && b.target.nodeName ? a(b.target).closest(this.options.cancel).length : !1;
      if(!e || f || !this._mouseCapture(b)) {
        return!0
      }
      this.mouseDelayMet = !this.options.delay, this.mouseDelayMet || (this._mouseDelayTimer = setTimeout(function() {
        d.mouseDelayMet = !0
      }, this.options.delay));
      if(this._mouseDistanceMet(b) && this._mouseDelayMet(b)) {
        this._mouseStarted = this._mouseStart(b) !== !1;
        if(!this._mouseStarted) {
          b.preventDefault();
          return!0
        }
      }
      !0 === a.data(b.target, this.widgetName + ".preventClickEvent") && a.removeData(b.target, this.widgetName + ".preventClickEvent"), this._mouseMoveDelegate = function(a) {
        return d._mouseMove(a)
      }, this._mouseUpDelegate = function(a) {
        return d._mouseUp(a)
      }, a(document).bind("mousemove." + this.widgetName, this._mouseMoveDelegate).bind("mouseup." + this.widgetName, this._mouseUpDelegate), b.preventDefault(), c = !0;
      return!0
    }
  }, _mouseMove:function(b) {
    if(a.browser.msie && !(document.documentMode >= 9) && !b.button) {
      return this._mouseUp(b)
    }
    if(this._mouseStarted) {
      this._mouseDrag(b);
      return b.preventDefault()
    }
    this._mouseDistanceMet(b) && this._mouseDelayMet(b) && (this._mouseStarted = this._mouseStart(this._mouseDownEvent, b) !== !1, this._mouseStarted ? this._mouseDrag(b) : this._mouseUp(b));
    return!this._mouseStarted
  }, _mouseUp:function(b) {
    a(document).unbind("mousemove." + this.widgetName, this._mouseMoveDelegate).unbind("mouseup." + this.widgetName, this._mouseUpDelegate), this._mouseStarted && (this._mouseStarted = !1, b.target == this._mouseDownEvent.target && a.data(b.target, this.widgetName + ".preventClickEvent", !0), this._mouseStop(b));
    return!1
  }, _mouseDistanceMet:function(a) {
    return Math.max(Math.abs(this._mouseDownEvent.pageX - a.pageX), Math.abs(this._mouseDownEvent.pageY - a.pageY)) >= this.options.distance
  }, _mouseDelayMet:function(a) {
    return this.mouseDelayMet
  }, _mouseStart:function(a) {
  }, _mouseDrag:function(a) {
  }, _mouseStop:function(a) {
  }, _mouseCapture:function(a) {
    return!0
  }})
})(jQuery);
(function(a, b) {
  if(a.cleanData) {
    var c = a.cleanData;
    a.cleanData = function(b) {
      for(var d = 0, e;(e = b[d]) != null;d++) {
        try {
          a(e).triggerHandler("remove")
        }catch(f) {
        }
      }
      c(b)
    }
  }else {
    var d = a.fn.remove;
    a.fn.remove = function(b, c) {
      return this.each(function() {
        c || (!b || a.filter(b, [this]).length) && a("*", this).add([this]).each(function() {
          try {
            a(this).triggerHandler("remove")
          }catch(b) {
          }
        });
        return d.call(a(this), b, c)
      })
    }
  }
  a.widget = function(b, c, d) {
    var e = b.split(".")[0], f;
    b = b.split(".")[1], f = e + "-" + b, d || (d = c, c = a.Widget), a.expr[":"][f] = function(c) {
      return!!a.data(c, b)
    }, a[e] = a[e] || {}, a[e][b] = function(a, b) {
      arguments.length && this._createWidget(a, b)
    };
    var g = new c;
    g.options = a.extend(!0, {}, g.options), a[e][b].prototype = a.extend(!0, g, {namespace:e, widgetName:b, widgetEventPrefix:a[e][b].prototype.widgetEventPrefix || b, widgetBaseClass:f}, d), a.widget.bridge(b, a[e][b])
  }, a.widget.bridge = function(c, d) {
    a.fn[c] = function(e) {
      var f = typeof e == "string", g = Array.prototype.slice.call(arguments, 1), h = this;
      e = !f && g.length ? a.extend.apply(null, [!0, e].concat(g)) : e;
      if(f && e.charAt(0) === "_") {
        return h
      }
      f ? this.each(function() {
        var d = a.data(this, c), f = d && a.isFunction(d[e]) ? d[e].apply(d, g) : d;
        if(f !== d && f !== b) {
          h = f;
          return!1
        }
      }) : this.each(function() {
        var b = a.data(this, c);
        b ? b.option(e || {})._init() : a.data(this, c, new d(e, this))
      });
      return h
    }
  }, a.Widget = function(a, b) {
    arguments.length && this._createWidget(a, b)
  }, a.Widget.prototype = {widgetName:"widget", widgetEventPrefix:"", options:{disabled:!1}, _createWidget:function(b, c) {
    a.data(c, this.widgetName, this), this.element = a(c), this.options = a.extend(!0, {}, this.options, this._getCreateOptions(), b);
    var d = this;
    this.element.bind("remove." + this.widgetName, function() {
      d.destroy()
    }), this._create(), this._trigger("create"), this._init()
  }, _getCreateOptions:function() {
    return a.metadata && a.metadata.get(this.element[0])[this.widgetName]
  }, _create:function() {
  }, _init:function() {
  }, destroy:function() {
    this.element.unbind("." + this.widgetName).removeData(this.widgetName), this.widget().unbind("." + this.widgetName).removeAttr("aria-disabled").removeClass(this.widgetBaseClass + "-disabled " + "ui-state-disabled")
  }, widget:function() {
    return this.element
  }, option:function(c, d) {
    var e = c;
    if(arguments.length === 0) {
      return a.extend({}, this.options)
    }
    if(typeof c == "string") {
      if(d === b) {
        return this.options[c]
      }
      e = {}, e[c] = d
    }
    this._setOptions(e);
    return this
  }, _setOptions:function(b) {
    var c = this;
    a.each(b, function(a, b) {
      c._setOption(a, b)
    });
    return this
  }, _setOption:function(a, b) {
    this.options[a] = b, a === "disabled" && this.widget()[b ? "addClass" : "removeClass"](this.widgetBaseClass + "-disabled" + " " + "ui-state-disabled").attr("aria-disabled", b);
    return this
  }, enable:function() {
    return this._setOption("disabled", !1)
  }, disable:function() {
    return this._setOption("disabled", !0)
  }, _trigger:function(b, c, d) {
    var e, f, g = this.options[b];
    d = d || {}, c = a.Event(c), c.type = (b === this.widgetEventPrefix ? b : this.widgetEventPrefix + b).toLowerCase(), c.target = this.element[0], f = c.originalEvent;
    if(f) {
      for(e in f) {
        e in c || (c[e] = f[e])
      }
    }
    this.element.trigger(c, d);
    return!(a.isFunction(g) && g.call(this.element[0], c, d) === !1 || c.isDefaultPrevented())
  }}
})(jQuery);
VISH.Mods.fc = {};
VISH.Mods.fc.loader = function(V, undefined) {
  var init = function(fc) {
    var tmpVideo;
    var loaders = [];
    loaders.push(V.Utils.loader.loadImage("libimages/loading.png"));
    loaders.push(V.Utils.loader.loadImage("libimages/rounded_corners.png"));
    loaders.push(V.Utils.loader.loadImage("libimages/template1.png"));
    loaders.push(V.Utils.loader.loadImage("libimages/play.png"));
    loaders.push(V.Utils.loader.loadImage("libimages/corner.png"));
    loaders.push(V.Utils.loader.loadImage("libimages/corner_small.png"));
    loaders.push(V.Utils.loader.loadImage("libimages/corner_small_text.png"));
    loaders.push(V.Utils.loader.loadImage("libimages/filled.png"));
    loaders.push(V.Utils.loader.loadImage("libimages/closeicon.png"));
    loaders.push(V.Utils.loader.loadImage("libimages/anim.png"));
    loaders.push(V.Utils.loader.loadImage(fc.backgroundSrc));
    for(var i = 0;i < fc.pois.length;i++) {
      for(var p = 0;p < fc.pois[i].zonesContent.length;p++) {
        if(fc.pois[i].zonesContent[p].type === "image") {
          loaders.push(V.Utils.loader.loadImage(fc.pois[i].zonesContent[p].content))
        }else {
          if(fc.pois[i].zonesContent[p].type === "video") {
            tmpVideo = document.createElement("video");
            for(var j = 0;j < fc.pois[i].zonesContent[p].content.length;j++) {
              if(tmpVideo.canPlayType(fc.pois[i].zonesContent[p].content[j].mimetype)) {
                loaders.push(V.Utils.loader.loadVideo(fc.pois[i].zonesContent[p].content[j].src, i));
                break
              }
            }
          }
        }
      }
    }
    $.when.apply(null, loaders).done(function() {
      console.log("Flashcard preloaded!")
    })
  };
  return{init:init}
}(VISH);
VISH.Mods.fc.player = function(V, $, undefined) {
  var INTERVAL = 10;
  var WIDTH = 800;
  var HEIGHT = 600;
  var NUMBER_OF_FRAMES = 10;
  var FRAME_WIDTH = 40;
  var FRAME_HEIGHT = 40;
  var canvas = null;
  var ctx = null;
  var flashcard = null;
  var slideId = null;
  var intervalReturn = null;
  var stylePaddingLeft = null;
  var stylePaddingTop = null;
  var styleBorderLeft = null;
  var styleBorderTop = null;
  var htmlTop = null;
  var htmlLeft = null;
  var init = function(fcElem, mySlideId) {
    var loadingImg;
    var tmpFlashcard = JSON.parse(fcElem.jsoncontent);
    flashcard = _removeNotPlayableVideos(tmpFlashcard);
    slideId = mySlideId;
    canvas = document.getElementById(fcElem.canvasid);
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    loadingImg = V.Utils.loader.getImage("libimages/loading.png");
    ctx = canvas.getContext("2d");
    ctx.drawImage(loadingImg, 0, 0);
    V.Mods.fc.template.init(ctx, slideId);
    _initGetMouseVariables();
    _initListeners();
    intervalReturn = setInterval(function() {
      update();
      draw()
    }, 1E3 / INTERVAL)
  };
  var update = function() {
    var myState;
    myState = V.SlideManager.getStatus(slideId);
    myState.poiFrameNumber = (myState.poiFrameNumber + 1) % NUMBER_OF_FRAMES;
    V.SlideManager.updateStatus(myState.id, myState)
  };
  var draw = function() {
    var poi, animX;
    var myState;
    myState = V.SlideManager.getStatus(slideId);
    ctx.drawImage(V.Utils.loader.getImage(flashcard.backgroundSrc), 0, 0, WIDTH, HEIGHT);
    ctx.drawImage(V.Utils.loader.getImage("libimages/rounded_corners.png"), 0, 0);
    for(var i = 0;i < flashcard.pois.length;i++) {
      poi = flashcard.pois[i];
      animX = myState.poiFrameNumber * FRAME_WIDTH;
      ctx.drawImage(V.Utils.loader.getImage("libimages/anim.png"), animX, 0, FRAME_WIDTH, FRAME_HEIGHT, poi.x, poi.y, FRAME_WIDTH, FRAME_HEIGHT)
    }
    if(myState.drawingPoi > 0) {
      V.Mods.fc.template.draw(flashcard.pois[myState.drawingPoi - 1])
    }
  };
  var clear = function() {
    clearInterval(intervalReturn)
  };
  var _removeNotPlayableVideos = function(fc) {
    var poi, zone;
    var tmpVideo = document.createElement("video");
    for(var i = 0;i < fc.pois.length;i++) {
      poi = fc.pois[i];
      for(var a = 0;a < poi.zonesContent.length;a++) {
        zone = poi.zonesContent[a];
        if(zone.type === "video") {
          for(var t = 0;t < zone.content.length;t++) {
            if(tmpVideo.canPlayType(zone.content[t].mimetype)) {
              zone.content = zone.content[t].src
            }
          }
        }
      }
    }
    return fc
  };
  var _initGetMouseVariables = function() {
    var html;
    if(document.defaultView && document.defaultView.getComputedStyle) {
      stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(canvas, null)["paddingLeft"], 10) || 0;
      stylePaddingTop = parseInt(document.defaultView.getComputedStyle(canvas, null)["paddingTop"], 10) || 0;
      styleBorderLeft = parseInt(document.defaultView.getComputedStyle(canvas, null)["borderLeftWidth"], 10) || 0;
      styleBorderTop = parseInt(document.defaultView.getComputedStyle(canvas, null)["borderTopWidth"], 10) || 0
    }
    html = document.body.parentNode;
    htmlTop = html.offsetTop;
    htmlLeft = html.offsetLeft
  };
  var _initListeners = function() {
    var myState;
    myState = V.SlideManager.getStatus(slideId);
    canvas.addEventListener("selectstart", function(e) {
      e.preventDefault();
      return false
    }, false);
    canvas.addEventListener("click", function(e) {
      var mouse, mx, my, poi;
      mouse = _getMouse(e);
      mx = mouse.x;
      my = mouse.y;
      if(myState.drawingPoi > 0) {
        V.Mods.fc.template.update(flashcard.pois[myState.drawingPoi - 1], mx, my)
      }else {
        for(var i = 0;i < flashcard.pois.length;i++) {
          poi = flashcard.pois[i];
          if(poi.x <= mx && poi.x + FRAME_WIDTH >= mx && poi.y <= my && poi.y + FRAME_HEIGHT >= my) {
            myState.drawingPoi = poi.id;
            V.SlideManager.updateStatus(myState.id, myState)
          }
        }
      }
    })
  };
  var _getMouse = function(e) {
    var element, offsetX, offsetY, mx, my;
    element = canvas;
    offsetX = 0;
    offsetY = 0;
    if(element.offsetParent !== undefined) {
      do {
        offsetX += element.offsetLeft;
        offsetY += element.offsetTop
      }while(element = element.offsetParent)
    }
    offsetX += stylePaddingLeft + styleBorderLeft + htmlLeft;
    offsetY += stylePaddingTop + styleBorderTop + htmlTop;
    mx = e.pageX - offsetX;
    my = e.pageY - offsetY;
    return{x:mx, y:my}
  };
  return{init:init, clear:clear}
}(VISH, jQuery);
VISH.Mods.fc.template = function(V, $, undefined) {
  var TYPES = [{"x":80, "y":60, "width":642, "height":482, "closingButtonX":672, "closingButtonY":60, "closingButtonWidth":50, "closingButtonHeight":50, "image":"libimages/template1.png", "zones":[{"x":130, "y":99, "width":536, "height":402, "textstyle":"italic 16px helvetica, arial, sans-serif", "textcolor":"blue", "textlinespacing":40}]}, {"x":80, "y":60, "width":642, "height":482, "closingButtonX":672, "closingButtonY":60, "closingButtonWidth":50, "closingButtonHeight":50, "image":"libimages/template1.png", 
  "zones":[{"x":142, "y":99, "width":536, "height":33, "textstyle":"bold 26px Arial", "textcolor":"black", "textlinespacing":20}, {"x":132, "y":175, "width":536, "height":331, "textstyle":"16px Arial", "textcolor":"black", "textlinespacing":20}]}, {"x":80, "y":60, "width":642, "height":482, "closingButtonX":672, "closingButtonY":60, "closingButtonWidth":50, "closingButtonHeight":50, "image":"libimages/template1.png", "zones":[{"x":142, "y":99, "width":536, "height":33, "textstyle":"bold 26px arial", 
  "textcolor":"black", "textlinespacing":20}, {"x":122, "y":175, "width":260, "height":331, "textstyle":"italic 9px arial", "textcolor":"black", "textlinespacing":20}, {"x":418, "y":175, "width":260, "height":331, "textstyle":"12px aria", "textcolor":"black", "textlinespacing":20}]}];
  var ctx = null;
  var slideId = null;
  var init = function(context, mySlideId) {
    ctx = context;
    slideId = mySlideId
  };
  var update = function(poi, mx, my) {
    var isInsideClosingButton, template, myState, isInsideZone, tmpVideo, zone;
    template = TYPES[poi.templateNumber];
    myState = V.SlideManager.getStatus(slideId);
    isInsideClosingButton = template.closingButtonX <= mx && template.closingButtonX + template.closingButtonWidth >= mx && template.closingButtonY <= my && template.closingButtonY + template.closingButtonHeight >= my;
    if(isInsideClosingButton) {
      myState.drawingPoi = 0;
      for(var i = 0;i < poi.zonesContent.length;i++) {
        zone = poi.zonesContent[i];
        if(zone.type === "video") {
          tmpVideo = V.Utils.loader.getVideo(zone.content);
          tmpVideo.pause()
        }
      }
    }
    for(var i = 0;i < poi.zonesContent.length;i++) {
      zone = poi.zonesContent[i];
      if(zone.type === "video") {
        isInsideZone = template.zones[i].x <= mx && template.zones[i].x + template.zones[i].width >= mx && template.zones[i].y <= my && template.zones[i].y + template.zones[i].height >= my;
        if(isInsideZone) {
          tmpVideo = V.Utils.loader.getVideo(zone.content);
          if(tmpVideo.paused) {
            tmpVideo.play()
          }else {
            tmpVideo.pause()
          }
        }
      }
    }
  };
  var draw = function(poi) {
    var zone, template;
    var tmpImg, tmpWidth, tmpHeight, tmpVideo, lines, line;
    template = TYPES[poi.templateNumber];
    ctx.drawImage(V.Utils.loader.getImage(template.image), template.x, template.y, template.width, template.height);
    ctx.drawImage(V.Utils.loader.getImage("libimages/closeicon.png"), template.closingButtonX, template.closingButtonY, 50, 50);
    for(var i = 0;i < poi.zonesContent.length;i++) {
      zone = poi.zonesContent[i];
      zoneTemplate = template.zones[i];
      switch(zone.type) {
        case "text":
          ctx.fillStyle = "rgba(122, 151, 438, .9)";
          ctx.fillRect(zoneTemplate.x, zoneTemplate.y, zoneTemplate.width, zoneTemplate.height);
          ctx.font = zoneTemplate.textstyle;
          ctx.fillStyle = zoneTemplate.textcolor;
          ctx.textBaseline = "alphabetic";
          lines = V.Utils.text.getLines(ctx, zone.content, zoneTemplate.width - 20, ctx.font);
          for(line = 0;line < lines.length;line++) {
            ctx.fillText(lines[line], zoneTemplate.x + 10, zoneTemplate.y + 25 + line * zoneTemplate.textlinespacing)
          }
          V.Utils.canvas.drawRoundedCorners(ctx, zoneTemplate.x, zoneTemplate.y, zoneTemplate.width, zoneTemplate.height, "text");
          break;
        case "image":
          tmpImg = V.Utils.loader.getImage(zone.content);
          V.Utils.canvas.drawImageWithAspectRatioAndRoundedCorners(ctx, tmpImg, zoneTemplate.x, zoneTemplate.y, zoneTemplate.width, zoneTemplate.height);
          break;
        case "video":
          tmpVideo = V.Utils.loader.getVideo(zone.content);
          V.Utils.canvas.drawImageWithAspectRatioAndRoundedCorners(ctx, tmpVideo, zoneTemplate.x, zoneTemplate.y, zoneTemplate.width, zoneTemplate.height);
          if(tmpVideo.paused) {
            ctx.drawImage(V.Utils.loader.getImage("libimages/play.png"), zoneTemplate.x + zoneTemplate.width / 2 - 128 / 2, zoneTemplate.y + zoneTemplate.height / 2 - 128 / 2, 128, 128)
          }
          break
      }
    }
  };
  return{init:init, update:update, draw:draw}
}(VISH, jQuery);
VISH.Mods = {};
var PERMANENT_URL_PREFIX = "";
var SLIDE_CLASSES = ["far-past", "past", "current", "next", "far-next"];
var PM_TOUCH_SENSITIVITY = 15;
var curSlide;
if(typeof document !== "undefined" && !("classList" in document.createElement("a"))) {
  (function(view) {
    var classListProp = "classList", protoProp = "prototype", elemCtrProto = (view.HTMLElement || view.Element)[protoProp], objCtr = Object;
    strTrim = String[protoProp].trim || function() {
      return this.replace(/^\s+|\s+$/g, "")
    }, arrIndexOf = Array[protoProp].indexOf || function(item) {
      for(var i = 0, len = this.length;i < len;i++) {
        if(i in this && this[i] === item) {
          return i
        }
      }
      return-1
    }, DOMEx = function(type, message) {
      this.name = type;
      this.code = DOMException[type];
      this.message = message
    }, checkTokenAndGetIndex = function(classList, token) {
      if(token === "") {
        throw new DOMEx("SYNTAX_ERR", "An invalid or illegal string was specified");
      }
      if(/\s/.test(token)) {
        throw new DOMEx("INVALID_CHARACTER_ERR", "String contains an invalid character");
      }
      return arrIndexOf.call(classList, token)
    }, ClassList = function(elem) {
      var trimmedClasses = strTrim.call(elem.className), classes = trimmedClasses ? trimmedClasses.split(/\s+/) : [];
      for(var i = 0, len = classes.length;i < len;i++) {
        this.push(classes[i])
      }
      this._updateClassName = function() {
        elem.className = this.toString()
      }
    }, classListProto = ClassList[protoProp] = [], classListGetter = function() {
      return new ClassList(this)
    };
    DOMEx[protoProp] = Error[protoProp];
    classListProto.item = function(i) {
      return this[i] || null
    };
    classListProto.contains = function(token) {
      token += "";
      return checkTokenAndGetIndex(this, token) !== -1
    };
    classListProto.add = function(token) {
      token += "";
      if(checkTokenAndGetIndex(this, token) === -1) {
        this.push(token);
        this._updateClassName()
      }
    };
    classListProto.remove = function(token) {
      token += "";
      var index = checkTokenAndGetIndex(this, token);
      if(index !== -1) {
        this.splice(index, 1);
        this._updateClassName()
      }
    };
    classListProto.toggle = function(token) {
      token += "";
      if(checkTokenAndGetIndex(this, token) === -1) {
        this.add(token)
      }else {
        this.remove(token)
      }
    };
    classListProto.toString = function() {
      return this.join(" ")
    };
    if(objCtr.defineProperty) {
      var classListPropDesc = {get:classListGetter, enumerable:true, configurable:true};
      try {
        objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc)
      }catch(ex) {
        if(ex.number === -2146823252) {
          classListPropDesc.enumerable = false;
          objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc)
        }
      }
    }else {
      if(objCtr[protoProp].__defineGetter__) {
        elemCtrProto.__defineGetter__(classListProp, classListGetter)
      }
    }
  })(self)
}
function getSlideEl(no) {
  if(no < 0 || no >= slideEls.length) {
    return null
  }else {
    return slideEls[no]
  }
}
function updateSlideClass(slideNo, className) {
  var el = getSlideEl(slideNo);
  if(!el) {
    return
  }
  if(className) {
    el.classList.add(className)
  }
  for(var i in SLIDE_CLASSES) {
    if(className != SLIDE_CLASSES[i]) {
      el.classList.remove(SLIDE_CLASSES[i])
    }
  }
}
function updateSlides(goingRight) {
  for(var i = 0;i < slideEls.length;i++) {
    switch(i) {
      case curSlide - 2:
        updateSlideClass(i, "far-past");
        break;
      case curSlide - 1:
        updateSlideClass(i, "past");
        break;
      case curSlide:
        updateSlideClass(i, "current");
        break;
      case curSlide + 1:
        updateSlideClass(i, "next");
        break;
      case curSlide + 2:
        updateSlideClass(i, "far-next");
        break;
      default:
        updateSlideClass(i);
        break
    }
  }
  if(goingRight) {
    triggerLeaveEvent(curSlide - 1)
  }else {
    triggerLeaveEvent(curSlide + 1)
  }
  triggerEnterEvent(curSlide);
  window.setTimeout(function() {
    disableSlideFrames(curSlide - 2)
  }, 301);
  enableSlideFrames(curSlide - 1);
  enableSlideFrames(curSlide + 2);
  if(isChromeVoxActive()) {
    speakAndSyncToNode(slideEls[curSlide])
  }
  updateHash()
}
function buildNextItem() {
  var toBuild = slideEls[curSlide].querySelectorAll(".to-build");
  if(!toBuild.length) {
    return false
  }
  toBuild[0].classList.remove("to-build", "");
  if(isChromeVoxActive()) {
    speakAndSyncToNode(toBuild[0])
  }
  return true
}
function prevSlide() {
  if(curSlide > 0) {
    curSlide--;
    updateSlides(false)
  }
}
function nextSlide() {
  if(buildNextItem()) {
    return
  }
  if(curSlide < slideEls.length - 1) {
    curSlide++;
    updateSlides(true)
  }
}
function lastSlide() {
}
function triggerEnterEvent(no) {
  var el = getSlideEl(no);
  if(!el) {
    return
  }
  var onEnter = el.getAttribute("onslideenter");
  if(onEnter) {
    (new Function(onEnter)).call(el)
  }
  var evt = document.createEvent("Event");
  evt.initEvent("slideenter", true, true);
  evt.slideNumber = no + 1;
  el.dispatchEvent(evt)
}
function triggerLeaveEvent(no) {
  var el = getSlideEl(no);
  if(!el) {
    return
  }
  var onLeave = el.getAttribute("onslideleave");
  if(onLeave) {
    (new Function(onLeave)).call(el)
  }
  var evt = document.createEvent("Event");
  evt.initEvent("slideleave", true, true);
  evt.slideNumber = no + 1;
  el.dispatchEvent(evt)
}
function handleTouchStart(event) {
  if(event.touches.length == 1) {
    touchDX = 0;
    touchDY = 0;
    touchStartX = event.touches[0].pageX;
    touchStartY = event.touches[0].pageY;
    document.body.addEventListener("touchmove", handleTouchMove, true);
    document.body.addEventListener("touchend", handleTouchEnd, true)
  }
}
function handleTouchMove(event) {
  if(event.touches.length > 1) {
    cancelTouch()
  }else {
    touchDX = event.touches[0].pageX - touchStartX;
    touchDY = event.touches[0].pageY - touchStartY
  }
}
function handleTouchEnd(event) {
  var dx = Math.abs(touchDX);
  var dy = Math.abs(touchDY);
  if(dx > PM_TOUCH_SENSITIVITY && dy < dx * 2 / 3) {
    if(touchDX > 0) {
      prevSlide()
    }else {
      nextSlide()
    }
  }
  cancelTouch()
}
function cancelTouch() {
  document.body.removeEventListener("touchmove", handleTouchMove, true);
  document.body.removeEventListener("touchend", handleTouchEnd, true)
}
function disableSlideFrames(no) {
  var el = getSlideEl(no);
  if(!el) {
    return
  }
  var frames = el.getElementsByTagName("iframe");
  for(var i = 0, frame;frame = frames[i];i++) {
    disableFrame(frame)
  }
}
function enableSlideFrames(no) {
  var el = getSlideEl(no);
  if(!el) {
    return
  }
  var frames = el.getElementsByTagName("iframe");
  for(var i = 0, frame;frame = frames[i];i++) {
    enableFrame(frame)
  }
}
function disableFrame(frame) {
  frame.src = "about:blank"
}
function enableFrame(frame) {
  var src = frame._src;
  if(frame.src != src && src != "about:blank") {
    frame.src = src
  }
}
function setupFrames() {
  var frames = document.querySelectorAll("iframe");
  for(var i = 0, frame;frame = frames[i];i++) {
    frame._src = frame.src;
    disableFrame(frame)
  }
  enableSlideFrames(curSlide);
  enableSlideFrames(curSlide + 1);
  enableSlideFrames(curSlide + 2)
}
function setupInteraction() {
  document.body.addEventListener("touchstart", handleTouchStart, false)
}
function isChromeVoxActive() {
  if(typeof cvox == "undefined") {
    return false
  }else {
    return true
  }
}
function speakAndSyncToNode(node) {
  if(!isChromeVoxActive()) {
    return
  }
  cvox.ChromeVox.navigationManager.switchToStrategy(cvox.ChromeVoxNavigationManager.STRATEGIES.LINEARDOM, 0, true);
  cvox.ChromeVox.navigationManager.syncToNode(node);
  cvox.ChromeVoxUserCommands.finishNavCommand("");
  var target = node;
  while(target.firstChild) {
    target = target.firstChild
  }
  cvox.ChromeVox.navigationManager.syncToNode(target)
}
function speakNextItem() {
  if(!isChromeVoxActive()) {
    return
  }
  cvox.ChromeVox.navigationManager.switchToStrategy(cvox.ChromeVoxNavigationManager.STRATEGIES.LINEARDOM, 0, true);
  cvox.ChromeVox.navigationManager.next(true);
  if(!cvox.DomUtil.isDescendantOfNode(cvox.ChromeVox.navigationManager.getCurrentNode(), slideEls[curSlide])) {
    var target = slideEls[curSlide];
    while(target.firstChild) {
      target = target.firstChild
    }
    cvox.ChromeVox.navigationManager.syncToNode(target);
    cvox.ChromeVox.navigationManager.next(true)
  }
  cvox.ChromeVoxUserCommands.finishNavCommand("")
}
function speakPrevItem() {
  if(!isChromeVoxActive()) {
    return
  }
  cvox.ChromeVox.navigationManager.switchToStrategy(cvox.ChromeVoxNavigationManager.STRATEGIES.LINEARDOM, 0, true);
  cvox.ChromeVox.navigationManager.previous(true);
  if(!cvox.DomUtil.isDescendantOfNode(cvox.ChromeVox.navigationManager.getCurrentNode(), slideEls[curSlide])) {
    var target = slideEls[curSlide];
    while(target.lastChild) {
      target = target.lastChild
    }
    cvox.ChromeVox.navigationManager.syncToNode(target);
    cvox.ChromeVox.navigationManager.previous(true)
  }
  cvox.ChromeVoxUserCommands.finishNavCommand("")
}
function getCurSlideFromHash() {
  var slideNo = parseInt(location.hash.substr(1));
  if(slideNo) {
    curSlide = slideNo - 1
  }else {
    curSlide = 0
  }
}
function updateHash() {
  location.replace("#" + (curSlide + 1))
}
function handleBodyKeyDown(event) {
  switch(event.keyCode) {
    case 39:
    ;
    case 13:
    ;
    case 32:
    ;
    case 34:
      nextSlide();
      event.preventDefault();
      break;
    case 37:
    ;
    case 8:
    ;
    case 33:
      prevSlide();
      event.preventDefault();
      break;
    case 40:
      if(isChromeVoxActive()) {
        speakNextItem()
      }else {
        nextSlide()
      }
      event.preventDefault();
      break;
    case 38:
      if(isChromeVoxActive()) {
        speakPrevItem()
      }else {
        prevSlide()
      }
      event.preventDefault();
      break
  }
}
function addEventListeners() {
  document.addEventListener("keydown", handleBodyKeyDown, false)
}
function addFontStyle() {
  var el = document.createElement("link");
  el.rel = "stylesheet";
  el.type = "text/css";
  el.href = "http://fonts.googleapis.com/css?family=" + "Open+Sans:regular,semibold,italic,italicsemibold|Droid+Sans+Mono";
  document.body.appendChild(el)
}
function addGeneralStyle() {
  var el = document.createElement("link");
  el.rel = "stylesheet";
  el.type = "text/css";
  el.href = PERMANENT_URL_PREFIX + "stylesheets/styles.css";
  document.body.appendChild(el);
  var el = document.createElement("meta");
  el.name = "viewport";
  el.content = "width=1100,height=750";
  document.querySelector("head").appendChild(el);
  var el = document.createElement("meta");
  el.name = "apple-mobile-web-app-capable";
  el.content = "yes";
  document.querySelector("head").appendChild(el)
}
function makeBuildLists() {
  for(var i = curSlide, slide;slide = slideEls[i];i++) {
    var items = slide.querySelectorAll(".build > *");
    for(var j = 0, item;item = items[j];j++) {
      if(item.classList) {
        item.classList.add("to-build")
      }
    }
  }
}
function handleDomLoaded() {
  slideEls = document.querySelectorAll("section.slides > article");
  setupFrames();
  addFontStyle();
  addGeneralStyle();
  addEventListeners();
  updateSlides();
  setupInteraction();
  makeBuildLists();
  document.body.classList.add("loaded")
}
function initialize() {
  getCurSlideFromHash();
  if(window["_DEBUG"]) {
    PERMANENT_URL_PREFIX = "../"
  }
  if(window["_DCL"]) {
    handleDomLoaded()
  }else {
    document.addEventListener("OURDOMContentLoaded", handleDomLoaded, false)
  }
}
if(!window["_DEBUG"] && document.location.href.indexOf("?debug") !== -1) {
  document.addEventListener("OURDOMContentLoaded", function() {
    window["_DCL"] = true
  }, false);
  window["_DEBUG"] = true;
  var script = document.createElement("script");
  script.type = "text/javascript";
  script.src = "../slides.js";
  var s = document.getElementsByTagName("script")[0];
  s.parentNode.insertBefore(script, s);
  s.parentNode.removeChild(s)
}else {
  initialize()
}
;eval(function(p, a, c, k, e, r) {
  e = function(c) {
    return(c < a ? "" : e(parseInt(c / a))) + ((c = c % a) > 35 ? String.fromCharCode(c + 29) : c.toString(36))
  };
  if(!"".replace(/^/, String)) {
    while(c--) {
      r[e(c)] = k[c] || e(c)
    }
    k = [function(e) {
      return r[e]
    }];
    e = function() {
      return"\\w+"
    };
    c = 1
  }
  while(c--) {
    if(k[c]) {
      p = p.replace(new RegExp("\\b" + e(c) + "\\b", "g"), k[c])
    }
  }
  return p
}("7 2={N:[],I:9,S:1o,i:0,Y:6(a){7 b=8.1k('o');b.1j('B','2-Q-'+a);b.10='2-X';b.1m.1n=2.S;2.S++;8.1p.1r(b)},H:6(){7 a=1s 1t().1x();a=1z.1D(1,1G)+a;3(!2.I){2.q(F,\"U\",6(){2.Y(a)})}w{2.Y(a)}C a},1H:6(){},G:6(e,f){2.i++;f.1I=2.i;e=e.15(/\\n/g,'<1c />');e=e.15(/\\r/g,'<1c />');7 a='';3(f.5=='t'){a='<o A=\"x-t\">'+'<M B=\"x-M-'+f.4+'\" 5=\"1C\" />'+'</o>'}7 b='1A';7 c='1y';7 d='';3(f.p.u){b=f.p.u}3(f.p.y){c=f.p.y}3(f.p.14){d=f.p.14}7 g='';3(f.5!='L'){g='<o A=\"x-1q\">';3(f.5=='E'){g+='<D B=\"E-u-'+f.4+'\">'+b+'</D>'}3(f.5=='t'||f.5=='z'){g+='<D B=\"'+f.5+'-y-'+f.4+'\" A=\"y\">'+c+'</D>'+'<D B=\"'+f.5+'-u-'+f.4+'\">'+b+'</D>'}g+='</o>'}7 h='<o B=\"2-1a-'+f.4+'\" A=\"1l\"></o>'+'<o A=\"x 2 '+d+'\">'+'<o A=\"x-1v\">'+e+a+g+'</o>'+'</o>';3(!2.I){2.q(F,\"U\",6(){2.Z(e,f,h)})}w{2.Z(e,f,h)}},Z:6(e,f,a){7 b=8.l('2-Q-'+f.4+'');b.10='2-X 2-1g';b.K=a;1h(b.K==\"\"){b.K=a}3(2.N[f.4]){1i(2.N[f.4])}7 g=8.l('2-1a-'+f.4+'');2.q(g,\"s\",6(){2.k(f.5,f.4);3(f.5=='t'||f.5=='z'){f.m(9)}});3(f.5=='E'){7 h=8.l('E-u-'+f.4+'');2.q(h,\"s\",6(){2.k(f.5,f.4)});8.O=6(e){3(!e)e=F.W;3(e.v==13||e.v==16||e.v==V){2.k(f.5,f.4)}}}3(f.5=='z'){7 h=8.l('z-y-'+f.4+'');2.q(h,\"s\",6(){2.k(f.5,f.4);f.m(9)});7 i=8.l('z-u-'+f.4+'');2.q(i,\"s\",6(){2.k(f.5,f.4);f.m(P)});8.O=6(e){3(!e)e=F.W;3(e.v==13||e.v==16){2.k(f.5,f.4);f.m(P)}w 3(e.v==V){2.k(f.5,f.4);f.m(9)}}}3(f.5=='t'){7 c=8.l('x-M-'+f.4+'');11(6(){c.1u();c.1f()},1w);7 h=8.l('t-y-'+f.4+'');2.q(h,\"s\",6(){2.k(f.5,f.4);f.m(9)});7 j=8.l('x-M-'+f.4+'');7 i=8.l('t-u-'+f.4+'');2.q(i,\"s\",6(){2.k(f.5,f.4);f.m(j.1b)});8.O=6(e){3(!e)e=F.W;3(e.v==13){2.k(f.5,f.4);f.m(j.1b)}w 3(e.v==V){2.k(f.5,f.4);f.m(9)}}}3(f.5=='L'){2.N[f.4]=11(6(){2.k(f.5,f.4)},f.19)}},k:6(a,b){7 c=8.l('2-Q-'+b);c.10='2-X';3(g=8.l(a+'-u-'+b)){2.T(g,\"s\",6(){});8.O=1B}3(h=8.l(a+'-y-'+b)){2.T(h,\"s\",6(){})}2.i=0;c.K=''},E:6(e,f){3(J(f)!='R'){f=9}7 a=2.H();2.G(e,{5:'E',p:f,4:a})},L:6(e,f){3(J(f)=='1E'){f=1F}7 a=2.H();2.G(e,{5:'L',19:f,p:9,4:a})},z:6(e,f,g){3(J(g)!='R'){g=9}7 a=2.H();2.G(e,{5:'z',m:f,p:g,4:a})},t:6(e,f,g){3(J(g)!='R'){g=9}7 a=2.H();C 2.G(e,{5:'t',m:f,p:g,4:a})},q:6(e,f,g){3(e.12){e.12(f,g,9)}w 3(e.1e){7 r=e.1e('18'+f,g);C r}w{C 9}},T:6(e,f,g){3(e.17){e.17(\"s\",g,9)}w 3(e.1d){7 r=e.1d('18'+f,g);C r}w{C 9}}};3(!2.I){2.q(F,\"U\",6(){2.I=P})}", 
62, 107, "||smoke|if|newid|type|function|var|document|false|||||||||||destroy|getElementById|callback||div|params|listen||click|prompt|ok|keyCode|else|dialog|cancel|confirm|class|id|return|button|alert|window|build|newdialog|init|typeof|innerHTML|signal|input|smoketimeout|onkeyup|true|out|object|zindex|stoplistening|load|27|event|base|bodyload|finishbuild|className|setTimeout|addEventListener||classname|replace|32|removeEventListener|on|timeout|bg|value|br|detachEvent|attachEvent|select|visible|while|clearTimeout|setAttribute|createElement|smokebg|style|zIndex|1000|body|buttons|appendChild|new|Date|focus|inner|100|getTime|Cancel|Math|OK|null|text|random|undefined|5000|99|forceload|stack".split("|"), 
0, {}));

