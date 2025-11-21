import React, { useState } from "react";
import CanvasIframe from "./CanvasIframe";
import StylePanel from "../ui/panels/StylePanel/StylePanel";
import NavigatorPanel from "../ui/panels/NavigatorPanel/NavigatorPanel";
import AssetsPanel from "../ui/panels/AssetsPanel/AssetsPanel";

export default function EditorShell() {
  const [selectedNode, setSelectedNode] = useState(null);

  return (
    <div className="editor-shell">
      <div className="left-sidebar">
        <NavigatorPanel tree={window.engine.nodes} onSelect={setSelectedNode} />
        <AssetsPanel assets={window.assets} />
      </div>

      <CanvasIframe onSelectNode={setSelectedNode} />

      <div className="right-sidebar">
        <StylePanel
          selectedNode={selectedNode}
          onChange={(key, value) =>
            window.engine.style.apply(selectedNode.id, { [key]: value })
          }
        />
      </div>
    </div>
  );
}
