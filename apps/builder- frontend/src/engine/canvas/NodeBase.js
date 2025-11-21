import { uuid } from "../utils/uuid.js";

export class NodeBase {
  constructor({ id, children = [], styles = {}, attributes = {} }) {
    this.id = id || uuid();
    this.children = children;
    this.styles = styles;
    this.attributes = attributes;
  }
}
