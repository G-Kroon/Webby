import React from "react";
import { StyleSchema } from "../../../engine/styles/StyleSchema";
import StyleSection from "./StyleSection";

export default function StylePanel({ selectedNode, onChange }) {
  if (!selectedNode) {
    return <div className="panel">No element selected</div>;
  }

  return (
    <div className="style-panel panel">
      {Object.entries(StyleSchema).map(([sectionKey, section]) => (
        <StyleSection
          key={sectionKey}
          title={section.label}
          properties={section.properties}
          node={selectedNode}
          onChange={onChange}
        />
      ))}
    </div>
  );
}
