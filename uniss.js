export default class Uniss {
  constructor(options) {
    // setup option variables
    this.prefix = options.prefix || "un";
    this.inline = options.inline !== undefined ? options.inline : false;
    this.internal = options.internal !== undefined ? options.internal : false;
    this.rootElement = options.rootElement || document.body;

    this.mediaQueries = {
      ...defaultMediaQueries,
      ...options.mediaQueries,
    };
    this.pseudoStates = [...defaultPseudoStates];

    this.cache = {
      base: {},
      props: {},
    };

    // set up mutation watcher to track new changes in nodes
    if (options.watch) {
      this.observer = new MutationObserver(this.handleClassChange.bind(this));
      this.observer.observe(this.rootElement, {
        attributes: true,
        childList: true,
        subtree: true,
      });
    }

    // if internal === true, create style store all css
    if (this.internal) {
      this.style = document.createElement("style");
      document.head.appendChild(this.style);
    }

    this.load = this.load.bind(this);
    this.generateFromElement = this.generateFromElement.bind(this);
    this.handleClassChange = this.handleClassChange.bind(this);
    this.mediaWrapper = this.mediaWrapper.bind(this);
    this.traverseChildren = this.traverseChildren.bind(this);

    this.addToCache = this.addToCache.bind(this);
    this.checkIfInCache = this.checkIfInCache.bind(this);

    this.load();
  }

  load() {
    const searchQuery = `[class*='${this.prefix}-']`; // search string for elemnt selection

    const allElems = this.rootElement.querySelectorAll(searchQuery);
    allElems.forEach(this.generateFromElement);
  }

  generateFromElement(elem) {
    const classList = [...elem.classList]
      .filter((cls) => cls.startsWith(this.prefix)) // filter out other classes in this element without prefix
      .filter((cls) => cls.indexOf("=") !== -1); // filter out invalid properties;
    const classObject = [
      // here we destruct and store each class as object
      /*{
      prop: "color",
      value: "red",
      state: ":hover",
      media: "@lg",
      base: "color=red:hover@lg"
    }*/
    ];

    classList.forEach((base) => {
      // if we alredy have rule for this class, we just skip it
      if (this.checkIfInCache(base)) return;

      // if we dont, we add it to cache so we skip it next time
      this.addToCache(base);

      // spliting classes into signle tokens
      let [prop, right] = base.split("=");
      prop = prop.replace(`${options.prefix}-`, "");
      let [left, media] = right.split("@");
      let [value, state] = left.split(":");

      base = base
        .replace("=", "\\=")
        .replace("-", "\\-")
        .replace("@", "\\@")
        .replace("#", "\\#")
        .replace(":", "\\:")
        .replace("%", "\\%")
        .replace(".", "\\.");

      classObject.push({
        prop,
        value,
        state,
        media,
        base,
      });
    });

    if (this.inline) {
      // if inline is enabled, we add it to element
      const cssVar = classObject
        .filter((obj) => !obj.state && !obj.media) // remove ones with :state or @media in it
        .map((obj) => `${obj.prop}:${obj.value}`)
        .join("; ");
      elem.style.cssText += cssVar;
    }

    if (this.internal) {
      classObject.forEach((obj) => {
        let classText = `.${obj.base}${obj.state ? `:${obj.state}` : ""} {\t${
          obj.prop
        }: ${obj.value};\t}\n`;
        if (obj.media) {
          classText = this.mediaWrapper(obj.media, classText);
        }
        this.style.innerHTML += classText;
      });
    }
  }

  mediaWrapper(name, css) {
    let media = this.mediaQueries[name];
    if (!media) {
      console.warn(`Invalid media query value: ${name}`);
      return css;
    }

    return `${media} {\n\t${css}}\n`;
  }

  addToCache(base) {
    this.cache.base[base] = true;
  }
  checkIfInCache(base) {
    return this.cache.base[base];
  }

  traverseChildren(elem) {
    this.generateFromElement(elem);
    let children = [...elem.children]
      .filter((child) => child.nodeName !== "#text")
      .forEach(this.traverseChildren);
  }

  handleClassChange(mutationList) {
    mutationList.forEach((mutation) => {
      console.log(mutation);
      if (mutation.type === "childList") {
        [...mutation.addedNodes]
          .filter((elem) => elem.nodeName !== "#text")
          .forEach(this.traverseChildren);
      } else if (
        mutation.type === "attributes" &&
        mutation.attributeName === "class"
      ) {
        this.generateFromElement(mutation.target);
      }
    });
  }

  stop() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

const defaultPseudoStates = [
  "hover",
  "active",
  "visited",
  "focus",
  "focus-within",
];
const defaultMediaQueries = {
  sm: "@media (min-width: 640px)",
  md: "@media (min-width: 768px)",
  lg: "@media (min-width: 1024px)",
  xl: "@media (min-width: 1280px)",
};

window.Uniss = Uniss;
