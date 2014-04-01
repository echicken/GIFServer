exports.index = function(request, response, feeds) {
	response.render('index', { 'feeds' : feeds });
}

exports.random = function(request, response, gifStream) {
	var gif = gifStream.randomGIF();
	response.render('gif', { gif: gif });
}