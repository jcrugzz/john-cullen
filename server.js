var http = require('http');
var hyperstream = require('hyperstream');
var fs = require('fs');
var path = require('path');

var ecstatic = require('ecstatic')({
    root: __dirname + '/static',
    showDir: true,
    gzip: true
});

var server = http.createServer(function (req, res) {
    // Do logic to intercept any other type of page or static resource here
    if (!/^\/[^\.\/]*$/.test(req.url)
    || RegExp('^/(images|doc|projects|audio|video)\\b').test(req.url)) {
        return ecstatic(req, res);
    }

    // Start logic for standard index.html
    res.setHeader('content-type', 'text/html');

    // Create stream for main HTML
    var indexFile = path.join(__dirname, 'static', 'index.html');
    var indexStream = fs.createReadStream(indexFile);

    // Pages to create streams from and attach to main html
    var pages = [];
    var streams = pages.reduce(function (acc, page) {
        var name = page.replace(/-/g, '_') + '.html';
        var file = path.join(__dirname, 'static', 'pages', name);
        acc['#' + page] = fs.createReadStream(file);
    }, {});

    // Links up html streams to the main html stream and sends it down to the browser
    indexStream.pipe(hyperstream(streams)).pipe(res);
});

server.listen(3000);
