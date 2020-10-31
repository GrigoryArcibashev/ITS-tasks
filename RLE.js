let fs = require('fs');


function getParametersOfProgram() {
	let operatingMode;
	let pathToReadableFile;
	let pathToWritableFile;

	process.argv.forEach((val, index) => {
		if (index == 2)
			operatingMode = val;
		if (index == 3)
			pathToReadableFile = val;
		if (index == 4)
			pathToWritableFile = val;
	});

	if (operatingMode != 'code' && operatingMode != 'decode') {
		console.error('ОШИБКА!\nНе указан или указан неверно режим работы программы');
		process.exit(-1);
	}
	if (pathToReadableFile == undefined || pathToWritableFile == undefined) {
		console.error('ОШИБКА!\nДолжны быть указаны пути к читаемому файлу и файлу для записи');
		process.exit(-1);
	}

	return new Array(operatingMode, pathToReadableFile, pathToWritableFile);
}

function code(text) {
	let codedText = '';
	let escapeSymbol = '#';
	let i = 0, n = 1;
	let nJump;

	while (i < text.length) {
		while (text.charAt(i) == text.charAt(i + n))
			n++;
		nJump = n;

		while (n >= 255) {
			codedText += escapeSymbol + String.fromCharCode(255) + text.charAt(i);
			n -= 255;
		}

		if (n > 3 || (n > 0 && text.charAt(i) == escapeSymbol))
			codedText += escapeSymbol + String.fromCharCode(n) + text.charAt(i);
		else
			for (j = 0; j < n; j++)
				codedText += text.charAt(i);

		i += nJump;
		n = 1;
	}

	return codedText;
}

function decode(codedText) {
	let decodedText = '';
	let escapeSymbol = '#';
	let i = 0, n = 1;

	while (i < codedText.length) {
		if (codedText.charAt(i) == escapeSymbol) {
			n = codedText.charCodeAt(i + 1);
			for (j = 0; j < n; j++)
				decodedText += codedText.charAt(i + 2);
			i += 3;
			continue;
		}
		decodedText += codedText.charAt(i);
		i++;
	}

	return decodedText;
}

function calculateCompressionRatio(originalText, codedText) {
	console.log('Коэффициент сжатия = ', originalText.length / codedText.length);
}

function perform(option, pathToReadableFile, pathToWritableFile) {
	fs.readFile(pathToReadableFile, (err, data) => {
		if (err) {
			if (err.code == 'ENOENT') {
				console.error('ОШИБКА!\nПути ' + pathToReadableFile + ' не существует');
				process.exit(-1);
			}
			if (err.code == 'EISDIR') {
				console.error('ОШИБКА!\nОжидался путь до файла\n(указан путь до каталога)');
				process.exit(-1);
			}
			if (err.code == 'EACCES') {
				console.error('ОШИБКА!\nОтказано в доступе к файлу ' + pathToReadableFile);
				process.exit(-1);
			}
		}

		let text = data.toString();
		let newText;
		if (option == 'code') {
			newText = code(text);
			calculateCompressionRatio(text, newText);
		}
		else {
			newText = decode(text);
		}
		
		fs.writeFile(pathToWritableFile, newText, (err) => {
			if (err) {
				if (err.code == 'EACCES')
					console.error('ОШИБКА!\nОтказано в доступе к файлу ' + pathToWritableFile);
				process.exit(-1);
			}
		});
	});
}

function main() {
	let parametersOfProgram = getParametersOfProgram();
	let operatingMode = parametersOfProgram[0];
	let pathToReadableFile = parametersOfProgram[1];
	let pathToWritableFile = parametersOfProgram[2];

	if (operatingMode == 'code')
		perform('code', pathToReadableFile, pathToWritableFile);
	else
		perform('decode', pathToReadableFile, pathToWritableFile);
}


main();