const fs = require('fs');


function getFrequencyAlphabet() {
    let frequencyAlphabet = new Array();
    let alphabet = fs.readFileSync('alphabet.txt', 'utf8').split('\r\n');
    for (let i = 0; i < alphabet.length; i++) {
        let letter = alphabet[i].split(' ')[0];
        let frequency = alphabet[i].split(' ')[1];
        frequencyAlphabet[letter] = parseFloat(frequency);
    }

    return frequencyAlphabet;
}

function getFrequencyCipheredString(cipheredString) {
    let frequencyCipheredString = new Array();
    for (let i = 0; i < 26; i++)
        frequencyCipheredString[String.fromCharCode('a'.charCodeAt(0) + i)] = 0;

    let countOfLetters = 0;
    for (let i = 0; i < cipheredString.length; i++) {
        let currentSymbol = cipheredString[i].toLowerCase();
        if (currentSymbol.charCodeAt(0) < 'a'.charCodeAt(0) || currentSymbol.charCodeAt(0) > 'z'.charCodeAt(0))
            continue;
        frequencyCipheredString[currentSymbol]++;
        countOfLetters++;
    }

    for (let i = 0; i < 26; i++)
        frequencyCipheredString[String.fromCharCode('a'.charCodeAt(0) + i)] =
            frequencyCipheredString[String.fromCharCode('a'.charCodeAt(0) + i)]
            / countOfLetters
            * 100;

    return frequencyCipheredString;
}

function determineShift(frequencyAlphabet, frequencyCipheredString) {
    let shift = 0;
    let minDifference = getSumOfSquaresOfFrequencyDifference(frequencyAlphabet, frequencyCipheredString, 0);
    for (let i = 1; i < 26; i++) {
        let currentDifference = getSumOfSquaresOfFrequencyDifference(frequencyAlphabet, frequencyCipheredString, i);
        if (currentDifference < minDifference) {
            minDifference = currentDifference;
            shift = i;
        }
    }

    return shift;
}

function decipher(cipheredString, shift) {
    let decipheredString = "";
    for (let i = 0; i < cipheredString.length; i++) {
        let currentSymbol = cipheredString[i].toLowerCase();
        if (currentSymbol.charCodeAt(0) < 'a'.charCodeAt(0) || currentSymbol.charCodeAt(0) > 'z'.charCodeAt(0)) {
            decipheredString += currentSymbol;
            continue;
        }
        let additionalShift = 0;
        if (currentSymbol.charCodeAt(0) > cipheredString[i].charCodeAt(0))
            additionalShift = 'A'.charCodeAt(0) - 'a'.charCodeAt(0);
        let codeOfCurrentSymbol = 'a'.charCodeAt(0)
            + additionalShift
            + (currentSymbol.charCodeAt(0) - 'a'.charCodeAt(0) + (26 - shift)) % 26;
        decipheredString += String.fromCharCode(codeOfCurrentSymbol);
    }

    fs.writeFileSync('deciphered.txt', decipheredString);
}

function getSumOfSquaresOfFrequencyDifference(frequencyAlphabet, frequencyCipheredString, shift) {
    let sum = 0
    for (let i = 0; i < 26; i++)
        sum += Math.pow(
            frequencyAlphabet[String.fromCharCode('a'.charCodeAt(0) + i)]
            - frequencyCipheredString[String.fromCharCode('a'.charCodeAt(0) + (i + shift) % 26)], 2);
    return sum;
}

function main() {
    //зашифрованный текст
    let cipheredString = fs.readFileSync('ciphered.txt', 'utf8');
    //задаем массив частот для алфавита
    let frequencyAlphabet = getFrequencyAlphabet();
    //задаем массив частот для строки
    let frequencyCipheredString = getFrequencyCipheredString(cipheredString);
    //находим сдвиг
    let shift = determineShift(frequencyAlphabet, frequencyCipheredString);
    //расшифровка
    decipher(cipheredString, shift);
}


main();