var assert = require('assert');
var Markov = require('../markov');

var markov = new Markov();

describe('markov', function() {
    // describe('processFile', function() {
    //     it('should throw an error if no file passed', function() {
    //         assert.throws(markov.processFile(''), TypeError);
    //     });

    //     it('should read a file', function() {
    //         assert.equal(markov.processFile('./test/test.txt'), true);
    //     });
    // });

    describe('randomText', function() {
        it('should return 100 words by default', function() {
            markov.processFile('test/test.txt');
            markov.on('finish', function() {
                assert.equal(markov.randomText().split(' ').length, 100);
            });
        });
    });
});