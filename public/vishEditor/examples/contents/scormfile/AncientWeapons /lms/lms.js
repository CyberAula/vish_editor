/**************
Articulate LMS Libary
--
Modify data to fit the rsecAPI
--
Version 3.3.000
**************/

var SURVEY_CORRECT_RESPONSE = "_";

// RSEC API
var lmsAPI = parent;
var g_bAPIPresent = false;
var g_bLMSPresent = false;

// Keep track of user history
var g_SlideViewsArray = new Array();
var g_SlideLastViewed = 1;
var g_strSlideViewData = "";

// Completion requirements
var g_LessonCompletionMethod = "quiz";
var g_LessonCompletionThreshold = "";
var g_LessonCompletionTargetSlide = "";
var g_TotalSlides = 0;

// Pass/Fail values
var g_strPassed = "completed";
var g_strFailed = "incomplete";

// Scoring Varaibles
var g_Status = "";
var g_Score	= "";			
var g_MinScore = 0;			
var g_MaxScore = 100;		
var g_MasteryScore = 0;	

// Is Lesson Completed
var g_bLessonCompleted = false;

// Resume data
var g_strResumeData = "";

// Save State Delay
var g_SaveTimeout;
var g_nDelayCount = 0;

if (lmsAPI && lmsAPI.IsLmsPresent)
{
	g_bAPIPresent = true;
	g_bLMSPresent = lmsAPI.IsLmsPresent();
}
	

function normalizeResult(result)  
{
	switch (result.toUpperCase().charAt(0))  {
	case 'correct': return lmsAPI.INTERACTION_RESULT_CORRECT;
	case 'wrong': return lmsAPI.INTERACTION_RESULT_WRONG;
	case 'unanticipated': return lmsAPI.INTERACTION_RESULT_UNANTICIPATED;
	case 'neutral': return lmsAPI.INTERACTION_RESULT_NEUTRAL;
	case 'C': return lmsAPI.INTERACTION_RESULT_CORRECT;
	case 'W': return lmsAPI.INTERACTION_RESULT_WRONG;
	case 'U': return lmsAPI.INTERACTION_RESULT_UNANTICIPATED;
	case 'N': return lmsAPI.INTERACTION_RESULT_NEUTRAL;
	}
	return result;
}

function normalizeStatus(status)  {
	switch (status.toUpperCase().charAt(0)) {
	case 'C': return "completed";
	case 'I': return "incomplete";
	case 'N': return "not attempted";	
	case 'F': return "failed";
	case 'P': return "passed";
	}
	return status;
}

function normalizeType(theType)  {
	switch (theType.toUpperCase().charAt(0)) 
	{
		case 'T': return "true-false";
		case 'C': return "choice";
		case 'F': return "fill-in";
		case 'M': return "matching";
		case 'P': return "performance";
		case 'S': return "sequencing";
		case 'L': return "likert";
		case 'N': return "numeric";
		case 'H': return "hotspot";
		case 'E': return "essay";
		case 'W': return "wordbank";
	}
	return theType;
}


function timecodeToMilliSeconds( tCode) 
{
	var results = tCode.split(":");
	var secs;
	for (var i = 0; i < results.length; i++)
	{
		if (results[i].substr(0,1) == "0")
		{
			results[i] = results[i].substr(1);
		}
	}
	secs = ((parseInt(results[0]) * 60) + parseInt(results[1])) * 60 + parseInt(results[2]);
	return secs * 1000;
}


