var fs = require('fs');

var prefix = [];
var memory = {};

function processFile(filename, order) {
    'use strict';

    order = order || 2;
    var file = fs.createReadStream(filename);

    file.on('error', function(err) {
        console.log(err);
        throw err;
    });

    file.on('data', function(data) {
        var words = (data + '').split(' ');

        words.forEach(function(word) {
            processWord(encodeURIComponent(word).trim(), order);
        }, this);
    });


    file.on('end', function() {
        console.log('finished processing ' + filename);
    });
}

function processWord(word, order) {
    'use strict';

    if(word.length) {
        if(prefix.length < order) {
            // add new word
            prefix.push(word.toLowerCase());
            return;
        }

        var key = prefix.join(',');
        addToMemory(key, word);
        prefix.push(word);
        prefix.shift();
    }
}

function addToMemory(key, value) {
    'use strict';

    if(!memory[key]) {
        memory[key] = [];
    }

    memory[key].push(value);
}

function randomText(n) {
    'use strict';

    n = n || 100;
    var sentence = '';

    var start = getRandomKey();

    for(var i = 0; i < n; i++) {
        var suffix = memory[start];

        if(!suffix) {
            // no value for key ie picked the last words in src
            suffix = memory[getRandomKey()];
        }

        var word = getRandomFromArray(suffix);

        sentence += decodeURIComponent(word) + ' ';

        start = start.split(',');
        start.shift();
        start.push(word);
        start = start.join(',');
    }

    return sentence;
}

function getRandomKey() {
    'use strict';

    var keys = Object.keys(memory);
    return keys[Math.floor(Math.random() * keys.length)];
}

function getRandomFromArray(arr) {
    'use strict';

    return arr[Math.floor(Math.random() * arr.length)];
}

module.exports = {
    processFile: processFile,
    memory: memory,
    randomText: randomText
}