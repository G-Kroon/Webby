import React from "react";

export default function NumberInput({ value, onChange, unit }) {
  return (
    <div className="number-input">
      <input
        type="number"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
      />
      <span>{unit}</span>
    </div>
  );
}
