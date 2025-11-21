import { NodeBase } from "../NodeBase.js";

export class TextNode extends NodeBase {
  constructor({ text = "Text", ...rest }) {
    super(rest);
    this.text = text;
    this.tag = "p";
  }
}
