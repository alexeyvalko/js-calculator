import {
  KEY_VALUES,
  DEFAULT_FONT_SIZE,
  DEFAULT_RADIO_STATE,
  PRIORITY_RANKS,
} from './config';
import autoScaleText from '../autoScaleText';
import Checkbox from '../Checkbox';
import RadioElement from '../RadioElement';
import Button from '../Button/Button';
import HistoryWindow from '../HistoryWindow/HistoryWindow';

class Calculator {
  constructor(parentElement) {
    this.rootElement = parentElement;

    this.calculator = document.createElement('div');
    this.displayContainer = document.createElement('div');
    this.keysContainer = document.createElement('div');
    this.prevItemDisplay = document.createElement('div'); // элемент для отображения предыдущих операций
    this.currentItemDisplay = document.createElement('div'); // элемент для отображения текущего значения
    this.optionsContainer = document.createElement('div');
    this.integersOption = document.createElement('div');
    this.priorityOption = document.createElement('div');
    this.checkboxElement = new Checkbox(); // чекбокс для вычеслений с приоритетом операций
    this.radioElementInt = new RadioElement( // радиоэлемент для включения режима работы c целыми числами
      'integers',
      'Int',
      !DEFAULT_RADIO_STATE,
    );
    this.radioElementDec = new RadioElement(
      'Decimals', // радиоэлемент для включения режима работы c вещественными числами
      'Dec',
      DEFAULT_RADIO_STATE,
    );

    this.button = new Button('Show history');
    this.historyWindow = new HistoryWindow(this.button.element);

    this.actualFontSize = DEFAULT_FONT_SIZE; // размер шрифта по умолчанию, если число слишком большое оно будет уменьшаться

    this.currentSymbol = null; // текущий символ операции
    this.prevNumber = null;
    this.currentNumber = null;

    this.numbersStack = []; // стэк чисел используется для вычеслений с приоритетом
    this.operandsStack = []; // стэк символов операций используется для вычеслений с приоритетом
    this.operationHistory = []; // здесь хранится история всех операций
  }

  /* генерация клавиш клавиатуры калькулятора */
  generateKeys() {
    const keys = KEY_VALUES.map((item) => {
      const key = document.createElement('button');
      key.classList.add('key');
      key.textContent = item;
      return key;
    });
    return keys;
  }

  clear() {
    this.prevItemDisplay.textContent = '';
    this.currentItemDisplay.textContent = '';
    this.currentNumber = null;
    this.actualFontSize = this.DEFAULT_FONT_SIZE;
    this.currentSymbol = '';
    this.prevNumber = null;
    this.numbersStack = [];
    this.operandsStack = [];
  }

  /* функция которая выполняет все вычесления */
  calc(currentNumber = this.currentNumber) {
    let result = +currentNumber;
    if (this.prevNumber) {
      switch (this.currentSymbol) {
        case '+':
          result = +this.prevNumber + +currentNumber;
          break;
        case '-':
          result = +this.prevNumber - +currentNumber;
          break;
        case '÷':
          result = +this.prevNumber / +currentNumber;
          break;
        case '✕':
          result = +this.prevNumber * +currentNumber;
          break;
        default:
          result = +currentNumber;
      }
      /* сохраняем текущее вычесление в массив и отображаем его */
      this.operationHistory.push(
        `${this.prevNumber} ${this.currentSymbol} ${currentNumber} = ${result}`,
      );
      this.showHistory();
    }
    /* если  радиоэлемент Int отмечен то округляем до целого числа */
    return this.radioElementInt.radio.checked ? Math.round(result) : result;
  }

  calcWithoutPriority(operand, lastNumber) {
    /* вычисление без приоритета операций */
    this.currentNumber = lastNumber;
    this.prevNumber = this.calc(this.currentNumber);
    this.currentSymbol = operand;
    this.showCalcHistoryOnDisplay(this.currentSymbol, this.currentNumber);
    this.actualFontSize = this.DEFAULT_FONT_SIZE;
    this.currentItemDisplay.textContent = '';
  }

  getResultWithoutPriority() {
    /* при нажатии на = вычисляем и отображаем результат без приоритета */
    const showValue =
      this.currentItemDisplay.textContent !== ''
        ? this.calc(parseFloat(this.currentItemDisplay.textContent, 10))
        : this.prevNumber;
    this.currentNumber = showValue;
    this.currentItemDisplay.textContent = this.currentNumber;
    this.prevItemDisplay.textContent = '';
    this.prevNumber = null;
    this.currentSymbol = '';
  }

