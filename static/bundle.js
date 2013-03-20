;(function(e,t,n,r){function i(r){if(!n[r]){if(!t[r]){if(e)return e(r);throw new Error("Cannot find module '"+r+"'")}var s=n[r]={exports:{}};t[r][0](function(e){var n=t[r][1][e];return i(n?n:e)},s,s.exports)}return n[r].exports}for(var s=0;s<r.length;s++)i(r[s]);return i})(typeof require!=="undefined"&&require,{1:[function(require,module,exports){
exports.show = function (e) { if (e) e.style.display = 'block' };
exports.hide = function (e) { if (e) e.style.display = 'none' };

},{}],2:[function(require,module,exports){
var vis = require('./vis');

// accumulates all of the page elements with their ids in an object
var pages = [].slice.call(document.querySelectorAll('.page'))
    .reduce(function (acc, elem) {
        acc[elem.getAttribute('id')] = elem;
    }, {});

// Handle href links on page
var singlePage = require('single-page');
var showPage = singlePage(function (href) {
    Object.keys(pages).forEach(function (key) {
        vis.hide(pages[key]);
    });

    if (href === '/') {
        vis.show(pages.root);
        return;
    }

});

// Make all links that start with a '/' route through singlePage
var links = document.querySelectorAll('a[href]');
for (var i=0; i < links.length; i++) (function (link) {
    var href = link.getAttribute('href');
    if (RegExp('^/').test(href)) {
        link.addEventListener('click', function (ev) {
            if (ev.ctrlKey) return;
            ev.preventDefault();
            showPage(href);
        });
    }
})(links[i]);

},{"./vis":1,"single-page":3}],4:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            if (ev.source === window && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],3:[function(require,module,exports){
(function(process){module.exports = function (cb, opts) {
    var page = new Page(cb, opts);
    
    if (window.addEventListener) {
        window.addEventListener('hashchange', onhashchange);
        window.addEventListener('popstate', onpopstate);
    }
    else {
        window.onhashchange = onhashchange;
    }
    
    function onhashchange () {
        var href = window.location.hash.replace(/^#!\/?/, '/');
        if (page.current !== href && /^#!/.test(window.location.hash)) {
            page.show(href);
        }
    }
    
    function onpopstate () {
        var href = /^#!/.test(window.location.hash)
            ? window.location.hash.replace(/^#!/, '/')
            : window.location.pathname
        ;
        page.show(href);
    }
    process.nextTick(onpopstate);
    
    var fn = function (href) { return page.show(href) };
    fn.push = function (href) { return page.push(href) };
    fn.show = function (href) { return page.show(href) };
    return fn;
};

function Page (cb, opts) {
    if (!opts) opts = {};
    this.current = null;
    this.hasPushState = opts.pushState !== undefined
        ? opts.pushState
        : window.history && window.history.pushState
    ;
    this.scroll = opts.saveScroll !== false ? {} : null;
    this.cb = cb;
}

Page.prototype.show = function (href) {
    href = href.replace(/^\/+/, '/');
     
    if (this.current === href) return;
    this.saveScroll(href);
    this.current = href;
    
    var scroll = this.scroll[href];
    this.cb(href, {
        scrollX : scroll && scroll[0] || 0,
        scrollY : scroll && scroll[1] || 0,
    });
    
    this.pushHref(href);
};

Page.prototype.saveScroll = function (href) {
    if (this.scroll && this.current) {
        this.scroll[this.current] = [ window.scrollX, window.scrollY ];
    }
};

Page.prototype.push = function (href) {
    href = href.replace(/^\/+/, '/');
    this.saveScroll(href);
    this.pushHref(href);
};

Page.prototype.pushHref = function (href) {
    this.current = href;
    
    if (this.hasPushState) {
        var mismatched = window.location.pathname !== href;
        if (mismatched) window.history.pushState(null, '', href);
    }
    else if (window.location.hash !== '#!' + href) {
        if (window.location.pathname !== '/') {
            window.location.href = '/#!' + href;
        }
        else {
            window.location.hash = '#!' + href;
        }
    }
};

})(require("__browserify_process"))
},{"__browserify_process":4}]},{},[2])
;