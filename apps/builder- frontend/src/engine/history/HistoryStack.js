export class HistoryStack {
  constructor() {
    this.stack = [];
    this.index = -1;
  }

  push(action, payload) {
    this.stack = this.stack.slice(0, this.index + 1);
    this.stack.push({ action, payload });
    this.index++;
  }

  undo() {
    if (this.index <= 0) return null;
    this.index--;
    return this.stack[this.index].payload.snapshot;
  }

  redo() {
    if (this.index >= this.stack.length - 1) return null;
    this.index++;
    return this.stack[this.index].payload.snapshot;
  }
}
