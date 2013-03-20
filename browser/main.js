var vis = require('./vis');

// accumulates all of the page elements with their ids in an object
var pages = [].slice.call(document.querySelectorAll('.page'))
    .reduce(function (acc, elem) {
        acc[elem.getAttribute('id')] = elem;
        return acc;
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
