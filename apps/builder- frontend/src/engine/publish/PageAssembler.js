// engine/publish/PageAssembler.js
export class PageAssembler {
  assemble({ html, css, page, tenantId }) {
    return html.replace("</head>", `
<style>${css}</style>
</head>
    `);
  }
}
