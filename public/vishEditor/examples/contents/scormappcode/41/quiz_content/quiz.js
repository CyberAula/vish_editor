/********************************************************/
// Chico.js
/********************************************************/

// Results Screen vars
var g_strPlayer = "chico";
var g_arrResults = new Array();
var g_oQuizResults = new Object();
g_oQuizResults.oOptions = new Object();

// Browser Sniffing
var IE =  ((document.all)&&(navigator.appVersion.indexOf("MSIE")!=-1))    ? true : false;
var IE6 = ((document.all)&&(navigator.appVersion.indexOf("MSIE 6.")!=-1)) ? true : false;

var FF = (navigator.userAgent.indexOf("Firefox")!=-1) ? true : false;
var Opera = (navigator.userAgent.indexOf("Opera")!=-1) ? true : false;
var IESP2 = ((window.navigator.userAgent.indexOf("MSIE")) && window.navigator.userAgent.indexOf("SV1") > window.navigator.userAgent.indexOf("MSIE"));

var Safari3 =  (navigator.appVersion.indexOf("Safari") && navigator.appVersion.indexOf("Version/3"));

var NS6plus = (parseFloat(navigator.appVersion) >= 5 && navigator.appName.indexOf("Netscape")>=0 )? true: false;
var NS7_2Plus = false;
var Mozilla1_7Plus = false;

var g_bLMSPresent = false;

// Message Delimitors
var g_strDelim = "|~|";
var g_strInteractionDelim = "|#|";

// Find the version of NS or Mozilla
if (NS6plus)
{
	var nPos = 0;
	var strUserAgent = navigator.userAgent;
	var nReleaseDate = 0;
	
	strUserAgent = strUserAgent.toLowerCase();
	nPos = strUserAgent.indexOf("gecko/");

	if(nPos >= 0)
	{
		var strTemp = strUserAgent.substr(nPos + 6);
		nReleaseDate = parseFloat(strTemp);
	}

	if (strUserAgent.indexOf("netscape") >= 0)
	{
		if (nReleaseDate >= 20040804)
		{
			NS7_2Plus = true;
		} 
	}
	else
	{
		if (nReleaseDate >= 20040616)
		{
			Mozilla1_7Plus = true;
		} 		
	}
}

// Operating System Detection
var isLinux = (navigator.userAgent.indexOf("Linux") != -1);
var isWindows = (!isMac && !isLinux)
var isMac = (navigator.appVersion.indexOf("Mac")!=-1) ? true : false;

var g_bUseFSCommand = (!Opera && !isLinux && !isMac);

// LMS Support
if (g_bLMS)
{
	document.write("<SCR" + "IPT LANGUAGE='JavaScript1.2' SRC='lms/lms.js' TYPE='text/javascript'><\/SCR" + "IPT>");
}

if (g_bAOSupport)
{
	document.write("<SCR" + "IPT LANGUAGE='JavaScript1.2' SRC='" + g_strContentFolder + "/AOComm.js' TYPE='text/javascript'><\/SCR" + "IPT>");
}