function RecordInteractions(arrArgs)
{
	var bResult = true;

	var strDescription		= arrArgs[0];
	var strTime 			= arrArgs[1];
	var strId			= arrArgs[2];
	var strLearningObjectiveId	= arrArgs[3];
	var strType 			= arrArgs[4];
	var strCorrectResponse 		= arrArgs[5];
	var strStudentResponse		= arrArgs[6];
	var strResult			= arrArgs[7];
	var strWeight			= arrArgs[8];
	var nLatency			= timecodeToMilliSeconds(arrArgs[9]);

	strResult = normalizeResult(strResult);

	var strTemp = "";
	strTemp += "Description: " + strDescription + "\n";
	strTemp += "Time: " + strTime + "\n";
	strTemp += "Id: " + strId + "\n";
	strTemp += "Learning Objective Id: " + strLearningObjectiveId + "\n";
	strTemp += "Type: " + strType + "\n";
	strTemp += "Correct Response: " + strCorrectResponse + "\n";
	strTemp += "Student Response: " + strStudentResponse + "\n";
	strTemp += "Result: " + strResult + "\n";
	strTemp += "Weight: " + strWeight + "\n";
	strTemp += "Latency: " + parseInt(nLatency) + "\n";
	
	strStudentResponse = strStudentResponse.replace(/,/g,"&#44;")
	strCorrectResponse = strCorrectResponse.replace(/,/g,"&#44;")


	switch(strType)
	{
		case "likert":
			bResult = lmsAPI.RecordLikertInteraction(strId,
								 lmsAPI.CreateResponseIdentifier(strStudentResponse.substr(0,1), strStudentResponse),
								 strResult,
								 strCorrectResponse,
								 strDescription,
								 parseInt(strWeight),
								 parseInt(nLatency),
								 strLearningObjectiveId);
			break;

		case "hotspot":
			bResult = lmsAPI.RecordPerformanceInteraction(strId,
								      strStudentResponse,
								      strResult,
								      strCorrectResponse,
								      strDescription,
								      parseInt(strWeight),
								      parseInt(nLatency),
								      strLearningObjectiveId);
			break;

		case "true-false":	// True - False
			var bUserResult = (strStudentResponse.toLowerCase() == "true");
			var bCorrectResult = (strCorrectResponse.toLowerCase() == "true");

			bResult = lmsAPI.RecordTrueFalseInteraction(strId, 
							  bUserResult,
							  strResult,
							  bCorrectResult,
							  strDescription,
							  parseInt(strWeight),
							  parseInt(nLatency),
							  strLearningObjectiveId);
			break;
		case "choice":	// Multiple Choice
			var arrUserResult = strStudentResponse.split("|$#$|");
			var arrCorrectResult = strCorrectResponse.split("|$#$|");

			if (arrCorrectResult.length == 1 && arrCorrectResult[0] == "")
			{
				arrCorrectResult[0] = SURVEY_CORRECT_RESPONSE;
			}

			for (var i = 0; i < arrUserResult.length; i++)
			{
				var objUserResult = lmsAPI.CreateResponseIdentifier(arrUserResult[i].substr(0,1), arrUserResult[i]);
				arrUserResult[i] = objUserResult;
			}

			for (var i = 0; i < arrCorrectResult.length; i++)
			{
				var strShort = "";
				if (arrCorrectResult[i].length > 0)
				{
					strShort = arrCorrectResult[i].substr(0,1);
				}

				var objCorrectResponse = lmsAPI.CreateResponseIdentifier(strShort, arrCorrectResult[i]);

				arrCorrectResult[i] = objCorrectResponse;
			}


			bResult = lmsAPI.RecordMultipleChoiceInteraction(strId, 
							       arrUserResult,
							       strResult,
							       arrCorrectResult,
							       strDescription,
							       parseInt(strWeight),
							       parseInt(nLatency),
							       strLearningObjectiveId);
			break;

		case "wordbank":
		case "numeric":
		case "essay":	// Essay
		case "fill-in":	// Fillin
			bResult = lmsAPI.RecordFillInInteraction(strId, 
						       strStudentResponse,
						       strResult,
						       strCorrectResponse,
						       strDescription,
						       parseInt(strWeight),
						       parseInt(nLatency),
						       strLearningObjectiveId);
			break;
		case "matching":	// Matching

			var arrUserResult = strStudentResponse.split("|$#$|");
			var arrCorrectResult = strCorrectResponse.split("|$#$|");

			if (arrCorrectResult.length == 1 && arrCorrectResult[0] == "")
			{
				arrCorrectResult[0] = SURVEY_CORRECT_RESPONSE;
			}

			for (var i = 0; i < arrUserResult.length; i++)
			{
				var strSource = "" + (i + 1);
				var objSource = lmsAPI.CreateResponseIdentifier(strSource.substr(0,1), strSource);
				var objUserResult = lmsAPI.CreateResponseIdentifier(arrUserResult[i].substr(0,1), arrUserResult[i]);
				arrUserResult[i] = new lmsAPI.MatchingResponse(objSource, objUserResult);
			}

			for (var i = 0; i < arrCorrectResult.length; i++)
			{
				var strSource = "" + (i + 1);
				var objSource = lmsAPI.CreateResponseIdentifier(strSource.substr(0,1), strSource);
				var objCorrectResponse = lmsAPI.CreateResponseIdentifier(arrCorrectResult[i].substr(0,1), arrCorrectResult[i]);
				arrCorrectResult[i] = new lmsAPI.MatchingResponse(objSource, objCorrectResponse);
			}		

			bResult = lmsAPI.RecordMatchingInteraction(strId, 
							 arrUserResult,
							 strResult,
							 arrCorrectResult,
							 strDescription,
							 parseInt(strWeight),
							 parseInt(nLatency),
							 strLearningObjectiveId);
			break;
		case "performance":	// Performance
			bResult = lmsAPI.RecordPerformanceInteraction(strId, 
							    strStudentResponse,
							    strResult,
							    strCorrectResponse,
							    strDescription,
							    parseInt(strWeight),
							    parseInt(nLatency),
							    strLearningObjectiveId);
			break;
		case "sequencing":	// Sequencing
			var arrUserResult = strStudentResponse.split("|$#$|");
			var arrCorrectResult = strCorrectResponse.split("|$#$|");

			if (arrCorrectResult.length == 1 && arrCorrectResult[0] == "")
			{
				arrCorrectResult[0] = SURVEY_CORRECT_RESPONSE;
			}

			for (var i = 0; i < arrUserResult.length; i++)
			{
				var objUserResult = lmsAPI.CreateResponseIdentifier(arrUserResult[i].substr(0,1), arrUserResult[i]);
				arrUserResult[i] = objUserResult;
			}
			
			for (var i = 0; i < arrCorrectResult.length; i++)
			{
				var strShort = "";
				if (arrCorrectResult[i].length > 0)
				{
					strShort = arrCorrectResult[i].substr(0,1);
				}

				var objCorrectResponse = lmsAPI.CreateResponseIdentifier(arrCorrectResult[i].substr(0,1), arrCorrectResult[i]);
				arrCorrectResult[i] = objCorrectResponse;
			}

			bResult = lmsAPI.RecordSequencingInteraction(strId, 
							   arrUserResult,
							   strResult,
							   arrCorrectResult,
							   strDescription,
							   parseInt(strWeight),
							   parseInt(nLatency),
							   strLearningObjectiveId);
			break;
		case "likert":	// Likert
			bResult = lmsAPI.RecordLikertInteraction(strId, 
						       strStudentResponse,
						       strResult,
						       strCorrectResponse,
						       strDescription,
						       parseInt(strWeight),
						       parseInt(nLatency),
						       strLearningObjectiveId);
			break;
		case "numeric":	// Numeric
			bResult = lmsAPI.RecordNumericInteraction(strId, 
							strStudentResponse,
							strResult,
							strCorrectResponse,
							strDescription,
							parseInt(strWeight),
							parseInt(nLatency),
							strLearningObjectiveId);
			
			break;
	}

}

