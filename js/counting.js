
/* Location of the couchdb proxy. Please make sure a proxy is configured
 * for the apache server pointed by this URL.
 */
var server = "http://localhost/couchdb";

/* For detail on the output json objects these function return please look at
 * the data input specifications for the d3 libraries.
 */

/* Returns the total number of tweets generated per day. */
function getNumberTweetsPerDay() {
	var json = '';
	$.ajax({
		  type: 'GET',
		  dataType: 'json',
		  url: server + 'twittering_replica/_design/counting/_view/per_hour?group_level=3',
		  success: function(result) {
			  json = result;
		  },
		  async: false
	});
	
	var data = [
	    {
	    	key: "Sydney",
	    	values: []
	    }
	]
	
	for (var i = 0; i < json.rows.length; i++) {
		var k = json.rows[i].key;
		var v = json.rows[i].value;
		var time = new Date(k[0], k[1], k[2], 0, 0, 0, 0);
		var element = [time.getTime(), v];
		data[0].values.push(element);
	}
	
	return data;
};

/* Returns the total number of tweets per hour on a specific day.
 * The day is specified in the arguments year, month and day */
function getNumberTweetsPerHour(year, month, day) {
	var json = '';
	month--;
	$.ajax({
		  type: 'GET',
		  dataType: 'json',
		  url: server + 'twittering_replica/_design/counting/_view/per_hour?group_level=4'
		  	+ '&startkey=[' + year + ',' + month + ',' + day + ']&endkey=[' + year 
		  	+ ',' + month + ',' + (day + 1) + ']',
		  success: function(result) {
			  json = result;
		  },
		  async: false
	});
	
	var data = [
	    {
	    	key: "Sydney",
	    	values: []
	    }
	]
	
	for (var i = 0; i < json.rows.length; i++) {
		var k = json.rows[i].key;
		var v = json.rows[i].value;
		var time = new Date(k[0], k[1], k[2], k[3], 0, 0, 0);
		var element = [time.getTime(), v];
		data[0].values.push(element);
	}
	
	return data;
};

/* Returns all the points in the json object format that the d3 library requires
 * to render the hex map of the points according to number of tweets.
 */
function getD3JSONCounting() {
	
	var doc = '';
	$.ajax({
		  type: 'GET',
		  dataType: 'json',
		  url: server + 'twittering_replica/_design/counting/_view/coordinates',
		  success: function(result) {
			  doc = result;
		  },
		  async: false
	});
	
	var res = {
		"extent" : [150.821457,-34.026391,151.319962,-33.724244],
		"features" : []
	};
	for (var i = 0; i < doc.total_rows; i++) {
		var point = {
			"geometry": {
				"type" : "point",
				"coordinates" : [doc.rows[i].value[0],doc.rows[i].value[1]]
			}
		}
		res.features.push(point);
	}
	return res;
}

/* Returns all the points in the json object format that the d3 library requires
 * to render the hex map of the points according to number of tweets, on a specific day.
 */
function getD3JSONCountingOn(year, month, day) {
	
	var doc = '';
	month--;
	$.ajax({
		  type: 'GET',
		  dataType: 'json',
		  url: server + 'twittering_replica/_design/counting/_view/coordinates'
		  	+ '?startkey=[' + year + ',' + month + ',' + day + ']&endkey=[' + year 
		  	+ ',' + month + ',' + day + ']',
		  success: function(result) {
			  doc = result;
		  },
		  async: false
	});
	
	var res = {
		"extent" : [150.821457,-34.026391,151.319962,-33.724244],
		"features" : []
	};
	for (var i = 0; i < doc.rows.length; i++) {
		var point = {
			"geometry": {
				"type" : "point",
				"coordinates" : [doc.rows[i].value[0],doc.rows[i].value[1]]
			}
		}
		res.features.push(point);
	}
	return res;
}