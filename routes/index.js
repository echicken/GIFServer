var GIF = require('../gif.js');

exports.random = function(request, response) {
	var gif = GIF.randomGIF();
	response.render(
		'gif',
		{	gif: gif.filename,
			duration: gif.duration
		}
	);
}