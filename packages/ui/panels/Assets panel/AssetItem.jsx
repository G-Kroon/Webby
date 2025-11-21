import React from "react";

export default function AssetItem({ asset, onSelect }) {
  return (
    <div className="asset-item" onClick={() => onSelect(asset)}>
      {asset.type === "image" ? (
        <img src={asset.url} alt="" />
      ) : (
        <div className="asset-placeholder">{asset.type}</div>
      )}
    </div>
  );
}
