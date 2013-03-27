var hyperquest = require('hyperquest');

module.exports = function () { return new Portfolio };

function Portfolio () {
    var self = this;
    this.root = document.createElement('div');
    this.root.className = 'list';

    loadImages(function (images) {
        self.images = images;
        self.render();
    });
}

Portfolio.prototype.appendTo = function (target) {
    if (typeof target === 'string') target = document.querySelector(target);
    target.appendChild(this.root);
};

Portfolio.prototype.render = function (src) {

};

function loadImages (cb) {
    var r = hyperquest('http://' + window.location.host + '/images.json');
}

