window.onload = function() {
    const display = document.querySelector('.display');
    let currentInput = '';
    let operator = '';
    let result = null;
    let justPressedOperator = false;

    function updateDisplay(value) {
        // If it's a float, limit to 7 decimal places max
        if (typeof value === 'number') {
            if (!Number.isInteger(value)) {
                value = parseFloat(value.toFixed(7));
            }
        }
        display.textContent = value;
    }
    
    function calculate(a, b, op) {
        let res;
        switch (op) {
            case '+': res = a + b; break;
            case '-': res = a - b; break;
            case '*': res = a * b; break;
            case '/': res = a / b; break;
        }
        // Limit result to prevent overflow
        return parseFloat(res.toFixed(7));
    }

    function inputNumber(value) {
        if (justPressedOperator) {
            currentInput = '';
            justPressedOperator = false;
        }
        // Prevent multiple decimals
        if (value === '.' && currentInput.includes('.')) return;

        currentInput += value;
        updateDisplay(currentInput || '0');
    }

    // Number and dot buttons
    document.querySelectorAll('.number').forEach(button => {
        button.addEventListener('click', () => {
            inputNumber(button.textContent);
        });
    });

    // Operator buttons
    const operatorButtons = {
        'add': '+',
        'subtract': '-',
        'multiply': '*',
        'divide': '/'
    };

    Object.keys(operatorButtons).forEach(id => {
        document.getElementById(id).addEventListener('click', () => {
            handleOperator(operatorButtons[id]);
        });
    });

    function handleOperator(op) {
        if (currentInput === '' && result === null) return;

        if (justPressedOperator) {
            operator = op; // Only switch the operator if pressed again
        } else {
            if (result === null) {
                result = parseFloat(currentInput);
            } else if (currentInput !== '') {
                result = calculate(result, parseFloat(currentInput), operator);
                updateDisplay(result);
            }
            operator = op;
            justPressedOperator = true;
        }
    }

    // Equal (=)
    document.getElementById('result').addEventListener('click', () => {
        if (currentInput !== '' && operator) {
            result = calculate(result, parseFloat(currentInput), operator);
            updateDisplay(result);
            currentInput = '';
            operator = '';
            justPressedOperator = false;
        }
    });

    // Clear (AC)
    document.getElementById('clear').addEventListener('click', () => {
        currentInput = '';
        operator = '';
        result = null;
        justPressedOperator = false;
        updateDisplay('0');
    });

    // Toggle Sign (+/-)
    document.getElementById('sign').addEventListener('click', () => {
        if (currentInput) {
            currentInput = (parseFloat(currentInput) * -1).toString();
            updateDisplay(currentInput);
        }
    });

    // Percentage (%)
    document.getElementById('percent').addEventListener('click', () => {
        if (currentInput) {
            currentInput = (parseFloat(currentInput) / 100).toString();
            updateDisplay(currentInput);
        }
    });

    // Calculation logic
    function calculate(a, b, op) {
        switch (op) {
            case '+': return a + b;
            case '-': return a - b;
            case '*': return a * b;
            case '/': return a / b;
        }
    }

    // Keyboard Support
    document.addEventListener('keydown', (e) => {
        if (!isNaN(e.key)) {
            inputNumber(e.key);
        } else if (e.key === '.') {
            inputNumber('.');
        } else if (['+', '-', '*', '/'].includes(e.key)) {
            handleOperator(e.key);
        } else if (e.key === 'Enter' || e.key === '=') {
            e.preventDefault();
            document.getElementById('result').click();
        } else if (e.key === 'Backspace') {
            if (!justPressedOperator) {
                currentInput = currentInput.slice(0, -1);
                updateDisplay(currentInput || '0');
            }
        } else if (e.key === 'Escape') {
            document.getElementById('clear').click();
        }
    });

    // Initial display
    updateDisplay('0');
};
