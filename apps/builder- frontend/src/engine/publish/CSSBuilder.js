// engine/publish/CSSBuilder.js
export class CSSBuilder {
  constructor(siteJSON) {
    this.siteJSON = siteJSON;
  }

  buildGlobalCSS() {
    let css = "/* GENERATED CMS CSS */\n";

    for (const page of this.siteJSON.pages)
      css += this.extractCSSFromTree(page.root);

    css += this.buildResponsive();

    return css;
  }

  extractCSSFromTree(node, css = "") {
    if (!node) return "";

    const selector = `[data-node="${node.id}"]`;
    const styleText = Object.entries(node.styles || {})
      .map(([k, v]) => `${this.camelToCSS(k)}:${v};`)
      .join("");

    css += `${selector}{${styleText}}\n`;

    for (const child of node.children || [])
      css += this.extractCSSFromTree(child);

    return css;
  }

  buildResponsive() {
    if (!this.siteJSON.breakpoints) return "";

    let css = "";

    Object.entries(this.siteJSON.breakpoints).forEach(([bp, data]) => {
      css += `@media (max-width:${bp}px){\n`;
      Object.entries(data).forEach(([nodeId, styles]) => {
        css += `[data-node="${nodeId}"]{`;
        css += Object.entries(styles)
          .map(([k, v]) => `${this.camelToCSS(k)}:${v};`)
          .join("");
        css += "}\n";
      });
      css += "}\n";
    });

    return css;
  }

  camelToCSS(str) {
    return str.replace(/[A-Z]/g, m => "-" + m.toLowerCase());
  }
}
