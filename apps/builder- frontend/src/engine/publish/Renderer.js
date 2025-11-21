// engine/publish/Renderer.js
import { HTMLBuilder } from "./HTMLBuilder.js";
import { CSSBuilder } from "./CSSBuilder.js";
import { AssetBundler } from "./AssetBundler.js";
import { PageAssembler } from "./PageAssembler.js";
import { SitemapGenerator } from "./SitemapGenerator.js";
import { RobotsGenerator } from "./RobotsGenerator.js";

export class Renderer {
  constructor({ tenantId, siteJSON, assets, templates }) {
    this.tenantId = tenantId;
    this.siteJSON = siteJSON;
    this.assets = assets; 
    this.templates = templates;
  }

  async render() {
    const pages = this.siteJSON.pages;
    const css = new CSSBuilder(this.siteJSON).buildGlobalCSS();

    const renderedPages = {};

    for (const page of pages) {
      const html = new HTMLBuilder(page, this.templates).build();
      const finalHTML = new PageAssembler().assemble({
        html,
        css,
        page,
        tenantId: this.tenantId
      });

      renderedPages[page.slug] = finalHTML;
    }

    const assetMap = await new AssetBundler(this.assets, this.tenantId).process();
    const sitemap = new SitemapGenerator().build(pages);
    const robots = new RobotsGenerator().build();

    return {
      pages: renderedPages,
      assets: assetMap,
      sitemap,
      robots,
      css
    };
  }
}