function WriteSwfObject(strSwfFile, nWidth, nHeight, strScale, strAlign, strQuality, strBgColor, bCaptureRC, strFlashVars)
{
	var strHtml = "";
	var strWMode = "Window";
	
	if (strScale == "show all")
	{
		nWidth = "100%";
		nHeight = "100%";
	}

	// Lets the player know the html container is there
	if (strFlashVars == "")
	{
		strFlashVars += "vHtmlContainer=true";
	}
	else
	{
		strFlashVars += "&vHtmlContainer=true";
	}
	
	if (bCaptureRC)
	{
		strFlashVars += "&vCaptureRC=true";
		strWMode = "Opaque";
	}
	
	// Are we loaded in IE
	var bDelim = IE;
	if (!IE)
	{
		if (navigator.plugins["Shockwave Flash"]) 
		{
			var arrTemp = navigator.plugins["Shockwave Flash"].description.split(" ");
			var arrVersion = arrTemp[2].split(".");			
			if (parseInt(arrVersion[0]) >= 10 && parseInt(arrVersion[1]) >= 2)
			{
				bDelim = true;
			}
		}
	}
	strFlashVars += "&vIE=" + bDelim;
		
	// Does the browser support FSCommand
	strFlashVars += "&vUseFSCommand=" + g_bUseFSCommand;
	
	// Whether or not we are loaded by an LMS
	strFlashVars += "&vLMSPresent=" + g_bLMSPresent;
	
	// Whether or not we are loaded by AO
	strFlashVars += "&vAOSupport=" + g_bAOSupport;
	
	// The saved resume data
	if (g_bLMSPresent)
	{
		var strResumeData = lmsAPI.GetDataChunk();

		strFlashVars += "&vResumeData=" + encodeURI(strResumeData);
	}
	
	var strLocProtocol = location.protocol;
	
	if (strLocProtocol.indexOf("file") >= 0)
	{
		strLocProtocol = "http:";
	}	

	strHtml += "<div style='width:" + nWidth + "; height:" + nHeight + ";' id='fc'>";
	strHtml += "<object classid='clsid:d27cdb6e-ae6d-11cf-96b8-444553540000' codebase='" + strLocProtocol + "//fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,79,0' width='" + nWidth + "' height='" + nHeight + "' align='" + strAlign + "' name='player' id='player'>";
	strHtml += "<param name='scale' value='" + strScale + "' />";
	strHtml += "<param name='movie' value='" + strSwfFile + "' />";
	strHtml += "<param name='quality' value='" + strQuality + "' />";
	strHtml += "<param name='bgcolor' value='" + strBgColor + "' />";
	strHtml += "<param name='flashvars' value='" + strFlashVars + "' />";
	strHtml += "<param name='wmode' value='" + strWMode + "'/>";
	strHtml += "<embed id='eplayer' name='eplayer' wmode='" + strWMode + "' src='" + strSwfFile +"' flashvars='" + strFlashVars + "' scale='" + strScale + "' quality='" + strQuality + "' bgcolor='" + strBgColor + "' width='" + nWidth + "' height='" + nHeight + "' align='" + strAlign + "' swLiveConnect='true' type='application/x-shockwave-flash' pluginspage='" + strLocProtocol + "//www.macromedia.com/go/getflashplayer' />";
	strHtml += "</object>";
	strHtml += "</div>";

	document.write(strHtml);
}

function CloseWindow()
{
	top.window.close();
}

function player_DoJSCommand(command, args)
{
	var strCommand = command;
	var strArgs = ReplaceAll(args, "|$|", "%");
	
	player_DoFSCommand(strCommand, strArgs) 
}

function ReplaceAll(strTarget, strChar, strNew)
{
	var arrRemoved = strTarget.split(strChar);
	
	return arrRemoved.join(strNew);
}

var g_wndLast;

function eplayer_DoFSCommand(command, args)
{
	player_DoFSCommand(command, args);
}

