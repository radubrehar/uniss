const options = {
  prefix: "un", // class prefix
  inline: false, // set css as inline, applies only to ones without :state and @media
  internal: true, // set classes in internall <style>
  mediaQueries: [
    {
      name: "sm",
      value: "@media (min-width: 640px)",
    },
    {
      name: "md",
      value: "@media (min-width: 768px)",
    },
    {
      name: "lg",
      value: "@media (min-width: 1024px)",
    },
    {
      name: "xl",
      value: " @media (min-width: 1280px)",
    },
  ],
  pseudoStates: ["hover", "active", "visited", "focus", "focus-within"],
};

window.onload = function () {
  const ourStyleElement = document.createElement("style");
  if (options.internal) {
    // if enabled adds <style> with our css to head
    document.head.appendChild(ourStyleElement);
  }

  const searchQuery = `[class*='${options.prefix}-']`; // search string for elemnt selection

  const allElems = document.querySelectorAll(searchQuery);
  allElems.forEach((elem) => {
    const classList = [...elem.classList]
      .filter((cls) => cls.startsWith(options.prefix)) // filter out other classes in this element without prefix
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
      // spliting classes into signle tokens
      let [prop, right] = base.split("=");
      prop = prop.replace(`${options.prefix}-`, "");
      let [left, media] = right.split("@");
      let [value, state] = left.split(":");
      
      base = base
      .replace("=", "\\=")
      .replace("@", "\\@")
      .replace("#", "\\#")
      .replace(":", "\\:")
      .replace("%",'\\%');

      classObject.push({
        prop,
        value,
        state,
        media,
        base,
      });
    });

    if (options.inline) {
      // if inline is enabled, we add it to element
      const cssVar = classObject
        .filter((obj) => !obj.state && !obj.media) // remove ones with :state or @media in it
        .map((obj) => `${obj.prop}:${obj.value}`)
        .join("; ");
      elem.style.cssText += cssVar;
    }

    if (options.internal) {
      classObject.forEach((obj) => {
        let classText = `.${obj.base}${obj.state ? `:${obj.state}` : ""} {\t${
          obj.prop
        }: ${obj.value};\t}\n`;
        console.log(classText);
        if (obj.media) {
          classText = mediaWrapper(obj.media, classText);
        }
        ourStyleElement.innerHTML += classText;
      });
    }
  });

  function mediaWrapper(name, css) {
    let media = options.mediaQueries.find((mq) => mq.name === name);
    if (!media) {
      console.warn(`Invalid media query value: ${name}`);
      return css;
    }

    return `${media.value} {\n\t${css}}\n`;
  }
  window.mediaWrapper = mediaWrapper;
};
