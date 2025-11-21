// engine/dragdrop/DragManager.js

import {
  calculateDropFromDOM,
  calculateDropFromVirtual
} from "./DropCalculator.js";

export class DragManager {
  constructor({ canvas, selection, renderer }) {
    this.canvas = canvas;                 // CanvasCore instance
    this.selection = selection;           // SelectionManager instance
    this.renderer = renderer;             // CanvasRenderer instance

    this.draggingNodeId = null;           // id of node being dragged
    this.preview = null;                  // { targetId, insertIndex, position }

    this.mode = "dom"; // 'dom' or 'virtual' — auto switch based on environment
  }

  /** Start dragging a node */
  startDrag(nodeId) {
    this.draggingNodeId = nodeId;
    this.canvas.events.emit("drag:start", { nodeId });
  }

  /**
   * Called during pointer move.
   * pointer: { x, y }
   * domRoot: DOM element of the canvas (required for DOM mode)
   * virtualNodes: virtual tree with rects (optional)
   */
  updateDrag(pointer, { domRoot = null, virtualNodes = null }) {
    if (!this.draggingNodeId) return;

    let result;

    if (domRoot) {
      // DOM-based detection
      this.mode = "dom";
      result = calculateDropFromDOM(
        domRoot,
        pointer,
        this.draggingNodeId
      );
    } else if (virtualNodes) {
      // Virtual layout detection
      this.mode = "virtual";
      result = calculateDropFromVirtual(
        virtualNodes,
        pointer,
        this.draggingNodeId
      );
    } else {
      return;
    }

    this.preview = result;

    // Tell UI to draw ghost line / insertion marker
    this.canvas.events.emit("drag:preview", result);
  }

  /**
   * Finalize drag and insert the node at target location.
   */
  endDrag() {
    if (!this.draggingNodeId) return;

    const { targetId, insertIndex } = this.preview || {
      targetId: null,
      insertIndex: -1
    };

    const draggedNode = this.canvas.findNode(this.draggingNodeId);

    if (!draggedNode) {
      this._reset();
      return;
    }

    // --- REMOVE node from its current parent ---
    this._removeNodeFromTree(draggedNode.id);

    // --- Insert into new target ---
    if (targetId) {
      const target = this.canvas.findNode(targetId);

      if (target && Array.isArray(target.children)) {
        // Ensure insertIndex is valid
        const safeIndex = Math.max(0, Math.min(insertIndex, target.children.length));
        target.children.splice(safeIndex, 0, draggedNode);
      } else {
        // Drop rejected (target not a container)
        this.canvas.addNode(draggedNode);
      }
    } else {
      // No target = add as root-level node
      this.canvas.addNode(draggedNode);
    }

    // Trigger history + re-render
    this.canvas.history.push("drag:end", {
      snapshot: JSON.parse(JSON.stringify(this.canvas.nodes))
    });
    this.canvas.events.emit("canvas:update");
    this.canvas.events.emit("drag:end");

    this._reset();
  }

  /** Remove dragged node from its current parent recursively */
  _removeNodeFromTree(nodeId) {
    const walk = (nodes) => {
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if (node.id === nodeId) {
          nodes.splice(i, 1);
          return true;
        }
        if (node.children?.length && walk(node.children)) {
          return true;
        }
      }
      return false;
    };
    walk(this.canvas.nodes);
  }

  _reset() {
    this.draggingNodeId = null;
    this.preview = null;
  }
}
