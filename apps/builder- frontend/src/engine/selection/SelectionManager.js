export class SelectionManager {
  constructor(canvasCore) {
    this.canvas = canvasCore;
    this.selected = null;
    this.events = canvasCore.events;
  }

  select(nodeId) {
    this.selected = this.canvas.findNode(nodeId);
    this.events.emit("selection:change", this.selected);
  }

  clear() {
    this.selected = null;
    this.events.emit("selection:clear");
  }
}