function SetStatus(strStatus)
{
	switch (strStatus)
	{
		case "complete":
		case "completed":
			lmsAPI.SetReachedEnd();
			break;
		case "incomplete":
			lmsAPI.ResetStatus();
			break;
		case "not attempted":
			break;
		case "failed":
			lmsAPI.SetFailed();
			break;
		case "passed":
			lmsAPI.SetPassed();
			break;
	}
}

function SaveStateData()
{
	g_nDelayCount++;

	if (g_SaveTimeout)
	{
		clearTimeout(g_SaveTimeout);
	}

	if (g_nDelayCount >= 10)
	{
		SaveNow();
	}
	else
	{
		g_SaveTimeout = setTimeout("SaveNow()",500);
	}
}

function ForceCommit()
{
	if (g_bAPIPresent)
	{
		if (g_strPlayer == "stealthray")
		{
			lmsAPI.SetDataChunk(g_strSlideViewData + "|" + g_strResumeData);
		}
		else
		{
			lmsAPI.SetDataChunk(g_strResumeData);
		}
		lmsAPI.CommitData();
	}
}

function SaveNow()
{
	g_nDelayCount = 0;

	if (g_bAPIPresent)
	{
		if (g_strPlayer == "stealthray")
		{
			lmsAPI.SetDataChunk(g_strSlideViewData + "|" + g_strResumeData);
		}
		else
		{
			lmsAPI.SetDataChunk(g_strResumeData);
		}
	}
}

