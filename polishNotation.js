function convertToReversePolishNotation(expression) {
    let output = new Array();
    let operatorStack = new Array();
    let prioritiesOfOperators = new Array();
    prioritiesOfOperators['+'] = 0;
    prioritiesOfOperators['-'] = 0;
    prioritiesOfOperators['*'] = 1;
    prioritiesOfOperators['/'] = 1;
    prioritiesOfOperators['^'] = 2;

    for (let i = 0; i < expression.length; i++) {
        if (isDigit(expression[i])) {
            output.push(expression[i]);
            continue;
        }

        if (expression[i] == '(') {
            operatorStack.push('(');
            continue;
        }

        if (expression[i] == ')') {
            while (operatorStack[operatorStack.length - 1] != '(')
                output.push(operatorStack.pop());
            operatorStack.pop();
            continue;
        }

        if (prioritiesOfOperators[expression[i]] == 2) {
            operatorStack.push('^');
            continue;
        }

        while (operatorStack.length > 0
            && prioritiesOfOperators[operatorStack[operatorStack.length - 1]] >= prioritiesOfOperators[expression[i]])
            output.push(operatorStack.pop());
        operatorStack.push(expression[i]);
    }

    while (operatorStack.length > 0)
        output.push(operatorStack.pop());

    return output;
}

function isDigit(char) {
    return char >= '0' && char <= '9';
}

function main() {
    // тестики для отладки
    let tests = new Array(
        [], // => empty
        [1, "+", 2], // => 1 2 +
        [1, "*", 3], // => 1 3 *
        [2, "+", "(", 3, "*", 4, ")"], // => 2 3 4 * +
        ["(", 2, "+", 3, ")", "*", 4], // => 2 3 + 4 *
        [3, "+", 4, "*", 2, "/", "(", 1, "-", 5, ")", "^", 2], // => 3 4 2 * 1 5 - 2 ^ / +
        ["(", 1, "+", 2, ")", "*", 4, "+", 3] // => 1 2 + 4 * 3 +
    );

    tests.forEach((element) => {
        console.log(`Infix: ${element.join(' ')} => RPN: ${convertToReversePolishNotation(element).join(' ')}`);
    }); 
}


main()