  showCalcHistoryOnDisplay(operand, lastNumber) {
    /* отображаем историю вычислений на дисплее Калькулятора */
    const lastOperationElement = document.createElement('span');
    const lasOperandElement = document.createElement('span');
    lasOperandElement.classList.add('symbol-element');
    lastOperationElement.textContent = ` ${lastNumber}`;
    lasOperandElement.textContent = ` ${operand}`;
    lastOperationElement.insertAdjacentElement('beforeend', lasOperandElement);
    this.prevItemDisplay.appendChild(lastOperationElement);
  }

  /* вычисляем с приоритетом */
  calcWithPriority(operand, lastNumber, recCall = false) {
    const lastOperand = operand;
    const operandsStackLength = this.operandsStack.length;
    const lastOperandInStack = this.operandsStack[operandsStackLength - 1];
    const isHigherPriority =
      PRIORITY_RANKS[lastOperand] > PRIORITY_RANKS[lastOperandInStack];
    this.numbersStack.push(lastNumber);
    /* аргумент reCCall используется чтобы узнать вызвана ли наша функция рекурсивно */
    if (!recCall) {
      this.showCalcHistoryOnDisplay(lastOperand, lastNumber);
    }
    if (recCall) {
      this.prevItemDisplay.textContent = '';
      this.showCalcHistoryOnDisplay(lastOperand, lastNumber);
    }

    if (operandsStackLength === 0 || isHigherPriority) {
      this.operandsStack.push(operand);
    }

    if (operandsStackLength > 0 && !isHigherPriority) {
      this.currentSymbol = this.operandsStack.pop();
      this.currentNumber = this.numbersStack.pop();
      this.prevNumber = this.numbersStack.pop();
      const resultNumber = this.calc();
      this.calcWithPriority(lastOperand, resultNumber, true);
    }

    this.currentItemDisplay.textContent = '';
  }

  /* получаем результат при нажатии на  = с приоритетом */
  getResultWithPriority() {
    const numbersStackLength = this.numbersStack.length;
    const MIN_STACK_LENGTH = 1;
    if (this.currentItemDisplay.textContent !== '') {
      const lastNumber = parseFloat(this.currentItemDisplay.textContent, 10);
      this.numbersStack.push(lastNumber);
      this.currentItemDisplay.textContent = '';
    }

    if (numbersStackLength > MIN_STACK_LENGTH) {
      this.currentNumber = this.numbersStack.pop();
      this.prevNumber = this.numbersStack.pop();
      this.currentSymbol = this.operandsStack.pop();
      const lastNumber = this.calc();
      this.numbersStack.push(lastNumber);
      this.getResultWithPriority();
    }
    if (numbersStackLength === MIN_STACK_LENGTH) {
      this.prevItemDisplay.textContent = '';
      this.currentItemDisplay.textContent = this.numbersStack.pop();
    }
  }

  doSomeAction(value) {
    const isSymbol = /^[+\-✕÷]$/.test(value);
    const isC = value === 'C';
    const isPlusMinus = value === '±';
    const isNumberOrDot = !/^[+\-✕÷C=±]$/.test(value);
    const isEquals = value === '=';
    const lastNumber = parseFloat(this.currentItemDisplay.textContent, 10);
    /* если число или точка то просто отображаем их на дисплее калькулятора */
    if (isNumberOrDot) {
      this.showValueOnDisplay(value);
    }

    /* если символ операции то выполяем операцию */
    if (isSymbol && this.currentItemDisplay.textContent !== '') {
      if (this.checkboxElement.checkbox.checked) {
        /* если чекбокс отмечен то вычислем с проритетом */
        this.calcWithPriority(value, lastNumber);
      } else {
        this.calcWithoutPriority(value, lastNumber);
      }
    }

    /* если символ = то вычесляем и отображаем результат */
    if (isEquals) {
      if (this.checkboxElement.checkbox.checked) {
        this.getResultWithPriority();
      } else {
        this.getResultWithoutPriority();
      }
    }
    /* если ± то меняем знак числа на противоположный */
    if (isPlusMinus) {
      this.currentItemDisplay.textContent =
        this.currentItemDisplay.textContent[0] === '-'
          ? this.currentItemDisplay.textContent.slice(1)
          : `-${this.currentItemDisplay.textContent}`;
    }
    /* если кнопка C то все чистим */
    if (isC) {
      this.clear();
    }
  }

