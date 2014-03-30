var express = require('express');
var debug = require('debug')('GIFServer');
var http = require('http');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var GIFFeed = require('GIFFeed');
var GIF = require('./gif.js');

var routes = require('./routes.js');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);

app.get('/', routes.random);

app.use(
    function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    }
);

if(app.get('env') === 'development') {
    app.use(
        function(err, req, res, next) {
            res.render(
                'error',
                {   message: err.message,
                    error: err
                }
            );
        }
    );
}

app.use(
    function(err, req, res, next) {
        res.render('error',
            {   message: err.message,
                error: {}
            }
        );
    }
);

var feed = new GIFFeed({ 'seen' : GIF.knownGIFs() });
feed.on("GIF", GIF.handleGIF);
feed.on("error", function(err) { console.log(err); });
feed.load();
setInterval(feed.load, 1800000);

app.set('port', process.env.PORT || 3000);
var server = app.listen(
    app.get('port'),
    function() {
        debug('Express server listening on port ' + server.address().port);
    }
);