function player_DoFSCommand(command, args) 
{
	args = String(args);
	command = String(command);

	var arrArgs = args.split(g_strDelim);

	switch (command)
	{
		case "CC_Restore_Focus":
			var bFocus = true;
			if (g_wndLast)
			{
				try
				{
					if (g_wndLast.document.hasFocus)
					{ 
						bFocus = !g_wndLast.document.hasFocus();
					}
				}
				catch (e)
				{
					bFocus = false;
				}
			}
			
			if (bFocus)
			{
				player.focus();
			}
			break;
		case "ART_DebugLms":
			lmsAPI.ShowDebugWindow();
			break;
			
		case "CC_SetInteractionDelim":
			g_strInteractionDelim = args;
			break;
			
		case "CC_SetDelim":
			g_strDelim = args;
			break;
			
		case "CC_ZoomImage":
			PopZoomImage(arrArgs[0], arrArgs[1], arrArgs[2], arrArgs[3], arrArgs[4], arrArgs[5], arrArgs[6], arrArgs[7], arrArgs[8], arrArgs[9]);
			break;
			
		case "CC_StoreQuestionResult":		
			StoreQuestionResult(parseFloat(arrArgs[0]), arrArgs[1], arrArgs[2], arrArgs[3], arrArgs[4] ,arrArgs[5], arrArgs[6], arrArgs[7], arrArgs[8], arrArgs[9]);
			break;
			
		case "CC_StoreQuizResult":		
			g_oQuizResults.dtmFinished = new Date();
			g_oQuizResults.strResult = arrArgs[0];
			g_oQuizResults.strScore = arrArgs[1];
			g_oQuizResults.strPassingScore = arrArgs[2];
			g_oQuizResults.strMinScore = arrArgs[3];
			g_oQuizResults.strMaxScore = arrArgs[4];
			g_oQuizResults.strPtScore = arrArgs[5];
			g_oQuizResults.strPtMax = arrArgs[6];
			g_oQuizResults.strTitle = arrArgs[7];			
			break;
			
		case "CC_PrintResults":
			g_oQuizResults.oOptions.bShowUserScore = (arrArgs[0] == "true");
			g_oQuizResults.oOptions.bShowPassingScore = (arrArgs[1] == "true");
			g_oQuizResults.oOptions.bShowShowPassFail = (arrArgs[2] == "true");
			g_oQuizResults.oOptions.bShowQuizReview = (arrArgs[3] == "true");
			g_oQuizResults.oOptions.strResult = arrArgs[4];
			g_oQuizResults.oOptions.strName = arrArgs[5];
			g_wndLast = window.open(GetBasePath() + g_strContentFolder + "/report.html", "Reports")
			break;
			
		case "CC_EmailResults":
			g_oQuizResults.oOptions.bShowUserScore = (arrArgs[0] == "true");
			g_oQuizResults.oOptions.bShowPassingScore = (arrArgs[1] == "true");
			g_oQuizResults.oOptions.bShowShowPassFail = (arrArgs[2] == "true");
			g_oQuizResults.oOptions.bShowQuizReview = (arrArgs[3] == "true");
			g_oQuizResults.oOptions.strResult = arrArgs[4];
			g_oQuizResults.oOptions.strName = arrArgs[5];

			EmailResults(arrArgs[6]);
			break;
			
		case "CC_OpenUrl":
			OpenUrl(arrArgs[0], arrArgs[1], arrArgs[2], arrArgs[3], arrArgs[4], arrArgs[5], arrArgs[6], arrArgs[7], 
					  arrArgs[8], arrArgs[9], arrArgs[10], arrArgs[11], arrArgs[12], arrArgs[13]);
			break;
			
		case "CC_OpenVideo":
			OpenVideo(arrArgs[0], arrArgs[1], arrArgs[2], arrArgs[3], arrArgs[4], arrArgs[5], arrArgs[6], arrArgs[7], 
					  arrArgs[8], arrArgs[9], arrArgs[10], arrArgs[11], arrArgs[12], arrArgs[13]);
			break;
			
		case "CC_ClosePlayer":
			if (!g_bLMS)
			{
				if (FF)
				{
					setTimeout("CloseWindow()", 100);
				}
				else
				{
					CloseWindow();
				}
			}
			break;
			
		default:
			// alert(command);
			break;
	}
	
	if (g_bLMS)
	{
		lms_DoFSCommand(command, args);
	}
	
	if (g_bAOSupport)
	{
		AO_DoFSCommand(command, args)
	}
}

////////////////////////////////////////////////////////////////////////////////
// Print Results methods
////////////////////////////////////////////////////////////////////////////////

