export class CanvasRenderer {
  constructor(canvasCore) {
    this.core = canvasCore;
  }

  renderToDOM(domRoot) {
    domRoot.innerHTML = "";
    this.core.nodes.forEach(node => {
      domRoot.appendChild(this.renderNode(node));
    });
  }

  renderNode(node) {
    const el = document.createElement(node.tag);

    // apply styles
    for (const [k, v] of Object.entries(node.styles || {})) {
      el.style[k] = v;
    }

    // attributes
    for (const [k, v] of Object.entries(node.attributes || {})) {
      el.setAttribute(k, v);
    }

    // content
    if (node.text) el.textContent = node.text;

    // children
    if (node.children?.length) {
      node.children.forEach(child => {
        el.appendChild(this.renderNode(child));
      });
    }

    return el;
  }
}
