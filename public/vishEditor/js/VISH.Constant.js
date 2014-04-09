VISH.Constant = VISH.Constant || {};

//VE Modes
VISH.Constant.Edit = "Editor";
VISH.Constant.Viewer  = "Viewer";
VISH.Constant.AnyMode  = "Both";

//VE Server Modes
VISH.Constant.NOSERVER = "noserver";
VISH.Constant.VISH = "vish";
VISH.Constant.STANDALONE = "node";

//User agents and browsers
VISH.Constant.UA_IE = 'Microsoft Internet Explorer';
VISH.Constant.UA_NETSCAPE = 'Netscape';

VISH.Constant.IE = 'Internet Explorer';
VISH.Constant.FIREFOX = 'Mozilla Firefox';
VISH.Constant.CHROME = 'Google Chrome';
VISH.Constant.SAFARI = 'Safari';
VISH.Constant.ANDROID_BROWSER = 'Android Browser';

//Zone sizes
VISH.Constant.EXTRA_SMALL = "extra_small";
VISH.Constant.SMALL = "small";
VISH.Constant.MEDIUM = "medium";
VISH.Constant.LARGE = "large";

//Defaults
VISH.Constant.THUMBNAIL = "thumbnail";
VISH.Constant.NONE = "none";
VISH.Constant.UNKNOWN = 'Unknown';
VISH.Constant.AGE_RANGE_MIN = 4;
VISH.Constant.AGE_RANGE_MAX = 20;
VISH.Constant.AGE_RANGE = VISH.Constant.AGE_RANGE_MIN + " - " + VISH.Constant.AGE_RANGE_MAX;
VISH.Constant.DIFFICULTY = 0;

//Presentation types
VISH.Constant.PRESENTATION = "presentation";
VISH.Constant.QUIZ_SIMPLE = "quiz_simple";

//Slide types
VISH.Constant.STANDARD = "standard";
VISH.Constant.SLIDESET = "slideset";
VISH.Constant.FLASHCARD = "flashcard";
VISH.Constant.VTOUR = "VirtualTour";
VISH.Constant.EVIDEO = "enrichedvideo";
VISH.Constant.GAME = "game";

//Element types
VISH.Constant.TEXT = "text";
VISH.Constant.IMAGE = "image";
VISH.Constant.AUDIO = "audio";
VISH.Constant.VIDEO = "video";
VISH.Constant.OBJECT = "object";
VISH.Constant.SNAPSHOT = "snapshot";
VISH.Constant.APPLET = "applet";
VISH.Constant.QUIZ = "quiz";

//Media types
VISH.Constant.MEDIA = {};
VISH.Constant.MEDIA.IMAGE = "image";
VISH.Constant.MEDIA.FLASH = "swf";
VISH.Constant.MEDIA.PDF = "pdf";
VISH.Constant.MEDIA.YOUTUBE_VIDEO = "Youtube";
VISH.Constant.MEDIA.HTML5_VIDEO = "HTML5_VIDEO";
VISH.Constant.MEDIA.HTML5_AUDIO = "HTML5_AUDIO";
VISH.Constant.MEDIA.SOUNDCLOUD_AUDIO = "Soundcloud";
VISH.Constant.MEDIA.WEB = "web";
VISH.Constant.MEDIA.JSON = "json";
VISH.Constant.MEDIA.DOC = "doc";
VISH.Constant.MEDIA.PPT = "ppt";
VISH.Constant.MEDIA.SCORM_PACKAGE = "scormpackage";
VISH.Constant.MEDIA.IMS_QTI_QUIZ = "IMS_QTI_QUIZ";

//Wrapper types
VISH.Constant.WRAPPER = {};
VISH.Constant.WRAPPER.EMBED = "EMBED";
VISH.Constant.WRAPPER.OBJECT = "OBJECT";
VISH.Constant.WRAPPER.IFRAME = "IFRAME";
VISH.Constant.WRAPPER.VIDEO = "VIDEO";
VISH.Constant.WRAPPER.AUDIO = "AUDIO";

//Subtypes
VISH.Constant.QZ_TYPE = {};
VISH.Constant.QZ_TYPE.OPEN = "open";
VISH.Constant.QZ_TYPE.MCHOICE = "multiplechoice";
VISH.Constant.QZ_TYPE.TF = "truefalse";

//Quiz
VISH.Constant.QZ_MODE = {};
VISH.Constant.QZ_MODE.SELFA = "selfA";
VISH.Constant.QZ_MODE.RT = "realTime";

//Text
VISH.Constant.TextDefault = 12;
VISH.Constant.TextBase = 12;

//Clipboard
VISH.Constant.Clipboard = {};
VISH.Constant.Clipboard.Slide = "slide";
VISH.Constant.Clipboard.LocalStorageStack = "VishEditorClipboardStack";

//Themes
VISH.Constant.Themes = {};
VISH.Constant.Themes.Default = "theme1";

//Animations
VISH.Constant.Animations = {};
VISH.Constant.Animations.Default = "animation1";

//Events
VISH.Constant.Event = {};
VISH.Constant.Event.onMessage = "onMessage";
VISH.Constant.Event.onGoToSlide = "onGoToSlide";
VISH.Constant.Event.onPlayVideo = "onPlayVideo";
VISH.Constant.Event.onPauseVideo = "onPauseVideo";
VISH.Constant.Event.onSeekVideo = "onSeekVideo";
VISH.Constant.Event.onSubslideOpen = "onSubslideOpen";
VISH.Constant.Event.onSubslideClosed = "onSubslideClosed";
VISH.Constant.Event.onSetSlave = "onSetSlave";
VISH.Constant.Event.onPreventDefault = "onPreventDefault";
VISH.Constant.Event.allowExitWithoutConfirmation = "allowExitWithoutConfirmation";
VISH.Constant.Event.onSelectedSlides = "onSelectedSlides";
VISH.Constant.Event.onVEFocusChange = "onVEFocusChange";
VISH.Constant.Event.onSimpleClick = "onSimpleClick";
VISH.Constant.Event.onLongClick = "onLongClick";
VISH.Constant.Event.onUnknownTouchMovement = "onUnknownTouchMovement";

//Storage
VISH.Constant.Storage = {};
VISH.Constant.Storage.Device = "Device";

//VirtualTour
VISH.Constant.VTour = {};
VISH.Constant.VTour.DEFAULT_MAP = "roadmap";
VISH.Constant.VTour.ROADMAP = "roadmap";
VISH.Constant.VTour.SERVICES = {};
VISH.Constant.VTour.SERVICES.GMaps = "Google Maps";

//EVideo
VISH.Constant.EVideo = {};
VISH.Constant.EVideo.Status = {};
VISH.Constant.EVideo.Status.Ended = 0;
VISH.Constant.EVideo.Status.Playing = 1;
VISH.Constant.EVideo.Status.Paused = 2;

//Keys
VISH.Constant.INTRO = 13;