function QuestionResult(nQuestionNum, strQuestion, strResult, strCorrectResponse, strStudentResponse, nPoints, strInteractionId, strObjectiveId, strType, strLatency)
{
	if (nPoints < 0)
	{
		nPoints = 0;
	}
	if (strCorrectResponse == "")
	{
		strCorrectResponse = "&nbsp;";
	}

	this.nQuestionNum = nQuestionNum
	this.strQuestion = strQuestion;
	this.strCorrectResponse = strCorrectResponse;
	this.strStudentResponse = strStudentResponse;
	this.strResult = strResult;
	this.nPoints = nPoints;
	this.bFound = false;
	this.dtmFinished = new Date();
	this.strInteractionId = strInteractionId;
	this.strObjectiveId = strObjectiveId;
	this.strType = strType;
	this.strLatency = strLatency;
}

function StoreQuestionResult(nQuestionNum, strQuestion, strResult, strCorrectResponse, strStudentResponse, nPoints, strInteractionId, strObjectiveId, strType, strLatency)
{

	var oQuestionResult = new QuestionResult(nQuestionNum, strQuestion, strResult, strCorrectResponse, strStudentResponse, nPoints, strInteractionId, strObjectiveId, strType, strLatency);
	var nIndex = g_arrResults.length;

	// Lets see if we have answered the question before

	for (var i = 0; i < g_arrResults.length; i++)
	{
		if (g_arrResults[i].nQuestionNum == oQuestionResult.nQuestionNum && strQuestion == g_arrResults[i].strQuestion)
		{
			nIndex = i;
			break;
		}
	}

	g_arrResults[nIndex] = oQuestionResult;

}

////////////////////////////////////////////////////////////////////////////////
// Gets the base path
////////////////////////////////////////////////////////////////////////////////

function GetBasePath()
{
	var strFullPath = document.location.href;
	var nPosHash = strFullPath.indexOf("#");
	if (nPosHash > 0)
	{
		strFullPath = strFullPath.substring(0, nPosHash);
	}
	var nPos1 = -1;
	var nPos2 = -1;

	nPos1 = strFullPath.lastIndexOf("\\");
	nPos2 = strFullPath.lastIndexOf("/");

	if (nPos2 > nPos1)
	{
		nPos1 = nPos2;
	}

	if (nPos1 >= 0)
	{
		strFullPath = strFullPath.substring(0, nPos1 + 1);
	}

	return(strFullPath);
}

////////////////////////////////////////////////////////////////////////////////
// Email Results
////////////////////////////////////////////////////////////////////////////////

function EmailResults(strAddress)
{
	if (!g_oQuizResults.strTitle)
	{
		g_oQuizResults.strTitle = "";
	}
	
	var g_strSubject = "Quiz Results: " + g_oQuizResults.strTitle;
	var strQuizResults = "";
	var strMainHeader = " " + g_oQuizResults.strTitle + "\nStatus, Raw Score, Passing Score, Max Score, Min Score, Time\n";
	var strLineHeader = "\n\nDate, Time, Score, Interaction ID, Objective Id, Interaction Type, Student Response, Result, Weight, Latency\n";
	var strMainData = "\n";
	var strLineData = "\n";
		
	// Status
	strMainData += g_oQuizResults.strResult + ",";
	
	// Score
	// strMainData += g_oQuizResults.strScore + ",";
	
	// Raw Score
	strMainData += g_oQuizResults.strPtScore + ",";
	
	// Passing Score
	strMainData += Math.round((g_oQuizResults.strPassingScore/100) * g_oQuizResults.strPtMax) + ",";
	
	// Max Score
	strMainData += g_oQuizResults.strPtMax + ",";
	
	// Min Score
	strMainData += 0 + ",";
	
	// Time
	strMainData += GetTime(g_oQuizResults.dtmFinished);
	
	for (var i = 0; i < g_arrResults.length; i++)
	{
		//Date
		strLineData += GetDate(g_arrResults[i].dtmFinished) + ",";
		
		// Time
		strLineData += GetTime(g_arrResults[i].dtmFinished) + ",";
		
		// Score
		strLineData += g_arrResults[i].nPoints + ",";
		
		// Interaction Id
		strLineData += g_arrResults[i].strInteractionId + ",";
		
		// Objective Id
		strLineData += g_arrResults[i].strObjectiveId + ",";

		// Interaction Type
		strLineData += g_arrResults[i].strType + ",";

		// Student Response
		var strResponse = g_arrResults[i].strStudentResponse;
		strResponse = ReplaceAll(strResponse, "'", "%27");
		strLineData += strResponse + ",";
		
		// Result
		strLineData += g_arrResults[i].strResult + ",";
		
		// Weight
		strLineData += "1,";
		
		// Latency
		strLineData += g_arrResults[i].strLatency;
		
		strLineData += "\n";
	}
	
	strQuizResults = strMainHeader + strMainData + strLineHeader + strLineData;

	var sHTML = "";
	sHTML += '<FORM id="formQuiz" method="POST" action="mailto:' + strAddress + '?subject=' + g_strSubject + '" enctype="text/plain">';
	sHTML += '<INPUT TYPE="hidden" NAME="Quiz Results" VALUE=\'' + strQuizResults + '\'>';
	sHTML += '<br><input type="submit"><br>';
	sHTML += '</FORM>';
	document.getElementById("divEmail").innerHTML = sHTML;
	document.getElementById("formQuiz").submit();
}

