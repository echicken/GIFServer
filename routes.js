exports.random = function(request, response, gifStream) {
	var gif = gifStream.randomGIF();
	response.render('gif', { gif: gif });
}