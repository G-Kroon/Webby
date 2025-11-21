import React from "react";

export default function ComponentCard({ component, onAdd }) {
  return (
    <div className="component-card" onClick={() => onAdd(component)}>
      <h4>{component.name}</h4>
      <div className="component-preview">
        {component.preview}
      </div>
    </div>
  );
}
