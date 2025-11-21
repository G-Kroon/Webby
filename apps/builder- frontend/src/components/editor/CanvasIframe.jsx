import React, { useEffect, useRef } from "react";

export default function CanvasIframe({ onSelectNode }) {
  const iframeRef = useRef();

  useEffect(() => {
    const iframe = iframeRef.current;
    const doc = iframe.contentDocument;

    doc.body.addEventListener("click", (e) => {
      const id = e.target.getAttribute("data-node-id");
      if (id) onSelectNode(window.engine.findNode(id));
    });

    window.engine.renderer.mount(doc.body);
  }, []);

  return <iframe className="canvas-iframe" ref={iframeRef} />;
}