function RetrieveStateData()
{
	if (!g_bAPIPresent)
	{
		return;
	}

	// Get Resume Data
	var strData = lmsAPI.GetDataChunk();

	if (strData != "")
	{
		var arrData = strData.split("|");
		var slidelist = "";

		// Restore our global values
		g_strSlideViewData = arrData[0] + "|" + arrData[1];
		g_strResumeData = arrData[2];

		// Get the last slide that we were on
		g_SlideLastViewed = arrData[1].substr(16);

		// Get the list of slide that have been viewed
		slidelist = arrData[0].substr(7)
		
		var sa = slidelist.split(",");
		for(var i = 0; i <= sa.length; i++) 
		{
			if (parseInt(sa[i])>0)  
			{  
				g_SlideViewsArray[parseInt(sa[i])] = 1;
			}  
		}
	}

	// Check to see if the lesson was completed
	g_bLessonCompleted = (lmsAPI.GetStatus() == lmsAPI.LESSON_STATUS_COMPLETED);
}

function UpdateViewStatus()
{
	if (g_LessonCompletionMethod.toLowerCase() == "view" && !g_bLessonCompleted)
	{
		numviewed = 0;
		for(var i = 1; i <= g_SlideViewsArray.length; i++) 
		{
			if (g_SlideViewsArray[i] == 1) 
			{ 
				numviewed++; 
			} 
		}

		if (numviewed>=g_LessonCompletionThreshold) 
		{		
			//if viewed enough, Mark as Complete!
			SetStatus(g_strPassed);
			g_bLessonCompleted = true;
		} 
		else 
		{
			SetStatus(g_strFailed);
		}
	}
}

var g_strLDelim = "|~|";
var g_strLInteractionDelim = "|#|";

