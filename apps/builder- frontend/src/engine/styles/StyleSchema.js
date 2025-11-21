// engine/styles/StyleSchema.js
//
// The Style Schema defines all editable style properties usable by the builder.
// It is consumed by:
//  - StyleEngine                        (validation + normalization)
//  - Style Panel UI                      (to auto-generate controls)
//  - CSSGenerator                        (mapping to CSS keys)
//  - ResponsiveEngine                    (breakpoint overrides)
//

export const StyleSchema = {
  typography: {
    label: "Typography",
    properties: {
      fontSize: {
        type: "number",
        unit: "px",
        default: 16,
        min: 1,
        max: 200,
        css: "font-size"
      },
      fontWeight: {
        type: "select",
        default: "400",
        options: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
        css: "font-weight"
      },
      color: {
        type: "color",
        default: "#000000",
        css: "color"
      },
      textAlign: {
        type: "select",
        default: "left",
        options: ["left", "center", "right", "justify"],
        css: "text-align"
      },
      lineHeight: {
        type: "number",
        unit: "",
        default: 1.4,
        min: 0.5,
        max: 4,
        css: "line-height"
      }
    }
  },

  spacing: {
    label: "Spacing",
    properties: {
      marginTop: {
        type: "number",
        unit: "px",
        default: 0,
        css: "margin-top"
      },
      marginBottom: {
        type: "number",
        unit: "px",
        default: 0,
        css: "margin-bottom"
      },
      paddingTop: {
        type: "number",
        unit: "px",
        default: 0,
        css: "padding-top"
      },
      paddingBottom: {
        type: "number",
        unit: "px",
        default: 0,
        css: "padding-bottom"
      },
      paddingLeft: {
        type: "number",
        unit: "px",
        default: 0,
        css: "padding-left"
      },
      paddingRight: {
        type: "number",
        unit: "px",
        default: 0,
        css: "padding-right"
      }
    }
  },

  layout: {
    label: "Layout",
    properties: {
      display: {
        type: "select",
        default: "block",
        options: [
          "block",
          "inline-block",
          "flex",
          "grid",
          "inline",
          "none"
        ],
        css: "display"
      },
      width: {
        type: "number",
        unit: "px",
        default: null,
        css: "width"
      },
      height: {
        type: "number",
        unit: "px",
        default: null,
        css: "height"
      },
      maxWidth: {
        type: "number",
        unit: "px",
        default: null,
        css: "max-width"
      }
    }
  },

  background: {
    label: "Background",
    properties: {
      backgroundColor: {
        type: "color",
        default: "transparent",
        css: "background-color"
      },
      backgroundImage: {
        type: "text",
        default: null,
        css: "background-image"
      },
      backgroundSize: {
        type: "select",
        default: "cover",
        options: ["cover", "contain", "auto"],
        css: "background-size"
      },
      backgroundRepeat: {
        type: "select",
        default: "no-repeat",
        options: ["no-repeat", "repeat", "repeat-x", "repeat-y"],
        css: "background-repeat"
      }
    }
  },

  borders: {
    label: "Borders",
    properties: {
      borderRadius: {
        type: "number",
        unit: "px",
        default: 0,
        css: "border-radius"
      },
      borderWidth: {
        type: "number",
        unit: "px",
        default: 0,
        css: "border-width"
      },
      borderColor: {
        type: "color",
        default: "#000000",
        css: "border-color"
      },
      borderStyle: {
        type: "select",
        default: "solid",
        options: ["solid", "dashed", "dotted", "double", "none"],
        css: "border-style"
      }
    }
  },

  effects: {
    label: "Effects",
    properties: {
      opacity: {
        type: "number",
        min: 0,
        max: 1,
        default: 1,
        css: "opacity"
      },
      boxShadow: {
        type: "text",
        default: "none",
        css: "box-shadow"
      }
    }
  }
};



import { StyleSchema } from "./StyleSchema.js";

class StyleEngine {
  apply(nodeId, styleObj) {
    for (const key in styleObj) {
      if (!this.isPropertyAllowed(key)) continue;
      const node = this.canvas.findNode(nodeId);
      if (!node) return false;

      node.styles[key] = styleObj[key];
    }
  }

  isPropertyAllowed(prop) {
    return Object.values(StyleSchema)
      .some(category => prop in category.properties);
  }
}

