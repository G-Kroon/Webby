// ui/overlays/SelectionOverlay.jsx
import React, { useEffect, useState } from "react";
import { useEditor } from "../../state/EditorContext";

export default function SelectionOverlay() {
  const { selection, canvasAPI } = useEditor();
  const [rect, setRect] = useState(null);

  useEffect(() => {
    if (!selection.activeNode) {
      setRect(null);
      return;
    }

    const update = () => {
      const r = canvasAPI.getNodeRect(selection.activeNode);
      setRect(r);
    };

    update();
    const observer = new ResizeObserver(update);

    const el = canvasAPI.getNodeElement(selection.activeNode);
    if (el) observer.observe(el);

    window.addEventListener("scroll", update, true);

    return () => {
      window.removeEventListener("scroll", update, true);
      observer.disconnect();
    };
  }, [selection.activeNode]);

  if (!rect) return null;

  return (
    <>
      {/* Selection outline */}
      <div
        style={{
          position: "absolute",
          top: rect.y,
          left: rect.x,
          width: rect.width,
          height: rect.height,
          border: "2px solid #3b82f6",
          borderRadius: 2,
          pointerEvents: "none",
          zIndex: 90000
        }}
      />

      {/* 4 Resize Handles */}
      {["nw", "ne", "sw", "se"].map((corner) => (
        <ResizeHandle key={corner} corner={corner} rect={rect} />
      ))}
    </>
  );
}

function ResizeHandle({ corner, rect }) {
  const size = 10;

  const posMap = {
    nw: { top: rect.y - size / 2, left: rect.x - size / 2 },
    ne: { top: rect.y - size / 2, left: rect.x + rect.width - size / 2 },
    sw: { top: rect.y + rect.height - size / 2, left: rect.x - size / 2 },
    se: {
      top: rect.y + rect.height - size / 2,
      left: rect.x + rect.width - size / 2
    }
  };

  return (
    <div
      data-resize-corner={corner}
      style={{
        position: "absolute",
        width: size,
        height: size,
        background: "#3b82f6",
        borderRadius: "50%",
        ...posMap[corner],
        pointerEvents: "auto",
        cursor:
          corner === "nw" || corner === "se"
            ? "nwse-resize"
            : "nesw-resize",
        zIndex: 100000
      }}
    />
  );
}
