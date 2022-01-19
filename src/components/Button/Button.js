class Button {
  constructor(text) {
    this.element = document.createElement('div');
    this.element.classList.add('button');
    this.element.textContent = text;
  }
}

export default Button;
