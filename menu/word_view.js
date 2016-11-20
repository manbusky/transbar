
module.exports = function(data) {

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

	return {
		title: title,
		explains: explains
	};

};
