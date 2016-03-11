/*
 * SCORM RTE API Management
*/

SAPI.SCORM = (function(S,undefined){

    //SCORM API Instance
    var scorm;
    var connected;

    //Vars
    var COMPLETION_THRESHOLD = 0; //Force attempt completion!
    var COMPLETION_ATTEMPT_THRESHOLD = 0;
    var SCORE_THRESHOLD = 0.5; //Mastery score should be 50 for SCORM 1.2

    var init = function(){
        scorm = new SCORM_API({debug: true, windowDebug: false, exit_type: ""});
        connected = scorm.initialize();
        scorm.debug("Connected: " + connected,4);

        if(connected=='false'){
            document.body.innerHTML = "Error: SCORM API not connected";
            return;
        }

        //Init User model
        var learnerName = scorm.getvalue('cmi.learner_name');
        var learnerId = scorm.getvalue('cmi.learner_id');
        
        //Initial progress value
        _updateProgressMeasure(0);

        //Initial score values
        scorm.setvalue('cmi.score.min',(0).toString());
        scorm.setvalue('cmi.score.max',(100).toString());
        _updateScore(0);

        //Update score 3 seconds after initialize
        setTimeout(function(){
            _updateScore(1);
        },3000);

       //  on exit
        window.onbeforeunload = function(){
            scorm.terminate();
        };

        document.body.innerHTML = "SCORM succesfully connected";
    };

    var _updateProgressMeasure = function(progressMeasure){
        if(typeof progressMeasure == "number"){
            scorm.setvalue('cmi.progress_measure',progressMeasure.toString());
            _updateCompletionStatus(progressMeasure);
        }
    };

    var _updateCompletionStatus = function(progressMeasure){
        if(typeof progressMeasure != "number"){
            progressMeasure = 0;
        }

        var completionStatus;

        if(progressMeasure >= COMPLETION_THRESHOLD){
            completionStatus = "completed";
        } else if (progressMeasure>=COMPLETION_ATTEMPT_THRESHOLD){
            completionStatus = "incomplete";
        } else {
            completionStatus = "not attempted";
        }

        scorm.setvalue('cmi.completion_status',completionStatus);
    };

    var _updateScore = function(score){
        if(typeof score == "number"){
            score = Math.max(0,Math.min(1,score));
            scorm.setvalue('cmi.score.scaled',score.toString());
            scorm.setvalue('cmi.score.raw',(score*100).toString());
            _updateSuccessStatus(score);
        }
    };

    var _updateSuccessStatus = function(score){
        var successStatus;

        if(typeof score != "number"){
            successStatus = "unknown";
        } else if(score >= SCORE_THRESHOLD){
            successStatus = "passed";
        } else {
            successStatus = "failed";
        }

        scorm.setvalue('cmi.success_status',successStatus);
    };

    var getAPIInstance = function(){
        if(connected){
            return scorm;
        } else {
            return undefined;
        }       
    };

    var getLMSAPIInstance = function(){
        if((connected)&&(scorm)&&(scorm.API)&&((scorm.API.path))){
            return scorm.API.path;
        } else {
            return undefined;
        }       
    };


    return {
        init                : init,
        getAPIInstance      : getAPIInstance,
        getLMSAPIInstance   : getLMSAPIInstance
    };

})(SAPI);