const fs = require('fs');

function getParametersOfProgram() {
    let pathToFileWithString;
    let pathToWritableFile;
    let substring;
    let algorithm;
    process.argv.forEach((val, index) => {
        if (index == 2)
            pathToFileWithString = val;
        if (index == 3)
            pathToWritableFile = val;
        if (index == 4)
            substring = val;
        if (index == 5)
            algorithm = val;
    });

    if (!pathToFileWithString) {
        console.error('ERROR!\nThe path to the readable file was not specified');
        process.exit(-1);
    }
    if (!pathToWritableFile) {
        console.error('ERROR!\nThe path to the writable file was not specified');
        process.exit(-1);
    }
    if (!substring) {
        console.error('ERROR!\nThe substring was not specified');
        process.exit(-1);
    }
    if (!algorithm) {
        console.error('ERROR!\nThe search algorithm is not specified');
        process.exit(-1);
    }

    return new Array(pathToFileWithString, pathToWritableFile, substring, algorithm);
}

function findAllOccurrencesOfSubstringInString(pathToFileWithString, pathToWritableFile, substring, algorithm) {
    fs.readFile(pathToFileWithString, (err, data) => {
        if (err) {
            if (err.code == 'ENOENT') {
                console.error('ERROR!\nThe path ' + pathToFileWithString + ' does not exist');
                process.exit(-1);
            }
            if (err.code == 'EISDIR') {
                console.error('ERROR!\nPath to file expected\n(the path to the directory is specified)');
                process.exit(-1);
            }
            if (err.code == 'EACCES') {
                console.error('ERROR!\nAccess is denied to the file ' + pathToFileWithString);
                process.exit(-1);
            }
        }
        let occurrences;
        if (algorithm == "BF") {
            let startBF = new Date();
            occurrences = findSubstringByBruteForce(data.toString(), substring);
            let endBF = new Date();
            console.log("Operating time of BRUTE FORCE: ", endBF - startBF, " milliseconds");
        }
        else if (algorithm == "HS") {
            let startHS = new Date();
            occurrences = findSubstringByHash(data.toString(), substring);
            let endHS = new Date();
            console.log("Operating time of HASH: ", endHS - startHS, " milliseconds");
        }
        else {
            console.error('ERROR!\nUnknown algorithm');
            process.exit(-1);
        }

        let indexs = "";
        for (let i = 0; i < occurrences.length; i++)
            indexs += occurrences[i] + '\n';

        fs.writeFile(pathToWritableFile, indexs, (err) => {
            if (err) {
                if (err.code == 'EACCES')
                    console.error('ERROR!\nAccess is denied to the file ' + pathToWritableFile);
                process.exit(-1);
            }
        });
    })
}

function findSubstringByBruteForce(string, substring) {
    let occurrences = new Array();
    for (let i = 0; i < string.length - substring.length + 1; i++) {
        for (let j = 0; j < substring.length; j++) {
            if (string[i + j] != substring[j])
                break;
            if (j == substring.length - 1)
                occurrences.push(i + 1);
        }
    }
    return occurrences;
}

function findSubstringByHash(string, substring) {
    let occurrences = new Array();
    hashOfSubstring = 0;
    hashOfString = 0;
    for (let i = 0; i < substring.length; i++) {
        hashOfString += string.charCodeAt(i) * Math.pow(2, substring.length - i - 1);
        hashOfSubstring += substring.charCodeAt(i) * Math.pow(2, substring.length - i - 1);;
    }

    for (let i = 0; i < string.length - substring.length + 1; i++) {
        if (hashOfSubstring == hashOfString) {
            for (let j = 0; j < substring.length; j++) {
                if (string[i + j] != substring[j])
                    break;
                if (j == substring.length - 1)
                    occurrences.push(i + 1);
            }
        }
        hashOfString = (hashOfString - string.charCodeAt(i) * Math.pow(2, substring.length - 1)) * 2
            + string.charCodeAt(i + substring.length);
    }
    return occurrences;
}

function main() {
    let parametersOfProgram = getParametersOfProgram();
    let pathToFileWithString = parametersOfProgram[0];
    let pathToWritableFile = parametersOfProgram[1];
    let substring = parametersOfProgram[2];
    let algorithm = parametersOfProgram[3];
    findAllOccurrencesOfSubstringInString(pathToFileWithString, pathToWritableFile, substring, algorithm);
}


main();