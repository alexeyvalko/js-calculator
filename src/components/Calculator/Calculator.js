import { keyValues } from './config';

class Calculator {
  constructor(parentElement) {
    this.rootElement = parentElement;
    this.calculator = document.createElement('div');
    this.displayContainer = document.createElement('div');
    this.keysContainer = document.createElement('div');
  }

  generateKeys() {
    const keys = keyValues.map((item) => {
      const key = document.createElement('button');
      key.classList.add('key');
      key.textContent = item;
      return key;
    });
    this.keysContainer.append(...keys);
  }

  addListeners() {
    const mouseEventHandler = (e) => {
      const isKey = e.target.matches('.key');
      if (isKey) {
        e.target.classList.toggle('key-down');
      }
    };
    this.keysContainer.addEventListener('mousedown', mouseEventHandler);
    this.keysContainer.addEventListener('mouseup', mouseEventHandler);
  }

  render() {
    this.generateKeys();
    this.calculator.classList.add('calculator');
    this.displayContainer.classList.add('display-container');
    this.keysContainer.classList.add('keys-container');
    this.calculator.append(this.displayContainer, this.keysContainer);
    this.rootElement.append(this.calculator);
    this.addListeners();
  }
}

export default Calculator;
