export class CSSGenerator {
  generate(nodes) {
    let css = "";
    const walk = (node) => {
      css += `#${node.id} {`;
      for (const [k, v] of Object.entries(node.styles || {})) {
        css += `${k}:${v};`;
      }
      css += `}\n`;

      node.children?.forEach(walk);
    };
    nodes.forEach(walk);
    return css;
  }
}
