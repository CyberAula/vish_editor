ig.module(
	'game.events'
)
.requires(
	'impact.impact'
)
.defines(function(){

ig.EVENTS = {
    VET_DIALOG_END: "vetDialogEnd",
    BLACKBOARD_PRESENTATION_END: "blackboardPresentationEnd",
    TV_VIDEO_END: "tvVideoEnd",
    INFORMATION_POINT_END: "informationPointEnd",
    GARDENER_DIALOG_END: "gardenerDialogEnd"
};

});