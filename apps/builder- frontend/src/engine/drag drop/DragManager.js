export class DragManager {
  constructor(canvasCore, selectionManager) {
    this.canvas = canvasCore;
    this.selection = selectionManager;
    this.draggingNodeId = null;
  }

  startDrag(nodeId) {
    this.draggingNodeId = nodeId;
  }

  endDrag(targetContainerId) {
    if (!this.draggingNodeId) return;

    const node = this.canvas.findNode(this.draggingNodeId);
    const target = this.canvas.findNode(targetContainerId);

    if (target && target.children) {
      target.children.push(node);
      this.canvas.events.emit("canvas:update");
    }

    this.draggingNodeId = null;
  }
}
