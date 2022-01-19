class HistoryWindow {
  constructor(button) {
    this.button = button
    this.container = document.createElement('div'); 
    this.window = document.createElement('div');
    this.windowInnerContainer = document.createElement('div');
  }

  remove() {
    this.window.remove()
  }

  init() {
    this.container.classList.add('history-container');
    this.window.classList.add('history-window');
    this.windowInnerContainer.classList.add('history-inner');
    this.container.append(this.button);
  }

  render() {
    this.window.append(this.windowInnerContainer);
    this.container.appendChild(this.window);
  }
}




export default HistoryWindow;
