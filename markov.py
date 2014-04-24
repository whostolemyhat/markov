"""This module contains code from
Think Python by Allen B. Downey
http://thinkpython.com

Copyright 2012 Allen B. Downey
License: GNU GPLv3 http://www.gnu.org/licenses/gpl.html

"""

import sys
# import string
import random

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

    for i in range(n):
        suffixes = suffix_map.get(start, None)
        if suffixes == None:
            # start isn't in map
            random_text(n - i)
            return

        # choose random suffix
        word = random.choice(suffixes)
        print(word)
        start = shift(start, word)


def shift(t, word):
    """Forms tuple by removing head and adding word to tail"""
    return t[1:] + (word,)


def main(name, filename='', n=100, order=2, *args):
    try:
        n = int(n)
        order = int(order)
    except:
        print("Usage: markov.py filename [# of words] [prefix length]")
    else:
        process_file(filename, order)
        random_text(n)

if __name__ == '__main__':
    main(*sys.argv)