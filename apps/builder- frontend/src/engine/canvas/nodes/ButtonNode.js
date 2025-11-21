import { NodeBase } from "../NodeBase.js";

export class ButtonNode extends NodeBase {
  constructor({ text = "Click Me", ...rest }) {
    super(rest);
    this.tag = "button";
    this.text = text;
  }
}
