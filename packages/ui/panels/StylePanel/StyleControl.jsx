import React from "react";
import ColorInput from "./ColorInput";
import NumberInput from "./NumberInput";
import SelectInput from "./SelectInput";
import SliderInput from "./SliderInput";

export default function StyleControl({ propKey, schema, value, onChange }) {
  const common = { value, onChange };

  let input;
  switch (schema.type) {
    case "color":
      input = <ColorInput {...common} />;
      break;
    case "number":
      input = <NumberInput {...common} unit={schema.unit} />;
      break;
    case "select":
      input = (
        <SelectInput
          {...common}
          options={schema.options}
        />
      );
      break;
    case "slider":
      input = (
        <SliderInput
          {...common}
          min={schema.min}
          max={schema.max}
        />
      );
      break;
    default:
      input = <input type="text" {...common} />;
  }

  return (
    <div className="style-control">
      <label>{propKey}</label>
      {input}
    </div>
  );
}
