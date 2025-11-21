import React from "react";
import NavigatorNode from "./NavigatorNode";

export default function NavigatorPanel({ tree, onSelect }) {
  return (
    <div className="navigator panel">
      <h3>Layers</h3>
      {tree.map((node) => (
        <NavigatorNode key={node.id} node={node} onSelect={onSelect} />
      ))}
    </div>
  );
}
