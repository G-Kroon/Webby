import React from "react";

export default function ColorInput({ value, onChange }) {
  return (
    <input
      type="color"
      value={value || "#000000"}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
