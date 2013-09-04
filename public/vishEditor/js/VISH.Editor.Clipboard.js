VISH.Editor.Clipboard = (function(V,$,undefined){

	var stack;
	var _lastTimestamp;

	var init = function() {
		stack = [null,null,null];
		// stack = [ElementToCopy,typeOfElement,Params];
	};

	var copy = function(element,type) {
		if(element){
			var params = {};
			switch(type){
				case V.Constant.Clipboard.Slide:
					var slideType = V.Slides.getSlideType(element);
					switch(slideType){
						case V.Constant.STANDARD:
							//Store WYSIWYG values
							params.textAreas = V.Editor.Slides.copyTextAreasOfSlide(element);
							break;
						case V.Constant.FLASHCARD:
						case V.Constant.VTOUR:
							break;
						default:
							break;
					}
					break;
				default:
					return;
			}

			stack[0] = V.Utils.getOuterHTML($(element).clone()[0]);
			stack[1] = type;
			stack[2] = params;
			
			if(V.Status.getDevice().features.localStorage){
				localStorage.setItem(V.Constant.Clipboard.LocalStorageStack,JSON.stringify(stack));
			}
		}
	};

	var paste = function() {
		//Prevent massive copy
		if(_lastTimestamp){
			var elapsed = new Date().getTime() - _lastTimestamp;
			if(elapsed < 500){
				return;
			}
		}
		_lastTimestamp = new Date().getTime();

		//Select the stack
		if(V.Status.getDevice().features.localStorage){
			var storedStack = localStorage.getItem(V.Constant.Clipboard.LocalStorageStack);
			if(storedStack!==null){
				var myStack = JSON.parse(storedStack);
			}
		}

		if(!myStack){
			myStack = stack;
		}


		//Check selected stack and parse object to be copied
		if(!myStack[0]){
			return;
		} else {
			myStack[0] = $(myStack[0])[0];
		}


		switch(myStack[1]){
			case V.Constant.Clipboard.Slide:
				var slideToCopy = $(myStack[0]).clone()[0];

				// Prevent slidesets to be copied with keyboard shortcuts.
				// This feature is not well implemented yet.
				// TODO: Implement slideset copy feature
				if(V.Editor.Slideset.isSlideset(slideToCopy)){
					return;
				}

				var options = {};
				if(myStack[2]){
					if(myStack[2].textAreas){
						options.textAreas = myStack[2].textAreas;
					}
					if(myStack[2].JSON){
						options.JSON = myStack[2].JSON;
					}
				}
				V.Editor.Slides.copySlide(slideToCopy,options);
				break;
			default:
				break;
		}
	};


	return {
			init 		: init,
			copy		: copy,
			paste		: paste
	};

}) (VISH,jQuery);