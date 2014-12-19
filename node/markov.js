var fs = require('fs');
var EventEmitter = require('events').EventEmitter;
var util = require('util');

/**
* Markov chain generator
*
* Create chains of words based on preceding words in a file.
*/
var Markov = function() {
    'use strict';

    this.prefix = [];
    this.memory = {};

    // TODO: use options
    this.splitOnFullstop = true;
    this.shouldRemovePunctuation = false;
    this.convertToLowercase = false;
    this.words = '';
};

util.inherits(Markov, EventEmitter);

/**
* Reads file and splits into array of words for processing
*
* @param filename [string] : file from which to read words
* @param order [number] : length of prefix for processing (i.e. past states)
*/
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

            if(self.shouldRemovePunctuation) {
                self.processWord(removePunctuation(word).trim(), order);
            } else {
                self.processWord(encodeURIComponent(word).trim(), order);
            }
        }, self);
    });


    file.on('end', function() {
        self.emit('finish', filename);
    });
};


/**
* Creates prefix under which to store current word, and adds to memory object
*
* @param word [string] : current word to map to prefix
* @param order [number] : length of prefix. Order m is the past m states
*/
Markov.prototype.processWord = function(word, order) {
    'use strict';

    if(word.length) {
        if(this.prefix.length < order) {
            // add new word
            this.prefix.push(word.toLowerCase());
            return;
        }

        var key = this.prefix.join(',');
        this.memory = addToMemory(this.memory, key, word);
        this.prefix.push(word);
        this.prefix.shift();
    }
};


/**
* Creates a Markov chain of words from processed prefix object.
*
* @param n [number] : Number of words to return. Defaults to 100
* @returns [string]
*/
Markov.prototype.randomText = function(n) {
    'use strict';

    var self = this;
    var sentence = '';
    n = n || 100;

    var start = getRandomKey(self.memory);

    for(var i = 0; i < n; i++) {
        var suffix = self.memory[start];

        if(!suffix) {
            // no value for key ie picked the last words in src
            suffix = self.memory[getRandomKey()];
        }

        var word = getRandomFromArray(suffix);

        sentence += decodeURIComponent(word) + ' ';

        start = start.split(',');
        start.shift();
        start.push(word);
        start = start.join(',');
    }

    return sentence;
};


// ===========================================
// Private functions
// ===========================================
/**
* Adds value to an array referenced by a key in an object. 
* If the key does not exist, creates it in the object and adds value
*
* @param memory [object] : Object mapping keys to values
* @param key [string] : Key to store value under
* @param value [string|number|bool] : value to store
* @returns [object]
*/
function addToMemory(memory, key, value) {
    'use strict';

    if(!memory[key]) {
        memory[key] = [];
    }

    memory[key].push(value);

    return memory;
}


/**
* Returns a random key from an object
*
* @param memory [object] : an object to select a key from
* @returns [string]
*/
function getRandomKey(memory) {
    'use strict';

    var keys = Object.keys(memory);
    return keys[Math.floor(Math.random() * keys.length)];
}


/**
* Returns random item from an array
*
* @param arr [array] : array from which to select an item
* @return [string]
*/
function getRandomFromArray(arr) {
    'use strict';

    return arr[Math.floor(Math.random() * arr.length)];
}


/**
* Strips punctuation from a string
*
* @param word [string]
* @returns [string]
*/
function removePunctuation(word) {
    'use strict';

    var punctRE = /[\u2000-\u206F\u2E00-\u2E7F\\'!"#\$%&\(\)\*\+,\-\.\/:;<=>\?@\[\]\^_`\{\|\}~]/g;
    return word.replace(punctRE, '');
};

module.exports = Markov;