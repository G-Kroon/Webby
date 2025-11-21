// engine/publish/AssetBundler.js
import crypto from "crypto";

export class AssetBundler {
  constructor(assets, tenantId) {
    this.assets = assets;
    this.tenantId = tenantId;
  }

  async process() {
    const assetMap = {};

    for (const asset of this.assets) {
      const hash = crypto.createHash("md5")
        .update(asset.buffer)
        .digest("hex")
        .slice(0, 10);

      const filename = `${hash}-${asset.name}`;
      const url = `/cdn/${this.tenantId}/${filename}`;

      assetMap[asset.id] = url;
    }

    return assetMap;
  }
}
