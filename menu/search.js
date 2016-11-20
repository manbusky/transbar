
window.$ = window.jQuery = require('../assets/js/jquery.min.js');

var translate = require('./translate');
var FixedArray = require('fixed-array');
var wordView = require('./word_view');
const {ipcRenderer} = require('electron');


var timerNumber;
var timeArray = FixedArray(10);

$(document).ready(function() {

	$("#mainQ").keyup(function(event) {

		var eventCode = event.keyCode;

		if(eventCode == 13) { searchNow(); return; }

		var currentValue = $.trim($("#mainQ").val());
		var storageValue = $("#mainQ").data("Q");

		if(currentValue != storageValue) {
			
			$("#mainQ").data("Q", currentValue);

			clearTimeout(timerNumber);

			timerNumber = setTimeout(searchNow, 200);
		}

	});

	$("#btnQ").click(searchNow);

	$("#mainQ").focus();
});

function searchNow() {

	clearTimeout(timerNumber);

	var q = $.trim($("#mainQ").val());

	if(q.length == 0) { clearShowPanel(); return; }

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

	var view = wordView(data);

	newShowPanel();

	$("#showPanel").find(".panel").append(newOne(view.title));

	view.explains.forEach((item) => {
	
		$("#showPanel").find(".panel").append(newOne(item));

	});

	ipcRenderer.sendSync('render-resize', view.explains.length);
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

ipcRenderer.on("clipboard-paste", (event, message) => {
	
	$("#mainQ").val(message);

	var currentValue = $.trim($("#mainQ").val());
	var storageValue = $("#mainQ").data("Q");

	if(currentValue != storageValue) {
		searchNow();
	}

});