function RecordChicoInteraction(arrArgs)
{
	var bResult = true;

	var strDescription		= arrArgs[0];
	var strTime 			= arrArgs[1];
	var strId				= arrArgs[2];
	var strLearningObjectiveId	= arrArgs[3];
	var strType 			= arrArgs[4];
	var strCorrectResponse 	= arrArgs[5];
	var strStudentResponse	= arrArgs[6];
	var strResult			= arrArgs[7];
	var strWeight			= arrArgs[8];
	var nLatency			= arrArgs[9];

	
	strResult = normalizeResult(strResult);

	var strTemp = "";
	strTemp += "Description: " + strDescription + "\n";
	strTemp += "Time: " + strTime + "\n";
	strTemp += "Id: " + strId + "\n";
	strTemp += "Learning Objective Id: " + strLearningObjectiveId + "\n";
	strTemp += "Type: " + strType + "\n";
	strTemp += "Correct Response: " + strCorrectResponse + "\n";
	strTemp += "Student Response: " + strStudentResponse + "\n";
	strTemp += "Result: " + strResult + "\n";
	strTemp += "Weight: " + strWeight + "\n";
	strTemp += "Latency: " + parseInt(nLatency) + "\n";
	
	switch(strType)
	{
		case "truefalse":	// True - False
			var bUserResult = (strStudentResponse.toLowerCase() == "true");
			var bCorrectResult = (strCorrectResponse.toLowerCase() == "true");

			bResult = lmsAPI.RecordTrueFalseInteraction(strId, 
							  bUserResult,
							  strResult,
							  bCorrectResult,
							  strDescription,
							  parseInt(strWeight),
							  parseInt(nLatency),
							  strLearningObjectiveId);
			break;
		
		case "wordbank":
		case "hotspot":
		case "multiplechoice":
		case "multipleresponse":
			var arrUserResult = strStudentResponse.split(g_strLInteractionDelim);
			var arrCorrectResult = strCorrectResponse.split(g_strLInteractionDelim);

			if (arrCorrectResult.length == 1 && arrCorrectResult[0] == "")
			{
				arrCorrectResult[0] = SURVEY_CORRECT_RESPONSE;
			}

			for (var i = 0; i < arrUserResult.length; i++)
			{
				var objUserResult = lmsAPI.CreateResponseIdentifier(arrUserResult[i].substr(0,1), arrUserResult[i]);
				arrUserResult[i] = objUserResult;
			}

			for (var i = 0; i < arrCorrectResult.length; i++)
			{
				var strShort = "";
				if (arrCorrectResult[i].length > 0)
				{
					strShort = arrCorrectResult[i].substr(0,1);
				}

				var objCorrectResponse = lmsAPI.CreateResponseIdentifier(strShort, arrCorrectResult[i]);

				arrCorrectResult[i] = objCorrectResponse;
			}


			bResult = lmsAPI.RecordMultipleChoiceInteraction(strId, 
							       arrUserResult,
							       strResult,
							       arrCorrectResult,
							       strDescription,
							       parseInt(strWeight),
							       parseInt(nLatency),
							       strLearningObjectiveId);
			break;
		
		case "essay":
		case "fillin":
		case "numeric":
			bResult = lmsAPI.RecordFillInInteraction(strId, 
						       strStudentResponse,
						       strResult,
						       strCorrectResponse,
						       strDescription,
						       parseInt(strWeight),
						       parseInt(nLatency),
						       strLearningObjectiveId);
			break;
			
		case "matching":	// Matching

			var arrUserResult = strStudentResponse.split(g_strLInteractionDelim);
			var arrCorrectResult = strCorrectResponse.split(g_strLInteractionDelim);
			var arrNewUserResult = new Array();
			var arrNewCorrectResult = new Array();
			var nIndex = 0;

			if (arrCorrectResult.length == 1 && arrCorrectResult[0] == "")
			{
				arrCorrectResult[0] = SURVEY_CORRECT_RESPONSE;
			}
			
			for (var i = 0; i < arrUserResult.length; i += 2)
			{
				var strShort = "" + (nIndex + 1);

				var objSource = lmsAPI.CreateResponseIdentifier(strShort.substr(0,1), arrUserResult[i]);
				var objUserResult = lmsAPI.CreateResponseIdentifier(arrUserResult[i + 1].substr(0,1), arrUserResult[i + 1]);
				arrNewUserResult[nIndex] = new lmsAPI.MatchingResponse(objSource, objUserResult);
				nIndex++;
			}

			nIndex = 0;
			for (var i = 0; i < arrCorrectResult.length; i += 2)
			{
				var strShort = "" + (nIndex + 1);
				
				var objSource = lmsAPI.CreateResponseIdentifier(strShort.substr(0,1), arrCorrectResult[i]);
				var objCorrectResponse = lmsAPI.CreateResponseIdentifier(arrCorrectResult[i + 1].substr(0,1), arrCorrectResult[i + 1]);
				arrNewCorrectResult[nIndex] = new lmsAPI.MatchingResponse(objSource, objCorrectResponse);
				nIndex++;
			}		

			bResult = lmsAPI.RecordMatchingInteraction(strId, 
							 arrNewUserResult,
							 strResult,
							 arrNewCorrectResult,
							 strDescription,
							 parseInt(strWeight),
							 parseInt(nLatency),
							 strLearningObjectiveId);
			break;
			
		case "sequence":
			var arrUserResult = strStudentResponse.split(g_strLInteractionDelim);
			var arrCorrectResult = strCorrectResponse.split(g_strLInteractionDelim);

			if (arrCorrectResult.length == 1 && arrCorrectResult[0] == "")
			{
				arrCorrectResult[0] = SURVEY_CORRECT_RESPONSE;
			}

			for (var i = 0; i < arrUserResult.length; i++)
			{
				var objUserResult = lmsAPI.CreateResponseIdentifier(arrUserResult[i].substr(0,1), arrUserResult[i]);
				arrUserResult[i] = objUserResult;
			}
			
			for (var i = 0; i < arrCorrectResult.length; i++)
			{
				var strShort = "";
				if (arrCorrectResult[i].length > 0)
				{
					strShort = arrCorrectResult[i].substr(0,1);
				}

				var objCorrectResponse = lmsAPI.CreateResponseIdentifier(arrCorrectResult[i].substr(0,1), arrCorrectResult[i]);
				arrCorrectResult[i] = objCorrectResponse;
			}

			bResult = lmsAPI.RecordSequencingInteraction(strId, 
							   arrUserResult,
							   strResult,
							   arrCorrectResult,
							   strDescription,
							   parseInt(strWeight),
							   parseInt(nLatency),
							   strLearningObjectiveId);
			break;
		case "likert":
			bResult = lmsAPI.RecordLikertInteraction(strId,
								 lmsAPI.CreateResponseIdentifier(strStudentResponse.substr(0,1), strStudentResponse),
								 strResult,
								 strCorrectResponse,
								 strDescription,
								 parseInt(strWeight),
								 parseInt(nLatency),
								 strLearningObjectiveId);
			break;
			break;
		default:
			alert("Unhandled: " + strType);
			break;
	}	
}

