var fs = require('fs');
var _ = require('lodash');



function readLines() {
    'use strict';

    var wordFrequency = {};
    var file = fs.createReadStream('./colour.js');

    file.on('error', function(err) {
        console.log(err);
        throw err;
    });

    file.on('data', function(data) {
        var words = (data + '').split(' ');
        var i;

        for(i = 0; i < words.length; i++) {
            var word = words[i];

            // don't add empty strings
            word = removePunctuation(word).toLowerCase();
            if(word.length && word !== '') {
                if(word in wordFrequency) {
                    wordFrequency[word] += 1;
                } else {
                    wordFrequency[word] = 1;
                }
            }
        }
    });

    file.on('end', function() {
        console.log('Finished');
        var sorted = [];
        for(var key in wordFrequency) {
            var obj = {};
            obj[key] = wordFrequency[key];
            sorted.push(obj);
        }

        sorted = _.sortBy(sorted, function(obj) {
            return _.values(obj);
        });

        console.log(sorted.reverse());
        console.log('word count: ' + totalWords(wordFrequency));
        console.log('unique words: ' + sorted.length);
    });
}


/**
* Returns sum of word frequencies
* @param obj [object] - object in format { word: frequency }
* @returns [number]
*/
function totalWords(obj) {
    return _.reduce(_.values(obj), function(sum, num) {
        return sum + num;
    });
}


/**
* Strips punctuation and trims whitespace from a word
* @param word [string]
* @return [string]
*/
function removePunctuation(word) {
    'use strict';
    // punctuation
    var punctRE = /[\u2000-\u206F\u2E00-\u2E7F\\'!"#\$%&\(\)\*\+,\-\.\/:;<=>\?@\[\]\^_`\{\|\}~]/g;
    // spaces
    var spaceRE = /\s+/g;

    return word.replace(punctRE, '').replace(spaceRE, '');
}


readLines();