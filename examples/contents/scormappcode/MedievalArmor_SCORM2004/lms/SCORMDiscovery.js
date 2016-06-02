
/*
ScanParentsForApi
-Searches all the parents of a given window until
 it finds an object named "API". If an
 object of that name is found, a reference to it
 is returned. Otherwise, this function returns null.
*/
function SCORM_ScanParentsForApi(win) 
{ 

	WriteToDebug("In SCORM_ScanParentsForApi, win=" + win.location);
	
	/*
	Establish an outrageously high maximum number of
	parent windows that we are will to search as a
	safe guard against an infinite loop. This is 
	probably not strictly necessary, but different 
	browsers can do funny things with undefined objects.
	*/
	var MAX_PARENTS_TO_SEARCH = 500; 
	var nParentsSearched = 0;
	
	/*
	Search each parent window until we either:
		 -find the API, 
		 -encounter a window with no parent (parent is null 
				or the same as the current window)
		 -or, have reached our maximum nesting threshold
	*/
	while ( (win.API == null) && 
			(win.parent != null) && (win.parent != win) && 
			(nParentsSearched <= MAX_PARENTS_TO_SEARCH) 
		  )
	{ 
				
		nParentsSearched++; 
		win = win.parent;
	} 
	
	/*
	If the API doesn't exist in the window we stopped looping on, 
	then this will return null.
	*/
	return win.API; 
} 

function SCORM2004_ScanParentsForApi(win) 
{ 

	/*
	Establish an outrageously high maximum number of
	parent windows that we are will to search as a
	safe guard against an infinite loop. This is 
	probably not strictly necessary, but different 
	browsers can do funny things with undefined objects.
	*/
	var MAX_PARENTS_TO_SEARCH = 500; 
	var nParentsSearched = 0;
	
	/*
	Search each parent window until we either:
		 -find the API, 
		 -encounter a window with no parent (parent is null 
				or the same as the current window)
		 -or, have reached our maximum nesting threshold
	*/
	while ( (win.API_1484_11 == null) && 
			(win.parent != null) && (win.parent != win) && 
			(nParentsSearched <= MAX_PARENTS_TO_SEARCH) 
		  )
	{ 
				
		nParentsSearched++; 
		win = win.parent;
	} 
	
	/*
	If the API doesn't exist in the window we stopped looping on, 
	then this will return null.
	*/
	return win.API_1484_11; 
} 



var debugInfo = "";
function WriteToDebug(str){
	debugInfo += str + "\r\n";
}


 
WriteToDebug("Looking for SCORM APIs to act as relays");

//these objects provide a relay to the actual LMS API objects used by the content when there is an extra launcher window
var API = null; 
var API_1484_11 = null; 

//look for the SCORM 1.2 API first

//Search all the parents of the current window if there are any
if ((window.parent != null) && (window.parent != window)) 
{ 
	WriteToDebug("SCORM_GetAPI, searching parent for 1.2");
	API = SCORM_ScanParentsForApi(window.parent); 
} 

/*
If we didn't find the API in this window's chain of parents, 
then search all the parents of the opener window if there is one
*/
if ((API == null) && (window.top.opener != null))
{ 
	WriteToDebug("SCORM_GetAPI, searching opener for 1.2");
	API = SCORM_ScanParentsForApi(window.top.opener); 
} 


//then look for the SCORM 2004 API

//Search all the parents of the current window if there are any
if ((window.parent != null) && (window.parent != window)) 
{ 
	WriteToDebug("SCORM_GetAPI, searching parent for 2004");
	API = SCORM2004_ScanParentsForApi(window.parent); 
} 

/*
If we didn't find the API in this window's chain of parents, 
then search all the parents of the opener window if there is one
*/
if ((API == null) && (window.top.opener != null))
{ 
	WriteToDebug("SCORM_GetAPI, searching opener for 2004");
	API = SCORM2004_ScanParentsForApi(window.top.opener); 
} 