exports.random = function(request, response, gifStream) {
	var gif = gifStream.randomGIF();
	if(gif.duration < 3000)
		gif.duration = gif.duration * 2;
	response.render('gif', { gif: gif });
}