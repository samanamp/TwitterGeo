
/* This should be set to the reverse proxy value of the couchdb in the Apache configuration */
var server = 'http://localhost/couchdb/';

function onload() {
	
	var res = getSentimentTweets();
	var text = '';
	for (var i = 0; i < res.length; i++) {
		text += res[i][0] + ' - ' + res[i][1] + '<br/>';
	}
	//$('#results').html(text);
	
	$('#results').html(JSON.stringify(getD3JSONSentimentOn(2013,9,30)));
	
};

/* Returns in a bi-dimensional array the number of tweets per language. The
 * first element is the two digit code of the language, and the second the
 * number of tweets e.g. res[0][0] = 'ar' and res[0][1] = 500.
 */
function getLanguageTweets() {
	var json = '';
	$.ajax({
		  type: 'GET',
		  dataType: 'json',
		  url: server + 'twittering_replica/_design/language/_view/per_day?group_level=1',
		  success: function(result) {
			  json = result;
		  },
		  async: false
	});
	
	var res = new Array();
	for (var i = 0; i < json.rows.length; i++) {
		var k = json.rows[i].key;
		var v = json.rows[i].value;
		res[i] = new Array(2);
		res[i][0] = k[0];
		res[i][1] = v;
	}
	
	return res;
};

/* Returns in a bi-dimensional array the number of tweets per language, given
 * a specified day by the input arguments. 
 * The first element is the two digit code of the language, and the second the
 * number of tweets e.g. res[0][0] = 'ar' and res[0][1] = 500.
 */
function getLanguageTweetsPerDay(year, month, day) {
	var json = '';
	month--;
	$.ajax({
		  type: 'GET',
		  dataType: 'json',
		  url: server + 'twittering_replica/_design/language/_view/per_day_range?'
		  	+ 'group_level=4&startkey=[' + year + ',' + month + ',' + day + ']&endkey=[' 
		  	+ year + ',' + month + ',' + day + 1 + ']',
		  success: function(result) {
			  json = result;
		  },
		  async: false
	});
	
	var res = new Array();
	for (var i = 0; i < json.rows.length; i++) {
		var k = json.rows[i].key;
		var v = json.rows[i].value;
		res[i] = new Array(2);
		res[i][0] = k[0];
		res[i][1] = v;
	}
	
	return res;
};


