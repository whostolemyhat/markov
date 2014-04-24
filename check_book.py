"""This module contains code from
Think Python by Allen B. Downey
http://thinkpython.com

Copyright 2012 Allen B. Downey
License: GNU GPLv3 http://www.gnu.org/licenses/gpl.html

"""

import string
import random


def process_file(filename, skip_header):
    """Creates histogram of words in file.

    filename: string
    skip_header: bool; whether to skip header from Gutenburg
    returns map of word to frequency
    """

    hist = {}
    fp = open(filename)
    
    if(skip_header):
        skip_gutenburg_header(fp)

    for line in fp:
        process_line(line, hist)

    return hist


def skip_gutenburg_header(file):
    """Reads through file until it reaches the end of the header"""

    for line in file:
        if line.startswith('*END* THE SMALL PRINT!'):
            break


def process_line(line, hist):
    """Adds words from the line to the histogram."""

    line = line.replace('-', ' ')

    for word in line.split():
        word = word.strip(string.punctuation + string.whitespace).lower()

        # update hist - provide default if word doesn't already exist in dict
        hist[word] = hist.get(word, 0) + 1


def total_words(hist):
    """Returns total of frequencies"""
    return sum(hist.values())


def different_words(hist):
    """Returns unique words in hist"""
    return len(hist)


def most_common(hist):
    """Makes a list of key-value pairs from histogram and sorts in descending order by frequency"""
    t = []
    for key, value in hist.items():
        t.append( (value, key) )

    t.sort()
    t.reverse()
    return t


def subtract(dict1, dict2):
    """Returns a dict containing keys which appear in dict1 but not dict2"""
    result = {}

    for key in dict1:
        if key not in dict2:
            result[key] = dict1[key]
    return result


def random_word(hist):
    """Chooses a random word from histogram proportional to word frequency"""
    t = []
    for word, freq in hist.items():
        t.extend([word] * freq)

    return random.choice(t)


if __name__ == '__main__':
    # list of common words to skip
    boring_words = ['the', 'and', 'i', 'of', 'to', 'my', 'a', 'in', 'was', 'that', 'me', 'but', 'had', 'with', 'he', 'you', 'which', 'it', 'his', 'as']
    hist = process_file('frankenstein.txt', skip_header=False)
    
    print('Total words: %s' % total_words(hist))
    print('Unique words: %s' % different_words(hist))

    t = most_common(hist)
    print('Twenty most common words:')
    for freq, word in t[0:20]:
        print('%s\t%s' % (word, freq))

    print('Skipping boring words:')
    interesting = subtract(hist, boring_words)
    interesting_list = most_common(interesting)
    for freq, word in interesting_list[0:20]:
        print('%s\t%s' % (word, freq))

    words = process_file('words.txt', skip_header=False)

    diff = subtract(hist, words)
    print("The words in the book which aren't in the word list are:")
    for word in diff.keys():
        print(word,)

    print("\n\nHere are some random words from the book:")
    for i in range(100):
        print(random_word(hist))