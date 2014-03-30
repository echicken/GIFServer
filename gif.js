var fs = require('fs');

var GIF = function() {

	this.handleGIF = function(gif) {
		fs.writeFile("./public/" + gif.id + ".gif", gif.gif, function(err) {});
		delete gif.gif;
		fs.writeFile("./metadata/" + gif.id + ".json", JSON.stringify(gif), function(err) {});
	}

	this.knownGIFs = function() {
		var filenames = fs.readdirSync("./metadata");
		filenames.forEach(
			function(item, index, arr) {
				arr[index] = item.replace(".json", "");
			}
		);
		return filenames;
	}

	this.randomGIF = function() {
		var ids = this.knownGIFs();
		var id = ids[Math.floor(Math.random()*ids.length)];
		var gif = JSON.parse(fs.readFileSync("./metadata/" + id + ".json"));
		gif.filename = id + ".gif";
		return gif;
	}

}

module.exports = new GIF();