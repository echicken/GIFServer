var GIF = require('../gif.js');

exports.random = function(request, response) {
	var gif = GIF.randomGIF();
	if(gif.duration < 3000)
		gif.duration = gif.duration * 2;
	response.render('gif', { gif: gif });
}