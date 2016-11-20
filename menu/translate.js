
var httpclient = require('node-httpclient');

var config = require('../config');

function translate(q, time, callback) {

	var url = config.api + q;

	var promise = httpclient.get(url);

	// console.log("translate: " + q);

	promise.success(function success(result) {

	//		clearTimeout(timerNumber);

	  	if(result.status == 200) {

	  		clearShowPanel();
	  		
	  		var data = result.data;
	  		
	  		console.log(data);

	  		if(data && data.basic) {
	  			callback(time, data);
	  		}
	  	}

	}).error(function(result){
		clearTimeout(timerNumber);

	  	console.log(result);

	  	$("#txtShow").text(JSON.stringify(result));

	});
}

module.exports = translate;

