import { NodeBase } from "../NodeBase.js";

export class ContainerNode extends NodeBase {
  constructor(rest) {
    super(rest);
    this.tag = "div";
  }
}
