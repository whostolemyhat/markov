"""This module contains code from
Think Python by Allen B. Downey
http://thinkpython.com

Copyright 2012 Allen B. Downey
License: GNU GPLv3 http://www.gnu.org/licenses/gpl.html

"""

import sys
import random
import json

suffix_map = {}
prefix = ()

def process_file(filename, order=2):
    """Reads a file and performs Markov analysis"""

    fp = open(filename)
    # already processed file
    # skip_gutenberg_header(fp)

    for line in fp:
        for word in line.rstrip().split():
            process_word(word, order)


def skip_gutenberg_header(fp):
    for line in fp:
        if line.startswith('*END*THE SMALL PRINT!'):
            break


def process_word(word, order=2):
    """Processes words; first iterations store words while later ones add entries to dictionary"""
    global prefix
    if len(prefix) < order:
        prefix += (word,)
        return

    try:
        suffix_map[prefix].append(word)
    except KeyError:
        # if no entry, create one
        suffix_map[prefix] = [word]

    prefix = shift(prefix, word)


def random_text(n=100):
    """Generates random words from analysed text"""
    # choose random prefix
    start = random.choice(list(suffix_map.keys()))
    sentence = ''

    for i in range(n):
        suffixes = suffix_map.get(start, None)
        if suffixes == None:
            # start isn't in map
            random_text(n - i)
            return

        # choose random suffix
        word = random.choice(suffixes)
        # print(word)
        sentence += '%s ' % word
        start = shift(start, word)

    return sentence


def shift(t, word):
    """Forms tuple by removing head and adding word to tail"""
    return t[1:] + (word,)


def main(name, filename='', n=100, order=2, sentences=10, *args):
    try:
        n = int(n)
        order = int(order)
        sentences = int(sentences)
    except:
        print("Usage: markov.py filename [# of words] [prefix length] [sentences to save]")
    else:
        process_file(filename, order)

        # generate a few sentences and save to json
        out = {}
        lines = []
        for i in range(sentences):
            sentence = random_text(n)
            print(sentence)
            lines.append(sentence)
        out['sentences'] = lines

        output = open('sentences.json', 'w')
        output.write(json.dumps(out))
        output.close()


if __name__ == '__main__':
    main(*sys.argv)