  /* если наше число очень большое, то мы уменьшм шрифт на дисплее, чтобы оно вместилось */
  scaleMainItemFontSize() {
    this.actualFontSize = autoScaleText(
      this.displayContainer.clientWidth,
      this.currentItemDisplay.clientWidth,
      this.actualFontSize,
    );
    this.currentItemDisplay.style.fontSize = `${this.actualFontSize}px`;
  }

  /* отображаем всю историю операций в отдельном окне */
  showHistory() {
    this.historyWindow.windowInnerContainer.innerHTML = '';
    const history = this.operationHistory.map((item) => {
      const el = document.createElement('div');
      el.textContent = item;
      return el;
    });
    this.historyWindow.windowInnerContainer.append(...history.reverse());
    if (this.historyWindow.windowInnerContainer.clientHeight >= 320) {
      this.historyWindow.windowInnerContainer.classList.add('scroll-y');
    }
  }

  /* отбражаем наше число или точку на дисплее */
  showValueOnDisplay(value) {
    const isDot = value === '.';
    this.scaleMainItemFontSize();
    if (isDot) {
      const isDotShown =
        this.currentItemDisplay.textContent.split('.').length > 1;
      this.currentItemDisplay.textContent +=
        isDotShown || this.radioElementInt.radio.checked ? '' : '.';
    } else {
      this.currentItemDisplay.textContent += value;
    }
  }

  addListeners() {
    /* слушатель событий для кнопок клавиатуры, при нажатии производим операцию и добовлем анимацию кнопкам */
    const mouseEventHandler = (e) => {
      const isKey = e.target.matches('.key');
      const isKeyDown = e.target.matches('.key-down');
      const targetValue = e.target.textContent;
      if (isKeyDown) {
        this.doSomeAction(targetValue);
      }
      if (isKey) {
        e.target.classList.toggle('key-down');
      }
    };

    /* слушатель для радиокнопок которые определяют режим работы */
    const integersOptionHandler = (e) => {
      if (e.target.matches('label')) {
        this.defaultRadioCheck = !this.defaultRadioCheck;
        this.radioElementInt.radio.checked = !this.defaultRadioCheck;
        this.radioElementDec.radio.checked = this.defaultRadioCheck;
      }
    };
    /* слушатель для чекбока, который включения/отключения приоритета операций */
    const priorityCheckboxHandler = () => {
      this.checkboxElement.checkbox.checked =
        !this.checkboxElement.checkbox.checked;
      this.clear();
    };

    const buttonHandler = () => {
      const isWindowOpen = this.historyWindow.container.contains(this.historyWindow.window);
      if (isWindowOpen) {
        this.historyWindow.remove();
      } else {
        this.historyWindow.render();
        this.showHistory();
      }
    };

    this.button.element.addEventListener('click', buttonHandler);
    this.checkboxElement.label.addEventListener(
      'click',
      priorityCheckboxHandler,
    );
    this.integersOption.addEventListener('click', integersOptionHandler);
    this.keysContainer.addEventListener('mousedown', mouseEventHandler);
    this.keysContainer.addEventListener('mouseup', mouseEventHandler);
  }

  /* создаем элементы которые быдут отображаться на дисплее */
  createDisplayItem(content) {
    const displayItem = document.createElement('div');
    displayItem.classList.add('display-item');
    displayItem.textContent = content;
    return displayItem;
  }

  render() {
    this.priorityOption.append(this.checkboxElement.checkboxContainer);
    this.integersOption.append(
      this.radioElementInt.radioContainer,
      this.radioElementDec.radioContainer,
    );
    this.priorityOption.classList.add('priority-option');
    this.integersOption.classList.add('integers-option');
    this.optionsContainer.classList.add('options-container');
    this.calculator.classList.add('calculator');
    this.displayContainer.classList.add('display-container');
    this.keysContainer.classList.add('keys-container');
    this.historyWindow.init();

    this.currentItemDisplay = this.createDisplayItem('');
    this.prevItemDisplay = this.createDisplayItem('');
    this.optionsContainer.append(this.priorityOption, this.integersOption);
    this.keysContainer.append(...this.generateKeys());
    this.displayContainer.append(this.currentItemDisplay, this.prevItemDisplay);
    this.calculator.append(
      this.optionsContainer,
      this.displayContainer,
      this.keysContainer,
    );
    this.rootElement.append(this.calculator, this.historyWindow.container);
    this.addListeners();
  }
}

export default Calculator;
