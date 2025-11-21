import React from "react";
import StyleControl from "./StyleControl";

export default function StyleSection({ title, properties, node, onChange }) {
  return (
    <div className="style-section">
      <h4>{title}</h4>

      {Object.entries(properties).map(([key, schema]) => (
        <StyleControl
          key={key}
          propKey={key}
          schema={schema}
          value={node.styles[key]}
          onChange={(v) => onChange(key, v)}
        />
      ))}
    </div>
  );
}