////////////////////////////////////////////////////////////////////////////////
// Get Time
////////////////////////////////////////////////////////////////////////////////
function GetTime(dtmDate)
{
	var strResult = "";
	var nHours = dtmDate.getHours();
	var strAM = "am";
	var nMinutes = dtmDate.getMinutes();
	var strMinutes = "" + nMinutes;
	var nSeconds = dtmDate.getSeconds();
	var strSeconds = "" + nSeconds;

	if (nMinutes < 10)
	{
		strMinutes = "0" + nMinutes;
	}
	
	if (nSeconds < 10)
	{
		strSeconds = "0" + nSeconds;
	}
	

	strResult = nHours + ":" + strMinutes + ":" + strSeconds;

	return strResult;
}

function GetDate(dtmDate)
{
	var strResult = "";


	strResult = (dtmDate.getMonth() + 1) + "/" + dtmDate.getDate() + "/" + dtmDate.getFullYear();

	return strResult;
}

////////////////////////////////////////////////////////////////////////////////
// Browser Resize
////////////////////////////////////////////////////////////////////////////////
var g_nWindowWidth = 0;
var g_nWindowHeight = 0;
var g_nSizeInterval = null;
var g_nIntervalCount = 0;

function ResizeBrowser(strBrowserSize)
{
	switch (strBrowserSize)
	{
		case "fullscreen":
			ResizeFullScreen();
			break;
		case "optimal":
			ResizeOptimal();
			break;
	}
}

function ResizeFullScreen()
{
	top.moveTo(0, 0);
	top.window.resizeTo(screen.availWidth, screen.availHeight);
}


