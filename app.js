var express = require('express'),
    debug = require('debug')('GIFServer'),
    http = require('http'),
    path = require('path'),
    favicon = require('static-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    GIFFeed = require('GIFFeed'),
    GIFStream = require('./GIFStream.js'),
    routes = require('./routes.js');

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


var gifs = new GIFStream({ 'SRID' : "t5_2qt55" });

app.get(
    '/',
    function(request, response) {
        routes.random(request, response, gifs);
    }
);

app.set('port', process.env.PORT || 3000);
var server = app.listen(
    app.get('port'),
    function() {
        debug('Listening on port ' + server.address().port);
    }
);