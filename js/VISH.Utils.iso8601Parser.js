//////////////
// iso8601 parser
//////////////

/*
* Provided by https://github.com/nezasa/iso8601-js-period/blob/master/iso8601.js
* Shared and maintained by [Nezasa](http://www.nezasa.com)
* Published under [Apache 2.0 license](http://www.apache.org/licenses/LICENSE-2.0.html)
* © Nezasa, 2012-2013
*
* Javascript library for parsing of ISO 8601 durations. Supported are durations of
* the form P3Y6M4DT12H30M17S or PT1S or P1Y4DT1H3S etc.
*
* @author Nezasa AG -- https://github.com/nezasa
* @contributor Jason "Palamedes" Ellis -- https://github.com/palamedes
*/

VISH.Utils.iso8601Parser = (function(V,$,undefined){

	var multiplicators = [ 31104000,2592000,604800,86400,3600,60,1];
	/*
	var multiplicators = [year (360*24*60*60),month (30*24*60*60),
	week (24*60*60*7),day (24*60*60),hour (60*60),minute (60),second (1)];
	*/


	var getDurationFromISO = function(period){
		var durationPerUnit = getDurationFromISOPerUnit(period,true);
		if(durationPerUnit){
			var durationInSeconds = 0;
			var dL = durationPerUnit.length;
			for (var i = 0; i < dL; i++) {
				durationInSeconds += durationPerUnit[i] * multiplicators[i];
			}
			return durationInSeconds;
		}
		
		return null;
	};

	var getDurationFromISOPerUnit = function(period,distributeOverflow){
		var distributeOverflow = (typeof distributeOverflow == "boolean") ? distributeOverflow : false;
		try {
			var durationPerUnit = _parsePeriodString(period,distributeOverflow);
		} catch (e){
			return null;
		}
		return durationPerUnit;
	};

   /**
	* Parses a ISO8601 period string.
	* @param period iso8601 period string
	* @param _distributeOverflow if 'true', the unit overflows are merge into the next higher units.
	*/
	function _parsePeriodString(period, _distributeOverflow){

		var distributeOverflow = (_distributeOverflow) ? _distributeOverflow : false;
		var valueIndexes = [2, 3, 4, 5, 7, 8, 9];
		var duration = [0, 0, 0, 0, 0, 0, 0];
		var overflowLimits = [0, 12, 4, 7, 24, 60, 60];
		var struct;

		// upcase the string just in case people don't follow the letter of the law
		period = period.toUpperCase();

		// input validation
		if (!period) {
			return duration;
		} else if (typeof period !== "string"){
			throw new Error("Invalid iso8601 period string '" + period + "'");
		} 

		// parse the string
		if (struct = /^P((\d+Y)?(\d+M)?(\d+W)?(\d+D)?)?(T(\d+H)?(\d+M)?(\d+S)?)?$/.exec(period)) {
			// remove letters, replace by 0 if not defined
			for (var i = 0; i < valueIndexes.length; i++) {
				var structIndex = valueIndexes[i];
				duration[i] = struct[structIndex] ? +struct[structIndex].replace(/[A-Za-z]+/g, '') : 0;
			}
		} else {
			throw new Error("String '" + period + "' is not a valid ISO8601 period.");
		}

		if (distributeOverflow) {
			// note: stop at 1 to ignore overflow of years
			for (var i = duration.length - 1; i > 0; i--) {
				if (duration[i] >= overflowLimits[i]) {
					duration[i-1] = duration[i-1] + Math.floor(duration[i]/overflowLimits[i]);
					duration[i] = duration[i] % overflowLimits[i];
				}
			}
		}

		return duration;
	};


	var getISODurationFromSecs = function(n,bPrecise){
		//From centisecs to secs
		n = n*100;

		/* Note: SCORM and IEEE 1484.11.1 require centisec precision
		 Parameters:
		 n = number of centiseconds
		 bPrecise = optional parameter; if true, duration will
		 be expressed without using year and/or month fields.
		 If bPrecise is not true, and the duration is long,
		 months are calculated by approximation based on average number
		 of days over 4 years (365*4+1), not counting the extra days
		 for leap years. If a reference date was available,
		 the calculation could be more precise, but becomes complex,
		 since the exact result depends on where the reference date
		 falls within the period (e.g. beginning, end or ???)
		 1 year ~ (365*4+1)/4*60*60*24*100 = 3155760000 centiseconds
		 1 month ~ (365*4+1)/48*60*60*24*100 = 262980000 centiseconds
		 1 day = 8640000 centiseconds
		 1 hour = 360000 centiseconds
		 1 minute = 6000 centiseconds */
		var str = "P",
		nCs = Math.max(n, 0),
		nY = 0,
		nM = 0,
		nD = 0,
		nH,
		nMin;
		// Next set of operations uses whole seconds
		//with (Math) { //argumentatively considered harmful
		nCs = Math.round(nCs);
		if (bPrecise === true) {
		    nD = Math.floor(nCs / 8640000);
		} else {
		    nY = Math.floor(nCs / 3155760000);
		    nCs -= nY * 3155760000;
		    nM = Math.floor(nCs / 262980000);
		    nCs -= nM * 262980000;
		    nD = Math.floor(nCs / 8640000);
		}
		nCs -= nD * 8640000;
		nH = Math.floor(nCs / 360000);
		nCs -= nH * 360000;
		nMin = Math.floor(nCs / 6000);
		nCs -= nMin * 6000;
		//}
		// Now we can construct string
		if (nY > 0) {
		    str += nY + "Y";
		}
		if (nM > 0) {
		    str += nM + "M";
		}
		if (nD > 0) {
		    str += nD + "D";
		}
		if ((nH > 0) || (nMin > 0) || (nCs > 0)) {
		    str += "T";
		    if (nH > 0) {
		        str += nH + "H";
		    }
		    if (nMin > 0) {
		        str += nMin + "M";
		    }
		    if (nCs > 0) {
		        str += (nCs / 100) + "S";
		    }
		}
		if (str === "P") {
		    str = "PT0H0M0S";
		}
		// technically PT0S should do but SCORM test suite assumes longer form.
		return str;
	};


	return {
		getDurationFromISO			: getDurationFromISO,
		getDurationFromISOPerUnit	: getDurationFromISOPerUnit,
		getISODurationFromSecs		: getISODurationFromSecs
	};

}) ();