function ResizeOptimal()
{
	var nFrameWidth = 0;
	var nFrameHeight = 0;
	var nXPos = GetXPos();
	var nYPos = GetYPos();
	var bMove = false;
	
	g_nWindowWidth = g_nWidth + 30;
	g_nWindowHeight = g_nHeight + 30;
	
	if (screen.availWidth > g_nWindowWidth && screen.availHeight > g_nWindowHeight)
	{
		if (GetContentWidth() != g_nWidth || GetContentHeight() != g_nHeight)
		{
			// First we need to reposition the browser so that it can actually grow to the appropiate size.  
			// When positioning, we will overestimate the browser height by 160 if possible to accomadate the toolbar and statusbar
			if (nXPos + g_nWindowWidth > screen.availWidth)
			{
				bMove = true;
				nXPos = screen.availWidth - g_nWindowWidth - 5;
			}
			
			if (nYPos + g_nWindowHeight + 160 > screen.availHeight)
			{
				bMove = true;
				nYPos = screen.availHeight - g_nWindowHeight - 165;
			}
			
			if (nXPos < 0)
			{
				nXPos = 0;
			}
			if (nYPos < 0)
			{
				nYPos = 0;
			}
			
			if (bMove)
			{
				top.window.moveTo(nXPos, nYPos);
			}
			
			// Resize the window so we know what the actual size is
			top.window.resizeTo(g_nWindowWidth, g_nWindowHeight);
			
			// Since we know the actual browser size, and we can query the cliet dim, lets get the frame dim
			nFrameWidth = (g_nWindowWidth) - GetContentWidth();
			nFrameHeight = (g_nWindowHeight) - GetContentHeight();
			
			// Not lets resize it to the correct size
			g_nWindowWidth = g_nWidth + nFrameWidth;
			g_nWindowHeight = g_nHeight + nFrameHeight;
			
			top.window.resizeTo(g_nWindowWidth, g_nWindowHeight);
			
			if (IE)
			{
				// ok,  sometimes there is a third party toolbar that doesn't load until after we have finish resizing everything, so we will do a check for this (this only seems to effect IE, FF behaves correctly)
				g_nSizeInterval = setInterval(CheckSize, 500);
			}			
		}
	}
	else
	{
		// If the screen isn't big enough, we are bailing and defaulting to Full Screen
		ResizeFullScreen();
	}
}

function CheckSize()
{
	var nContentWidth = GetContentWidth();
	var nContentHeight = GetContentHeight();
	var nFrameWidth = 0;
	var nFrameHeight = 0;
	
	g_nIntervalCount++;
	
	if (nContentWidth != g_nWidth || nContentHeight != g_nHeight)
	{
		nFrameWidth = g_nWindowWidth - nContentWidth;
		nFrameHeight = g_nWindowHeight - nContentHeight;

		g_nWindowWidth = g_nWidth + nFrameWidth;
		g_nWindowHeight = g_nHeight + nFrameHeight;
		
		top.window.resizeTo(g_nWindowWidth, g_nWindowHeight);
		clearInterval(g_nSizeInterval);
	}
	
	if (g_nIntervalCount > 4)
	{
		clearInterval(g_nSizeInterval);
	}
}

function GetContentWidth()
{
	var nResult = 0;
	
	if (IE || Safari3)
	{
		nResult = document.body.clientWidth;
	}
	else
	{
		nResult = window.innerWidth;
	}
	
	return nResult;
}

function GetContentHeight()
{
	var nResult = 0;

	if (IE || Safari3)
	{
		nResult = nContentHeight = document.body.clientHeight;
	}
	else
	{
		nResult = nContentHeight = window.innerHeight;
	}
	
	return nResult
}

function GetXPos()
{
	var nResult = 0;
	
	if (IE)
	{
		nResult = window.screenLeft;
	}
	else
	{
		nResult = window.screenX;
	}
	
	return nResult;
}

function GetYPos()
{
	var nResult = 0;
	
	if (IE)
	{
		nResult = window.screenTop;
	}
	else
	{
		nResult = window.screenX;
	}
	
	return nResult;
}

