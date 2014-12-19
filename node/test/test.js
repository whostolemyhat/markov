var assert = require('assert');
var Markov = require('../markov');

var markov = new Markov();

describe('markov', function() {
    // describe('processFile', function() {
    //     it('should throw an error if no file passed', function() {
    //         assert.throws(markov.processFile(''));
    //     });

    //     it('should read a file', function() {
    //         assert.doesNotThrow(markov.processFile('./test/test.txt'));
    //     });
    // });

    describe('randomText', function() {
        before(function() {
            markov.processFile('test/test.txt');
        });

        it('should return at least 100 words by default', function() {
            // markov.processFile('test/test.txt');
            markov.on('finish', function() {
                assert(markov.randomText().split(' ').length >= 100);
            });
        });

        it('should return sentence of length specified', function() {
            markov.on('finish', function() {
                assert(markov.randomText(20).split(' ').length, 20);
            });
        });
    });
});