import React from "react";

export default function NavigatorNode({ node, onSelect }) {
  return (
    <div className="nav-node">
      <div
        onClick={() => onSelect(node.id)}
        className="nav-node-label"
      >
        {node.type} — {node.id}
      </div>

      {node.children?.length > 0 && (
        <div className="nav-children">
          {node.children.map((c) => (
            <NavigatorNode key={c.id} node={c} onSelect={onSelect} />
          ))}
        </div>
      )}
    </div>
  );
}
