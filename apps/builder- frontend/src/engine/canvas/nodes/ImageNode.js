import { NodeBase } from "../NodeBase.js";

export class ImageNode extends NodeBase {
  constructor({ src = "https://placehold.co/300", ...rest }) {
    super(rest);
    this.attributes = { src };
    this.tag = "img";
  }
}
