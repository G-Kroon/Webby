import { TextNode } from "./nodes/TextNode.js";
import { ImageNode } from "./nodes/ImageNode.js";
import { ContainerNode } from "./nodes/ContainerNode.js";
import { ButtonNode } from "./nodes/ButtonNode.js";

export class NodeRegistry {
  constructor() {
    this.map = {
      text: TextNode,
      image: ImageNode,
      container: ContainerNode,
      button: ButtonNode
    };
  }

  create(type, data = {}) {
    const Ctor = this.map[type];
    return new Ctor(data);
  }
}
