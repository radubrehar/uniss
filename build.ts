interface CSSPropertyRyle {
  name: string;
  values: string[];
}

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
  }
];

const result = options.reduce(
  (acc: string[], propertyRule: CSSPropertyRyle) => {
    const simpleRules: string[] = [];
    const mediaRules: string[] = [];
    const pseudoStateRules: string[] = []; // todo
    propertyRule.values.forEach(value => {
      const text = `.${propertyRule.name}\\=${value} {
  ${propertyRule.name}: ${value};
}`;
      simpleRules.push(text);
      mediaQueries.forEach(mediaQuery => {
        mediaRules.push(`${mediaQuery.value} {
${text}          
}`);
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
