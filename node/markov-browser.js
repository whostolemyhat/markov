// split text into words
// loop
// while i < order, start creating array
// once we have 2 words (if order=2), this becomes the key
// key = join words with , ie once upon = 'once,upon'
// if key in memory
// append the next word
// else create the key, append next word
// so memory = {}
// key: 'once,upon' : ['a', 'the', 'a']


// encodeURIComponent - used to escape punctuation in src
var markov = (function() {
    'use strict';
    var prefix = [];
    var memory = {};

    /**
    * Strips punctuation and trims whitespace from a word
    * @param word [string]
    * @return [string]
    */
    // function removePunctuation(word) {
    //     // punctuation
    //     var punctRE = /[\u2000-\u206F\u2E00-\u2E7F\\'!"#\$%&\(\)\*\+,\-\.\/:;<=>\?@\[\]\^_`\{\|\}~]/g;
    //     // spaces
    //     var spaceRE = /\s+/g;

    //     return word.replace(punctRE, '').replace(spaceRE, '');
    // }

    function processFile(filename, order) {
        order = order || 2;

        // TODO: open file
        var words = filename;
        words = words.split(' ');

        words.forEach(function(word) {
            // processWord(removePunctuation(word).toLowerCase().trim(), order);
            processWord(encodeURIComponent(word).trim(), order);
        }, this);
    }

    function processWord(word, order) {
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
        if(!memory[key]) {
            memory[key] = [];
        }

        memory[key].push(value);
    }

    function randomText(n) {
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
        var keys = Object.keys(memory);
        return keys[Math.floor(Math.random() * keys.length)];
    }

    function getRandomFromArray(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    return {
        processFile: processFile,
        memory: memory,
        randomText: randomText
    };
})();

var words = "You will rejoice to hear that no disaster has accompanied the commencement of an enterprise which you have regarded with such evil forebodings.  I arrived here yesterday, and my first task is to assure my dear sister of my welfare and increasing confidence in the success of my undertaking.  I am already far north of London, and as I walk in the streets of Petersburgh, I feel a cold northern breeze play upon my cheeks, which braces my nerves and fills me with delight.  Do you understand this feeling?  This breeze, which has travelled from the regions towards which I am advancing, gives me a foretaste of those icy climes. Inspirited by this wind of promise, my daydreams become more fervent and vivid.  I try in vain to be persuaded that the pole is the seat of frost and desolation; it ever presents itself to my imagination as the region of beauty and delight.  There, Margaret, the sun is forever visible, its broad disk just skirting the horizon and diffusing a perpetual splendour.  There--for with your leave, my sister, I will put some trust in preceding navigators--there snow and frost are banished; and, sailing over a calm sea, we may be wafted to a land surpassing in wonders and in beauty every region hitherto discovered on the habitable globe.  Its productions and features may be without example, as the phenomena of the heavenly bodies undoubtedly are in those undiscovered solitudes.  What may not be expected in a country of eternal light?  I may there discover the wondrous power which attracts the needle and may regulate a thousand celestial observations that require only this voyage to render their seeming eccentricities consistent forever.  I shall satiate my ardent curiosity with the sight of a part of the world never before visited, and may tread a land never before imprinted by the foot of man. These are my enticements, and they are sufficient to conquer all fear of danger or death and to induce me to commence this laborious voyage with the joy a child feels when he embarks in a little boat, with his holiday mates, on an expedition of discovery up his native river. But supposing all these conjectures to be false, you cannot contest the inestimable benefit which I shall confer on all mankind, to the last generation, by discovering a passage near the pole to those countries, to reach which at present so many months are requisite; or by ascertaining the secret of the magnet, which, if at all possible, can only be effected by an undertaking such as mine.  These reflections have dispelled the agitation with which I began my letter, and I feel my heart glow with an enthusiasm which elevates me to heaven, for nothing contributes so much to tranquillize the mind as a steady purpose--a point on which the soul may fix its intellectual eye.  This expedition has been the favourite dream of my early years. I have read with ardour the accounts of the various voyages which have been made in the prospect of arriving at the North Pacific Ocean through the seas which surround the pole.  You may remember that a history of all the voyages made for purposes of discovery composed the whole of our good Uncle Thomas' library.  My education was neglected, yet I was passionately fond of reading.  These volumes were my study day and night, and my familiarity with them increased that regret which I had felt, as a child, on learning that my father's dying injunction had forbidden my uncle to allow me to embark in a seafaring life.  These visions faded when I perused, for the first time, those poets whose effusions entranced my soul and lifted it to heaven.  I also became a poet and for one year lived in a paradise of my own creation; I imagined that I also might obtain a niche in the temple where the names of Homer and Shakespeare are consecrated.  You are well acquainted with my failure and how heavily I bore the disappointment. But just at that time I inherited the fortune of my cousin, and my thoughts were turned into the channel of their earlier bent.  Six years have passed since I resolved on my present undertaking.  I can, even now, remember the hour from which I dedicated myself to this great enterprise.  I commenced by inuring my body to hardship.  I accompanied the whale-fishers on several expeditions to the North Sea; I voluntarily endured cold, famine, thirst, and want of sleep; I often worked harder than the common sailors during the day and devoted my nights to the study of mathematics, the theory of medicine, and those branches of physical science from which a naval adventurer might derive the greatest practical advantage.  Twice I actually hired myself as an under-mate in a Greenland whaler, and acquitted myself to admiration. I must own I felt a little proud when my captain offered me the second dignity in the vessel and entreated me to remain with the greatest earnestness, so valuable did he consider my services.  And now, dear Margaret, do I not deserve to accomplish some great purpose?  My life might have been passed in ease and luxury, but I preferred glory to every enticement that wealth placed in my path.  Oh, that some encouraging voice would answer in the affirmative!  My courage and my resolution is firm; but my hopes fluctuate, and my spirits are often depressed.  I am about to proceed on a long and difficult voyage, the emergencies of which will demand all my fortitude:  I am required not only to raise the spirits of others, but sometimes to sustain my own, when theirs are failing. ";

markov.processFile(words, 2);
console.log(markov.memory);
console.log(markov.randomText(100));