////////////////////////////////////////////////////////////////////////////////
// Open Url
////////////////////////////////////////////////////////////////////////////////
function OpenUrl(strUrl, strWindow, strWindowSize, strWidth, strHeight, strUseDefaultControls, strStatus, strToolbar, strLocation, strMenubar, strScrollbars, strResizable)
{

	var nWndWidth = parseInt(strWidth);
	var nWndHeight = parseInt(strHeight);
	var bUseDefaultSize = (strWindowSize.toLowerCase() == "default");
	var bUseDefaultControls = (strUseDefaultControls.toLowerCase() == "true");
	var bFullScreen = (strWindowSize.toLowerCase() == "fullscreen");
	
	strUrl = ReplaceAll(strUrl, "%25", "?");

	if (bFullScreen)
	{
		nWndWidth = screen.availWidth;
		nWndHeight = screen.availHeight;
	}
	else
	{
		if (nWndWidth > screen.availWidth)
		{
			nWndWidth = screen.availWidth;
		}

		if (nWndHeight > screen.availHeight)
		{
			nWndHeight = screen.availHeight;
		}
	}


	var strOptions = "";
	if (!bUseDefaultControls)
	{
		if (!bUseDefaultSize)
		{
			strOptions += "width=" + nWndWidth + ", ";
			strOptions += "height=" + nWndHeight + ", ";
		}

		strOptions += "status=" + ((strStatus.toLowerCase() == "true") ? 1 : 0);
		strOptions += ", toolbar=" + ((strToolbar.toLowerCase() == "true") ? 1 : 0);
		strOptions += ", location=" + ((strLocation.toLowerCase() == "true") ? 1 : 0);
		strOptions += ", menubar=" + ((strMenubar.toLowerCase() == "true") ? 1 : 0);
		strOptions += ", scrollbars=" + ((strScrollbars.toLowerCase() == "true") ? 1 : 0);
		strOptions += ", resizable=" + ((strResizable.toLowerCase() == "true") ? 1 : 0);
	}


	var oNewWnd;
	
	if (bUseDefaultSize && bUseDefaultControls)
	{
		g_wndLast = window.open(strUrl, strWindow);
	}
	else if (bUseDefaultControls)
	{
		if (IE)
		{
			try
			{
				oNewWnd = window.open(GetBasePath() + g_strContentFolder + "/blank.html", strWindow);
				
				if (bFullScreen)
				{
					oNewWnd.moveTo(0, 0);
				}
				
				oNewWnd.resizeTo(nWndWidth, nWndHeight);
				oNewWnd.document.location = strUrl;
			}
			catch (e) {};
		}
		else
		{
			oNewWnd = window.open(strUrl, strWindow);
			oNewWnd.resizeTo(nWndWidth, nWndHeight);
		}
		
		g_wndLast = oNewWnd;
	}
	else
	{
		try
		{
			oNewWnd = window.open(strUrl, strWindow, strOptions);
			g_wndLast = oNewWnd;
		}
		catch (e) {}
	}
	
	if (bFullScreen && !(bUseDefaultControls && IE))
	{
		try
		{
			oNewWnd.moveTo(0, 0);
		}
		catch (e) {};
	}
	
}


