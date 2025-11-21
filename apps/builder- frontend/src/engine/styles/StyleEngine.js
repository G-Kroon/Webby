import { CSSGenerator } from "./CSSGenerator.js";

export class StyleEngine {
  constructor(canvasCore) {
    this.canvas = canvasCore;
    this.generator = new CSSGenerator();
  }

  apply(nodeId, styleObj) {
    const node = this.canvas.findNode(nodeId);
    if (!node) return;

    Object.assign(node.styles, styleObj);
    this.canvas.events.emit("canvas:update");
  }

  exportCSS() {
    return this.generator.generate(this.canvas.nodes);
  }
}
