var fs = require('fs'),
	util = require('util'),
	GIFFeed = require('GIFFeed');

var GIFStream = function(options) {

	var settings = {
		'feedURL' : 'http://www.reddit.com/r/gifs/.json',
		'limit' : 100,
		'cache' : false,
		'SRID' : "t5_2qt55"
	}

	var handleGIF = function(gif) {
		if(settings.cache) {
			fs.writeFile(
				util.format(
					"./public/%s/%s.gif",
					settings.SRID,
					gif.id
				),
				gif.gif,
				function(err) {
				}
			);
		}
		delete gif.gif;
		fs.writeFile(
			util.format(
				"./metadata/%s/%s.json",
				settings.SRID,
				gif.id
			),
			JSON.stringify(gif),
			function(err) {
			}
		);
	}

	var knownGIFs = function() {
		var filenames = fs.readdirSync("./metadata/" + settings.SRID);
		filenames.forEach(
			function(item, index, arr) {
				arr[index] = item.replace(".json", "");
			}
		);
		return filenames;
	}

	this.randomGIF = function() {
		var ids = knownGIFs();
		var id = ids[Math.floor(Math.random()*ids.length)];
		try {
			var gif = JSON.parse(
				fs.readFileSync(
					util.format(
						"./metadata/%s/%s.json",
						settings.SRID,
						id
					)
				)
			);
			gif.filename = util.format(
				"/%s/%sgif",
				settings.SRID,
				id
			);
			gif.src = (settings.cache) ? gif.filename : gif.url;
			return gif;
		} catch(err) {
			console.log(err);
			return this.randomGIF();
		}
	}

	var init = function(){
		for(var o in options) {
			if(typeof settings[o] == typeof options[o])
				settings[o] = options[o];
		}
		fs.mkdir("./metadata/" + settings.SRID, function(err) {});
		if(settings.cache)
			fs.mkdir("./public/" + settings.SRID, function(err) {});
		var feed = new GIFFeed(
			{	'feedURL' : settings.feedURL,
				'limit' : settings.limit,
				'seen' : knownGIFs()			
			}
		);
		feed.on("GIF", handleGIF);
		feed.on(
			"error",
			function(err) {
				console.log(err);
			}
		);
		feed.load();
		setInterval(feed.load, 1800000);
	}

	init();

}

module.exports = GIFStream;