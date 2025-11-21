import React from "react";
import ComponentCard from "./ComponentCard";

export default function ComponentsPanel({ components, onAdd }) {
  return (
    <div className="components panel">
      <h3>Components</h3>

      {components.map((c) => (
        <ComponentCard key={c.id} component={c} onAdd={onAdd} />
      ))}
    </div>
  );
}
