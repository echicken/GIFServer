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

var streams = [
    {   'name' : 'gifs',
        'route' : "/gifs",
        'nsfw' : false
    },
    {   'name' : 'cinemagraphs',
        'route' : "/cinemagraphs",
        'subReddit' : "/r/cinemagraphs",
        'minimumDuration' : 6000
    },
    {   'name' : 'interesting',
        'route' : '/interesting',
        'subReddit' : "/r/interestinggifs"
    },
    {   'name' : 'nature',
        'route' : '/nature',
        'subReddit' : "/r/naturegifs"
    },
    {   'name' : 'spacegifs',
        'route' : "/spacegifs",
        'subReddit' : "/r/spacegifs",
        'minimumDuration' : 6000
    },
    {   'name' : 'surreal',
        'route' : '/surreal',
        'subReddit' : "/r/SurrealGifs"
    }
];

var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(favicon("./public/favicon.ico"));
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

for(var s in streams) {
    (function(s) {
        var stream = new GIFStream(streams[s]);
        app.get(
            streams[s].route,
            function(request, response) {
                routes.random(request, response, stream);
            }
        );
    })(s);
}

app.get(
    "/",
    function(request, response) {
        routes.index(request, response, streams);
    }
);

app.set('port', process.env.PORT || 3001);
var server = app.listen(
    app.get('port'),
    function() {
        debug('Listening on port ' + server.address().port);
    }
);
