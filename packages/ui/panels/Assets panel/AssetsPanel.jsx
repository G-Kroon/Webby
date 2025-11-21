import React from "react";
import AssetItem from "./AssetItem";

export default function AssetsPanel({ assets, onSelect }) {
  return (
    <div className="assets panel">
      <h3>Assets</h3>

      <div className="asset-grid">
        {assets.map((a) => (
          <AssetItem key={a.id} asset={a} onSelect={onSelect} />
        ))}
      </div>
    </div>
  );
}
