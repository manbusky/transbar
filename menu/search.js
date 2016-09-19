
window.$ = window.jQuery = require('../assets/js/jquery.min.js');

var translate = require('./translate');
var FixedArray = require('fixed-array');
const {ipcRenderer} = require('electron');


var timerNumber;
var timeArray = FixedArray(10);

$(document).ready(function() {

	$("#mainQ").keyup(function(event) {
		
		clearTimeout(timerNumber);

		if(event.keyCode == 13) {
			searchNow();
		} else {
			timerNumber = setTimeout(searchNow, 200);
		}

	});

	$("#btnQ").click(searchNow);

	$("#mainQ").focus();
});

function searchNow() {

	clearTimeout(timerNumber);

	var q = $.trim($("#mainQ").val());

	if(q.length == 0) { clearShowPanel(); }

	var time = (new Date()).getTime();

	timeArray.push(time);

	translate(q, time, function(requestTime, data) {

		if(requestTime < timeArray.max()) {
			//之前的请求才响应数据，忽略掉，不渲染；
			return;
		}

//		console.log(requestTime);
		renderView(data);

	});
}

function renderView(data) {

	var query = data.query;
	var translation = data.translation.join(",");
	var ukPhonetic = data.basic["uk-phonetic"];
	var usPhonetic = data.basic["us-phonetic"];	
	var explains = data.basic.explains;

	var title = query + "&nbsp;&nbsp;" + "<strong>"+translation+"</strong>" + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";

	if(ukPhonetic) {
		title += "英：[" + ukPhonetic + "]";
	}
	if(usPhonetic) {
		title += "&nbsp;&nbsp;&nbsp;美：[" + usPhonetic + "]";
	}

	newShowPanel();

	$("#showPanel").find(".panel").append(newOne(title));

	explains.forEach((item) => {
	
		$("#showPanel").find(".panel").append(newOne(item));

	});

	ipcRenderer.sendSync('render-resize', explains.length);
}

function newShowPanel() {

	$("#showPanel").remove();

	var showPanel = $("<div class='panel-body' id='showPanel'><div class='panel panel-success'></div></div>");

	$("#mainPanel").append(showPanel);
}

function newOne(content) {

	return $("<div class='panel-footer'><span>" + content + "</span></div>");
}

function clearShowPanel() {

	$("#showPanel").remove();

	ipcRenderer.sendSync('render-resize', 0);
}

