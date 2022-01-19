class RadioElement {
  constructor(name, text, defaultCheck) {
    this.radio = document.createElement('input');
    this.radio.type = 'radio';
    this.radio.classList.add('radio-element');
    this.radio.id = `${name}-${text}`;
    this.radio.name = name;
    this.radio.checked = defaultCheck;
    this.label = document.createElement('label');
    this.label.classList.add('radio-label');
    this.label.setAttribute('for', `${name}-${text}`);
    this.label.textContent = text;
    this.label.appendChild(this.radio);

    this.radioContainer = document.createElement('div')
    this.radioContainer.classList.add('radio-container')
    this.radioContainer.append(this.radio, this.label);
  }
}

export default RadioElement;
