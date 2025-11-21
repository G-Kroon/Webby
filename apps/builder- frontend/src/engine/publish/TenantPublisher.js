// engine/publish/TenantPublisher.js
import fs from "fs";
import path from "path";

export class TenantPublisher {
  constructor(tenantId) {
    this.tenantId = tenantId;
  }

  publishSite(output) {
    const root = path.join("tenants", this.tenantId);
    fs.mkdirSync(root, { recursive: true });

    // Write pages
    Object.entries(output.pages).forEach(([slug, html]) => {
      const filepath = path.join(root, slug + ".html");
      fs.writeFileSync(filepath, html);
    });

    // sitemap & robots
    fs.writeFileSync(path.join(root, "sitemap.xml"), output.sitemap);
    fs.writeFileSync(path.join(root, "robots.txt"), output.robots);

    // assets map (later uploaded to CDN)
    fs.writeFileSync(
      path.join(root, "assetMap.json"),
      JSON.stringify(output.assets, null, 2)
    );

    return true;
  }
}
