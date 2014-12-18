var fs = require('fs');
var EventEmitter = require('events').EventEmitter;
var util = require('util');

var Markov = function() {
    'use strict';

    this.prefix = [];
    this.memory = {};

    // TODO: use options
    this.splitOnFullstop = true;
    this.removePunctuation = false;
    this.convertToLowercase = false;
    this.words = '';
};

util.inherits(Markov, EventEmitter);


Markov.prototype.removePunctuation = function(word) {
    'use strict';

    var punctRE = /[\u2000-\u206F\u2E00-\u2E7F\\'!"#\$%&\(\)\*\+,\-\.\/:;<=>\?@\[\]\^_`\{\|\}~]/g;
    return word.replace(punctRE, '');
};

Markov.prototype.processFile = function(filename, order) {
    'use strict';

    var self = this;
    order = order || 2;
    var file = fs.createReadStream(filename);

    file.on('error', function(err) {
        console.log(err);
        throw err;
    });

    file.on('data', function(data) {
        self.words += (data + '');
        if(self.splitOnFullstop) {
            self.words = self.words.replace('.', ' .');
        }

        self.words = self.words.replace(/(\r\n|\r|\n)/gm, ' ').split(' ');

        self.words.forEach(function(word) {
            if(self.convertToLowercase) {
                word = word.toLowerCase();
            }

            if(self.removePunctuation) {
                self.processWord(self.removePunctuation(word).trim(), order);
            } else {
                self.processWord(encodeURIComponent(word).trim(), order);
            }
        }, self);
    });


    file.on('end', function() {
        self.emit('finish', filename);
    });
};

Markov.prototype.processWord = function(word, order) {
    'use strict';

    if(word.length) {
        if(this.prefix.length < order) {
            // add new word
            this.prefix.push(word.toLowerCase());
            return;
        }

        var key = this.prefix.join(',');
        this.addToMemory(key, word);
        this.prefix.push(word);
        this.prefix.shift();
    }
};

Markov.prototype.addToMemory = function(key, value) {
    'use strict';

    if(!this.memory[key]) {
        this.memory[key] = [];
    }

    this.memory[key].push(value);
};

Markov.prototype.randomText = function(n) {
    'use strict';

    var self = this;
    var sentence = '';
    n = n || 100;

    var start = self.getRandomKey(self.memory);

    for(var i = 0; i < n; i++) {
        var suffix = self.memory[start];

        if(!suffix) {
            // no value for key ie picked the last words in src
            suffix = self.memory[self.getRandomKey()];
        }

        var word = self.getRandomFromArray(suffix);

        sentence += decodeURIComponent(word) + ' ';

        start = start.split(',');
        start.shift();
        start.push(word);
        start = start.join(',');
    }

    return sentence;
};

Markov.prototype.getRandomKey = function(memory) {
    'use strict';

    var keys = Object.keys(memory);
    return keys[Math.floor(Math.random() * keys.length)];
};

Markov.prototype.getRandomFromArray = function(arr) {
    'use strict';

    return arr[Math.floor(Math.random() * arr.length)];
};

module.exports = Markov;