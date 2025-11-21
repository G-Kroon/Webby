export class ResizeManager {
  constructor(canvasCore) {
    this.canvas = canvasCore;
    this.node = null;
  }

  start(nodeId) {
    this.node = this.canvas.findNode(nodeId);
  }

  update({ width, height }) {
    if (!this.node) return;
    this.node.styles.width = width + "px";
    this.node.styles.height = height + "px";
    this.canvas.events.emit("canvas:update");
  }

  end() {
    this.node = null;
  }
}
