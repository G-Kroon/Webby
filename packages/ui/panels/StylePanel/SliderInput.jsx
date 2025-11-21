import React from "react";

export default function SliderInput({ value, onChange, min, max }) {
  return (
    <input
      type="range"
      min={min}
      max={max}
      value={value ?? 0}
      onChange={(e) => onChange(Number(e.target.value))}
    />
  );
}
