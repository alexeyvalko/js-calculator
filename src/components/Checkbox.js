class Checkbox {
  constructor() {
    this.checkbox = document.createElement('input');
    this.checkbox.type = 'checkbox';
    this.checkbox.classList.add('checkbox');
    this.checkbox.id = 'check';

    this.label = document.createElement('label');
    this.label.classList.add('checkbox-label');
    this.label.for = 'check';
    this.label.textContent = 'P';

    this.checkboxContainer = document.createElement('div');
    this.checkboxContainer.append(this.checkbox, this.label)
  }
}

export default Checkbox;
