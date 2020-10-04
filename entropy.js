let fs = require('fs');

function existsSecondArg() {
    let isArgTwo = false;
    process.argv.forEach((val, index) => {
        if (index == 2)
            isArgTwo = true;
    });

    if (!isArgTwo) {
        console.error('ОШИБКА!\nНе передан путь до файла со строкой');
        process.exit(-1);
    }
}

function calculateEntropyForStringInFile(pathToFile) {
    fs.readFile(pathToFile, (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                console.error('ОШИБКА!\nПути ' + pathToFile + ' не существует');
                process.exit(-1);
            }
            if (err.code == 'EISDIR') {
                console.error('ОШИБКА!\nОжидался путь до файла\n(указан путь до каталога)');
                process.exit(-1);
            }
            if (err.code == 'EACCES') {
                console.error('ОШИБКА!\nОтказано в доступе к файлу ' + pathToFile);
                process.exit(-1);
            }
        }

        calculateEntropyString(data.toString());
    });
}

function calculateEntropyString(string) {
    let alphabet = new Array();
    for (i = 0; i < string.length; i++)
        alphabet[string.charAt(i)] = 0;
    for (i = 0; i < string.length; i++)
        alphabet[string.charAt(i)]++;

    let powerAlphabet = 0;
    for (let i in alphabet) {
        alphabet[i] /= string.length;
        powerAlphabet++;
    }

    let entropy = 0;
    if (powerAlphabet > 1)
        for (let i in alphabet)
            entropy -= alphabet[i] * Math.log2(alphabet[i]) / Math.log2(powerAlphabet);

    console.log('Энтропия = ' + entropy.toString())
}


existsSecondArg();
calculateEntropyForStringInFile(process.argv[2]);