////////////////////////////////////////////////////////////////////////////////
// Video
////////////////////////////////////////////////////////////////////////////////
function OpenVideo(strUrl, strWndWidth, strWndHeight, strVidWidth, strVidHeight, strDuration, strPlaybar, strAutoPlay,
						   strStatus, strToolbar, strLocation, strMenubar, strScrollbars, strResizable)
{
	var nWndWidth = parseInt(strWndWidth);
	var nWndHeight = parseInt(strWndHeight);
	
	var strSearch = "exUrl=" + strUrl + 
					"&exWndWidth=" + strWndWidth +
					"&exWndHeight=" + strWndHeight +
					"&exWidth=" + strVidWidth + 
					"&exHeight=" + strVidHeight + 
					"&exDuration=" + strDuration + 
					"&exPlaybar=" + strPlaybar + 
					"&exAutoPlay=" + strAutoPlay;

	if (nWndWidth > screen.availWidth)
	{
		nWndWidth = screen.availWidth;
	}

	if (nWndHeight > screen.availHeight)
	{
		nWndHeight = screen.availHeight;
	}


	var strOptions = "";
	strOptions += "width=" + nWndWidth;
	strOptions += ", height=" + nWndHeight;
	strOptions += ", status=" + ((strStatus.toLowerCase() == "true") ? 1 : 0);
	strOptions += ", toolbar=" + ((strToolbar.toLowerCase() == "true") ? 1 : 0);
	strOptions += ", location=" + ((strLocation.toLowerCase() == "true") ? 1 : 0);
	strOptions += ", menubar=" + ((strMenubar.toLowerCase() == "true") ? 1 : 0);
	strOptions += ", scrollbars=" + ((strScrollbars.toLowerCase() == "true") ? 1 : 0);
	strOptions += ", resizable=" + ((strResizable.toLowerCase() == "true") ? 1 : 0);

	if (g_wndZoom)
	{
		try
		{
			g_wndZoom.close()
		}
		catch (e)
		{
		}
	}

	var nXPos = 0;
	var nYPos = 0;
	var nWidth = screen.availWidth;
	var nHeight = screen.availHeight;
	
	if (window.screenX != undefined) 
	{
		nXPos = window.screenX;
		nYPos = window.screenY;
		nWidth = window.innerWidth;
		nHeight = window.innerHeight;		
	}
	else if (window.screenLeft != undefined)
	{
		nXPos = window.screenLeft;
		nYPos = window.screenTop;
		nWidth = document.body.offsetWidth;
		nHeight = document.body.offsetHeight;
	}
	
	strOptions += ", left=" + (nXPos + (nWidth - nWndWidth)/2);
	strOptions += ", screenX=" + (nXPos + (nWidth - nWndWidth)/2);
	strOptions += ", top=" + (nYPos + (nHeight - nWndHeight)/2);
	strOptions += ", screenY=" + (nYPos + (nHeight - nWndHeight)/2);

	g_wndZoom = window.open(GetBasePath() + g_strContentFolder + "/VideoPlayer.html?" + strSearch, "Video", strOptions);
	g_wndLast = g_wndZoom;
}

////////////////////////////////////////////////////////////////////////////////
// Zoom
////////////////////////////////////////////////////////////////////////////////

var g_oZoomInfo = new Object();
var g_wndZoom;

function PopZoomImage(strFileName, nWidth, nHeight, strStatus, strToolbar, strLocation, strMenubar, strScrollbars, strResizable)
{
	var strScroll = "0";
	g_oZoomInfo.strContentFolder = g_strContentFolder;
	g_oZoomInfo.strFileName = strFileName;
	g_oZoomInfo.nWidth = parseInt(nWidth);
	g_oZoomInfo.nHeight = parseInt(nHeight);

	if (g_oZoomInfo.nWidth > screen.availWidth)
	{
		g_oZoomInfo.nWidth = screen.availWidth;
		strScroll = "1";
	}

	if (g_oZoomInfo.nHeight > screen.availHeight)
	{
		g_oZoomInfo.nHeight = screen.availHeight;
		strScroll = "1";
	}

	var strOptions = "";
	strOptions += "width=" + g_oZoomInfo.nWidth;
	strOptions += ", height=" + g_oZoomInfo.nHeight;
	strOptions += ", status=" + ((strStatus.toLowerCase() == "true") ? 1 : 0);
	strOptions += ", toolbar=" + ((strToolbar.toLowerCase() == "true") ? 1 : 0);
	strOptions += ", location=" + ((strLocation.toLowerCase() == "true") ? 1 : 0);
	strOptions += ", menubar=" + ((strMenubar.toLowerCase() == "true") ? 1 : 0);
	strOptions += ", scrollbars=" + ((strScrollbars.toLowerCase() == "true") ? 1 : 0);
	strOptions += ", resizable=" + ((strResizable.toLowerCase() == "true") ? 1 : 0);

	if (g_wndZoom)
	{
		try
		{
			g_wndZoom.close()
		}
		catch (e)
		{
		}
	}

	g_wndZoom = window.open(GetBasePath() + g_strContentFolder + "/zoom.html", "Zoom", strOptions);
	g_wndLast = g_wndZoom;
}

var g_bCloseExecuted = false;
function DoOnClose()
{
	if (!g_bCloseExecuted)
	{
		g_bCloseExecuted = true;
		
		if (g_bAOSupport)
		{
			PostResultsOnUnload()
		}
	}
}

