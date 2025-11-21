import { EventBus } from "../events/EventBus.js";
import { NodeRegistry } from "./NodeRegistry.js";
import { deepClone } from "../utils/deepClone.js";

export class CanvasCore {
  constructor() {
    this.nodes = [];        // top-level nodes
    this.registry = new NodeRegistry();
    this.events = new EventBus();
    this.history = null;    // will be injected later
  }

  init(historyStack) {
    this.history = historyStack;
  }

  addNode(node) {
    this.nodes.push(node);
    this.history.push("addNode", { snapshot: deepClone(this.nodes) });
    this.events.emit("canvas:update");
  }

  removeNode(id) {
    this.nodes = this.nodes.filter(n => n.id !== id);
    this.history.push("removeNode", { snapshot: deepClone(this.nodes) });
    this.events.emit("canvas:update");
  }

  findNode(id) {
    const walk = (tree) => {
      for (const node of tree) {
        if (node.id === id) return node;
        if (node.children?.length) {
          const found = walk(node.children);
          if (found) return found;
        }
      }
      return null;
    };
    return walk(this.nodes);
  }
  }
            
