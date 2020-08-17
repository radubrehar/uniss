interface CSSPropertyRyle {
  name: string;
  values: string[];
}

function safeEscape(value: string): string {
  return value.replace(/(%)/g, "\\%");
}

const lengthArray: string[] = [
  "0",
  "10%",
  "20%",
  "30%",
  "40%",
  "50%",
  "60%",
  "70%",
  "80%",
  "90%",
  "100%",
  "10px",
  "20px",
  "30px",
  "40px",
  "50px",
  "60px",
  "70px",
  "80px",
  "90px",
  "100px",
  "1rem",
  "2rem",
  "3rem",
  "4rem",
  "5rem",
  "6rem",
  "7rem",
  "8rem",
  "9rem",
  "10rem",
  "1em",
  "2em",
  "3em",
  "4em",
  "5em",
  "6em",
  "7em",
  "8em",
  "9em",
  "10em"
];

const mediaQueries = [
  {
    name: "sm",
    value: "@media (min-width: 640px)"
  },
  {
    name: "md",
    value: "@media (min-width: 768px)"
  },
  {
    name: "lg",
    value: "@media (min-width: 1024px)"
  },
  {
    name: "xl",
    value: " @media (min-width: 1280px)"
  }
];

const pseudoStates = ["hover", "active", "visited", "focus", "focus-within"];

const options = [
  {
    name: "display",
    values: [
      "block",
      "inline-block",
      "inline",
      "flex",
      "inline-flex",
      "table",
      "table-row",
      "table-cell",
      "none"
    ]
  },
  {
    name: "position",
    values: ["static", "relative", "absolute", "fixed", "sticky"]
  },
  {
    name: "box-sizing",
    values: ["content-box", "border-box"]
  },
  {
    name: "cursor",
    values: [
      "alias",
      "all-scrol",
      "auto",
      "cell",
      "context-menu",
      "col-resize",
      "copy",
      "crosshair",
      "default",
      "e-resize",
      "ew-resize",
      "grab",
      "grabbing",
      "help",
      "move",
      "n-resize",
      "ne-resize",
      "nesw-resize",
      "ns-resize",
      "nw-resize",
      "nwse-resize",
      "no-drop",
      "none",
      "not-allowe ",
      "pointer",
      "progress",
      "row-resize",
      "s-resize",
      "se-resize",
      "sw-resize",
      "text",
      "w-resize",
      "wait",
      "zoom-in",
      "zoom-out"
    ]
  },
  {
    name: "direction",
    values: ["ltr", "rtl"]
  },
  {
    name: "flex-direction",
    values: ["row", "row-reverse", "column", "column-reverse"]
  },
  {
    name: "flex-wrap",
    values: ["nowrap", "wrap", "wrap-reverse"]
  },
  {
    name: "float",
    values: ["none", "left", "right"]
  },
  {
    name: "mix-blend-mode",
    values: [
      "normal",
      "multiply",
      "screen",
      "overlay",
      "darken",
      "lighten",
      "color-dodge",
      "color-burn",
      "difference",
      "exclusion",
      "hue",
      "saturation",
      "color",
      "luminosity"
    ]
  },
  {
    name: "object-fit",
    values: ["fill", "contain", "cover", "scale-down", "none"]
  },
  {
    name: "overflow",
    values: ["visible", "hidden", "scroll", "auto"]
  },
  {
    name: "overflow-y",
    values: ["visible", "hidden", "scroll", "auto"]
  },
  {
    name: "overflow-x",
    values: ["visible", "hidden", "scroll", "auto"]
  },
  {
    name: "resize",
    values: ["none", "both", "horizontal", "vertical"]
  },
  {
    name: "text-align",
    values: ["left", "right", "center", "justify"]
  },
  {
    name: "text-transform",
    values: ["none", "capitalize", "uppercase", "lowercase"]
  },
  {
    name: "user-select",
    values: ["auto", "none", "text", "all"]
  },
  {
    name: "visibility",
    values: ["visible", "hidden", "collapse"]
  },
  {
    name: "vertical-align",
    values: [
      "baseline",
      "length",
      "sub",
      "super",
      "top",
      "text-top",
      "middle",
      "bottom",
      "text-bottom"
    ]
  },
  {
    name: "white-space",
    values: ["normal", "nowrap", "pre", "pre-line", "pre-wrap"]
  },
  {
    name: "width",
    values: [...lengthArray]
  },
  {
    name: "height",
    values: [...lengthArray]
  },
  {
    name: "padding",
    values: [...lengthArray]
  },
  {
    name: "padding-left",
    values: [...lengthArray]
  },
  {
    name: "padding-right",
    values: [...lengthArray]
  },
  {
    name: "padding-top",
    values: [...lengthArray]
  },
  {
    name: "padding-bottom",
    values: [...lengthArray]
  },
  {
    name: "margin",
    values: [...lengthArray]
  },
  {
    name: "margin-left",
    values: [...lengthArray]
  },
  {
    name: "margin-right",
    values: [...lengthArray]
  },
  {
    name: "margin-top",
    values: [...lengthArray]
  },
  {
    name: "margin-bottom",
    values: [...lengthArray]
  }
];

const result = options.reduce(
  (acc: string[], propertyRule: CSSPropertyRyle) => {
    const simpleRules: string[] = [];
    const mediaRules: string[] = [];
    const pseudoStateRules: string[] = []; // todo
    propertyRule.values.forEach(value => {
      pseudoStates.forEach((state: string, index: number) => {
        const text = `.${propertyRule.name}\\=${safeEscape(value)} { ${
          propertyRule.name
        }: ${value}; }`;
        const textWithState = `.${propertyRule.name}\\=${safeEscape(
          value
        )}:${state} { ${propertyRule.name}: ${value}; }`;
        if (index === 0) {
          simpleRules.push(text);
        }
        simpleRules.push(textWithState);

        mediaQueries.forEach((mediaQuery) => {
          mediaRules.push(`${mediaQuery.value} { ${text} }`);
          mediaRules.push(`${mediaQuery.value} { ${textWithState} }`);
        });
      });
    });

    // @media (min-width: 1024px) {

    acc.push(...simpleRules);

    acc.push(...mediaRules);

    return acc;
  },
  [] as string[]
);

require("fs").writeFileSync("./index.css", result.join("\n"));
