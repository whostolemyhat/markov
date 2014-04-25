import string

def readlines(file):
    """Reads lines in a file and returns dict containing unique words and frequency of use"""

    word_frequency = {}

    for line in file:
        line = file.readline()
        words = line.strip().lower().split()

        for word in words:
            word = remove_punctuation(word)

            if word in word_frequency:
                word_frequency[word] += 1
            else:
                word_frequency[word] = 1

    return word_frequency

def remove_punctuation(word):
    for letter in string.punctuation:
        word = word.replace(letter, "")

    return word

if __name__ == '__main__':
    file = open('frankenstein.txt')
    words = readlines(file)

    output = open('output.html', 'w')
    output.write('<h2>%s unique words</h2>' % len(words))
    output.write('<h2>%s total words</h2>' % sum(words.values()))

    output.write('<table>')

    for word in sorted(words, key=words.get, reverse=True):
        # print(word, words[word])
        output.write('<tr><td>%s</td><td>%s</td></tr>' % (word, words[word]))

    output.write('</table>')
