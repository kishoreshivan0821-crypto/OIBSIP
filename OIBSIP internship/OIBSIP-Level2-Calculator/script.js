const display = document.getElementById("display");
const expression = document.getElementById("expression");

const numberButtons = document.querySelectorAll(".number");
const operatorButtons = document.querySelectorAll(".operator");

const equalsButton = document.getElementById("equals");
const clearButton = document.getElementById("clear");
const backspaceButton = document.getElementById("backspace");
const decimalButton = document.getElementById("decimal");
const percentageButton = document.getElementById("percentage");

const historyList = document.getElementById("historyList");
const clearHistoryButton = document.getElementById("clearHistory");

let currentValue = "";
let previousValue = "";
let currentOperator = null;
let shouldResetDisplay = false;

function updateDisplay() {
    display.value = currentValue || "0";
}

numberButtons.forEach((button) => {
    button.addEventListener("click", () => {
        if (shouldResetDisplay) {
            currentValue = "";
            shouldResetDisplay = false;
        }

        currentValue += button.textContent;

        if (currentOperator !== null && previousValue !== "") {
            display.value =
                `${formatNumber(previousValue)} ${getOperatorSymbol(currentOperator)} ${currentValue}`;
        } else {
            display.value = currentValue || "0";
        }
    });
});

decimalButton.addEventListener("click", () => {
    if (shouldResetDisplay) {
        currentValue = "";
        shouldResetDisplay = false;
    }

    if (!currentValue.includes(".")) {
        currentValue = currentValue === "" ? "0." : currentValue + ".";
        updateDisplay();
    }
});

operatorButtons.forEach((button) => {
    button.addEventListener("click", () => {
        if (currentValue === "") return;

        if (currentOperator !== null) {
            calculate();
        }

        previousValue = currentValue;
        currentOperator = button.dataset.operator;
        shouldResetDisplay = true;

        expression.textContent =
            `${formatNumber(previousValue)} ${getOperatorSymbol(currentOperator)}`;
    });
});

equalsButton.addEventListener("click", () => {
    if (
        previousValue === "" ||
        currentValue === "" ||
        currentOperator === null
    ) {
        return;
    }

    const firstNumber = previousValue;
    const secondNumber = currentValue;
    const operator = currentOperator;

    const result = calculate();

    if (result !== null) {
        addToHistory(
            `${formatNumber(firstNumber)} ${getOperatorSymbol(operator)} ${formatNumber(secondNumber)}`,
            formatNumber(result)
        );
    }

    currentOperator = null;
    expression.textContent = "";
});

function calculate() {
    const firstNumber = Number(previousValue);
    const secondNumber = Number(currentValue);

    let result;

    if (currentOperator === "+") {
        result = firstNumber + secondNumber;
    } else if (currentOperator === "-") {
        result = firstNumber - secondNumber;
    } else if (currentOperator === "*") {
        result = firstNumber * secondNumber;
    } else if (currentOperator === "/") {
        if (secondNumber === 0) {
            display.value = "Cannot divide by 0";

            currentValue = "";
            previousValue = "";
            currentOperator = null;
            shouldResetDisplay = true;

            return null;
        }

        result = firstNumber / secondNumber;
    }

    currentValue = String(result);
    previousValue = "";
    shouldResetDisplay = true;

    updateDisplay();

    return result;
}

percentageButton.addEventListener("click", () => {
    if (currentValue === "") return;

    currentValue = String(Number(currentValue) / 100);
    updateDisplay();
});

clearButton.addEventListener("click", () => {
    currentValue = "";
    previousValue = "";
    currentOperator = null;
    shouldResetDisplay = false;

    expression.textContent = "";
    updateDisplay();
});

backspaceButton.addEventListener("click", () => {
    if (!shouldResetDisplay) {
        currentValue = currentValue.slice(0, -1);
        updateDisplay();
    }
});

function getOperatorSymbol(operator) {
    const symbols = {
        "+": "+",
        "-": "−",
        "*": "×",
        "/": "÷"
    };

    return symbols[operator] || operator;
}

function formatNumber(number) {
    const value = Number(number);

    if (!Number.isFinite(value)) {
        return number;
    }

    return Number.isInteger(value)
        ? String(value)
        : value.toFixed(8).replace(/0+$/, "").replace(/\.$/, "");
}

function addToHistory(calculation, result) {
    if (historyList.querySelector(".empty-history")) {
        historyList.innerHTML = "";
    }

    const item = document.createElement("div");
    item.className = "history-item";

    item.innerHTML = `
        <div class="history-expression">${calculation}</div>
        <div class="history-result">= ${result}</div>
    `;

    historyList.prepend(item);
}

clearHistoryButton.addEventListener("click", () => {
    historyList.innerHTML = `
        <p class="empty-history">No calculations yet</p>
    `;
});

updateDisplay();
const historyButton = document.getElementById("historyButton");
const historyPanel = document.querySelector(".history-panel");

historyButton.addEventListener("click", () => {
    historyPanel.classList.toggle("show-history");
});