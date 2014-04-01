var loadTime = new Date().getTime();
var timeout = true;
var nextImage = function() {
	var diff = (new Date().getTime()) - loadTime;
	if(!timeout)
		return;
	timeout = setTimeout(
		function() {
			location.reload();
		},
		(diff > <%= gif.duration %>)
		?
		1
		:
		(<%= gif.duration %> - diff)
	);
}