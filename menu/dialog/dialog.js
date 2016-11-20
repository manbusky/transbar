
var wordView = require('../word_view');

$(document).ready(function() {

	var item0 = {"translation":["存储库"],"basic":{"us-phonetic":"rɪ'pɑzə'tɔri","phonetic":"rɪ'pɒzɪt(ə)rɪ","uk-phonetic":"rɪ'pɒzɪt(ə)rɪ","explains":["n. 贮藏室，仓库；知识库；智囊团"]},"query":"repository","errorCode":0,"web":[{"value":["知识库","资源库","版本库"],"key":"repository"},{"value":["对象库","对象仓库","打开对象库"],"key":"Object Repository"},{"value":["储存机制浏览器","库浏览器","保存机制浏览器"],"key":"repository Browser"}]};
	var item1 = {"translation":["解释"],"basic":{"us-phonetic":"ɪk'splen","phonetic":"ɪk'spleɪnɪŋ","uk-phonetic":"ɪk'spleɪnɪŋ","explains":["v. 说明；解释"]},"query":"explain","errorCode":0};
	var item2 = {"translation":["指数"],"basic":{"us-phonetic":"'ɪndɛks","phonetic":"'ɪndeks","uk-phonetic":"'ɪndeks","explains":["n. 指标；指数；索引；指针","vt. 指出；编入索引中","vi. 做索引"]},"query":"index","errorCode":0,"web":[{"value":["指数","索引","指标"],"key":"Index"},{"value":["酷热指数","酷热指数","热指数"],"key":"Heat index"},{"value":["默克索引"],"key":"Merck Index"}]};

	var items = [item0, item1, item2];

	items.forEach( (item, index) => {

		var viewData = wordView(item);

		var views = newItemView(viewData, index);

		$("#mainGroup").append(views[0]);
		$("#mainGroup").append(views[1]);

	})

});

function newItemView(viewData, index) {

	var a = $("<a>").attr("href", "#wordItem" + index).attr("data-toggle", "collapse").addClass("list-group-item");

	var div = $("<div>").addClass("collapse").attr("id", "wordItem" + index);

	var divContent = $("<div>").addClass("well");

	var showPanel = $("<div class='panel panel-success'></div>");

	viewData.explains.forEach((item) => {

		showPanel.append(newContent(item));
	});

	divContent.append(showPanel);

	div.append(divContent);

	a.html(viewData.title);

	return [a, div];

}

function newContent(content) {

	return $("<div class='panel-body'><span>" + content + "</span></div>");
}
