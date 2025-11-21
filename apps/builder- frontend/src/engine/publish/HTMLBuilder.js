// engine/publish/HTMLBuilder.js
export class HTMLBuilder {
  constructor(page, templates) {
    this.page = page;
    this.templates = templates;
  }

  build() {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>${this.page.title}</title>
</head>
<body>
${this.renderTree(this.page.root)}
</body>
</html>
    `;
  }

  renderTree(node) {
    if (!node) return "";

    const tag = node.tag || "div";
    const children = (node.children || [])
      .map(child => this.renderTree(child))
      .join("");

    const attrs = this.buildAttributes(node);

    return `<${tag} ${attrs}>${node.text || ""}${children}</${tag}>`;
  }

  buildAttributes(node) {
    const styles = this.inlineStyles(node.styles || {});
    return `style="${styles}"`;
  }

  inlineStyles(styles) {
    return Object.entries(styles)
      .map(([k, v]) => `${this.camelToCSS(k)}:${v}`)
      .join(";");
  }

  camelToCSS(str) {
    return str.replace(/[A-Z]/g, m => "-" + m.toLowerCase());
  }
}