function lms_DoFSCommand(command, args)
{
	if (g_bAPIPresent)
	{
		args = String(args);
		command = String(command);

		var arrArgs = args.split(g_strLDelim);
		
		switch (command)
		{
			case "CC_SetInteractionDelim":
				g_strLInteractionDelim = args;
				break;
				
			case "CC_SetDelim":
				g_strLDelim = args;
				break;
				
			case "CC_LogInteraction":
			case "CC_SaveInteraction":
				RecordChicoInteraction(arrArgs);
				break;
				
			case "RR_SetResumeData":
			case "CC_SetResumeData":
				g_strResumeData = args;
				SaveStateData();
				break;
				
			case "CC_LogResults":
				// Retrieve the data 
				g_Status = normalizeStatus(arrArgs[0]);
				g_Score = arrArgs[1];
				g_MinScore = arrArgs[2];
				g_MaxScore = arrArgs[3];
				g_MasteryScore = arrArgs[4];	

				SetStatus(g_Status);
				lmsAPI.SetScore(g_Score, g_MaxScore, g_MinScore);
				
			case "RR_SetStatus":
				SetStatus(arrArgs[0]);
				break;
				
			case "CC_ClosePlayer":
				// This is an important milestone, save the data
				lmsAPI.CommitData();

				lmsAPI.ConcedeControl()

				break;				
		}
	}
}

function customFScommandHandler(command, args)
{
	if (!g_bAPIPresent)
	{
		return;
	}

	args = String(args);
	command = String(command);
	args = args.replace(/&amp;/g,"&")
	args = args.replace(/&quot;/g,"\"")
	args = args.replace(/&apos;/g,"'")

	var arrArgs = args.split("|$s$|");
	
	switch (command)
	{
		case "ART_DebugLms":
			lmsAPI.ShowDebugWindow();
			break;
		case "ART_SetResumeData":
			g_strResumeData = args.replace(/\|\$s\$\|/g,";");
			SaveStateData();
			break;
		case "ART_UpdateViewedStatus":
			UpdateViewStatus();
			break;
		case "ART_ResetViewed":
			g_SlideViewsArray = new Array();
			g_SlideViewsArray[1] = 1;
			break;

		case "ART_slideplay":
			g_SlideLastViewed = parseInt(arrArgs[0]);
			if (g_SlideViewsArray[g_SlideLastViewed] != 1)
			{
				g_SlideViewsArray[g_SlideLastViewed] = 1;
				UpdateViewStatus();
			}

			// Build our String
			g_strSlideViewData = "viewed=1";
			for(var i = 2; i <= g_SlideViewsArray.length; i++) 
			{
				if (g_SlideViewsArray[i]==1) 
				{ 
					g_strSlideViewData += ","+i; 
				}  
			}
			g_strSlideViewData += "|lastviewedslide=" + g_SlideLastViewed;

			// Save our state data
			SaveStateData();

			break;

		
		case "ART_setLessonCompletionInfo":
			g_LessonCompletionMethod = arrArgs[0];
			g_LessonCompletionThreshold = arrArgs[1];
			g_LessonCompletionTargetSlide = arrArgs[2];
			g_TotalSlides = arrArgs[3];
			g_strPassed = arrArgs[4];
			g_strFailed = arrArgs[5];
			break;

		case "ART_cmiSetLessonStatusAndScores":
			// Retrieve the data 
			g_Status = normalizeStatus(arrArgs[0]);
			g_Score = arrArgs[1];
			g_MinScore = arrArgs[2];
			g_MaxScore = arrArgs[3];
			g_MasteryScore = arrArgs[4];	

			SetStatus(g_Status);
			lmsAPI.SetScore(g_Score, g_MaxScore, g_MinScore);

			// This is an important milestone, save the data
			lmsAPI.CommitData();
					
			break;

		case "CC_ClosePlayer":
		case "ART_CloseAndExit":
			// This is an important milestone, save the data
			lmsAPI.CommitData();

			lmsAPI.ConcedeControl()

			break;

		case "ART_cmiSendInteractionInfo":
		case "MM_cmiSendInteractionInfo":
			RecordInteractions(arrArgs);	

			// This is an important milestone, save the data
			// lmsAPI.CommitData();

			break;
	}
}

setInterval("ForceCommit()", 600000);

if (g_bAPIPresent)
{
	SetStatus("incomplete");
	if (IE6)
	{
		setTimeout("ForceCommit()", 5000);
	}
	else
	{
		lmsAPI.CommitData();
	}
}