// ui/overlays/DragOverlay.jsx
import React, { useEffect, useState } from "react";
import { useEditor } from "../../state/EditorContext";

export default function DragOverlay() {
  const { dragState } = useEditor(); 
  const { isDragging, ghost, targetRect, insertionIndex } = dragState;

  const [mousemove, setMousemove] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e) => {
      setMousemove({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  if (!isDragging) return null;

  return (
    <>
      {/* Drag Ghost */}
      {ghost && (
        <div
          style={{
            position: "fixed",
            top: mousemove.y + 10,
            left: mousemove.x + 10,
            pointerEvents: "none",
            opacity: 0.7,
            zIndex: 100000,
            padding: "6px 10px",
            background: "white",
            border: "1px solid #ccc",
            borderRadius: 4,
            fontSize: 12
          }}
        >
          {ghost.label}
        </div>
      )}

      {/* Drop Indicator */}
      {targetRect && insertionIndex !== null && (
        <div
          style={{
            position: "absolute",
            top: targetRect.y,
            left: targetRect.x,
            width: targetRect.width,
            height: targetRect.height,
            pointerEvents: "none",
            zIndex: 99999
          }}
        >
          {/* Red insertion bar */}
          <div
            style={{
              position: "absolute",
              height: 2,
              width: "100%",
              background: "#ff375f",
              top: insertionIndex === "before" ? 0 : "unset",
              bottom: insertionIndex === "after" ? 0 : "unset"
            }}
          />
        </div>
      )}
    </>
  );
}
