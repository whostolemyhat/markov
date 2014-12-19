var Markov = require('./markov');

var markov = new Markov();

markov.processFile('../frankenstein.txt', 1);

markov.on('finish', function(filename) {
    'use strict';
    console.log('finished processing ' + filename);
    console.log(markov.randomText());
});
