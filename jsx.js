import { WillowFragment } from "./fragment.js";
import {
  createEffect,
  isAccessor
} from "./primitives.js";
import { unref } from "./reactivity.js";
var Bindable;
((Bindable2) => {
  function value([get, set]) {
    return (el) => {
      let isUpdating = false;
      createEffect(
        () => {
          if (isUpdating)
            return;
          el.value = get();
        },
        { name: "bind:value" }
      );
      listen(el, "input", () => {
        isUpdating = true;
        set(el.value);
        isUpdating = false;
      });
    };
  }
  Bindable2.value = value;
  function numeric([get, set]) {
    return (el) => {
      let isUpdating = false;
      createEffect(
        () => {
          if (isUpdating)
            return;
          el.value = "" + get();
        },
        { name: "bind:numeric" }
      );
      listen(el, "input", () => {
        isUpdating = true;
        set(+el.value);
        isUpdating = false;
      });
    };
  }
  Bindable2.numeric = numeric;
})(Bindable || (Bindable = {}));
function isArray(value) {
  return Array.isArray(value);
}
const svgElements = /* @__PURE__ */ new Set([
  "svg",
  "animate",
  "animateTransform",
  "circle",
  "clipPath",
  "defs",
  "desc",
  "ellipse",
  "feBlend",
  "feColorMatrix",
  "feComponentTransfer",
  "feComposite",
  "feConvolveMatrix",
  "feDiffuseLighting",
  "feDisplacementMap",
  "feDistantLight",
  "feFlood",
  "feFuncA",
  "feFuncB",
  "feFuncG",
  "feFuncR",
  "feGaussianBlur",
  "feImage",
  "feMerge",
  "feMergeNode",
  "feMorphology",
  "feOffset",
  "fePointLight",
  "feSpecularLighting",
  "feSpotLight",
  "feTile",
  "feTurbulence",
  "filter",
  "foreignObject",
  "g",
  "image",
  "line",
  "linearGradient",
  "marker",
  "mask",
  "metadata",
  "path",
  "pattern",
  "polygon",
  "polyline",
  "radialGradient",
  "rect",
  "stop",
  "switch",
  "symbol",
  "text",
  "textPath",
  "tspan",
  "use",
  "view"
]);
function element(tag) {
  if (svgElements.has(tag)) {
    return document.createElementNS("http://www.w3.org/2000/svg", tag);
  }
  return document.createElement(tag);
}
function append(parent, child) {
  parent.appendChild(child);
}
function listen(node, type, callback, capture = false) {
  node.addEventListener(type, callback, capture);
}
function text(data) {
  return document.createTextNode("" + data);
}
function attr(node, key, value) {
  node.setAttribute(key, "" + value);
}
function isNode(value) {
  return value instanceof Node;
}
function addNodeEffect(node, effect, options) {
  const scope = createEffect(effect, options);
  (node.willowScopes ||= /* @__PURE__ */ new Set()).add(scope);
}
function appendReactive(parent, children) {
  if (isArray(children)) {
    children.forEach((child) => appendReactive(parent, child));
  } else if (isAccessor(children)) {
    const node = text("");
    addNodeEffect(node, () => node.data = "" + children(), {
      name: "reactive text"
    });
    append(parent, node);
  } else if (isNode(children)) {
    append(parent, children);
  } else {
    append(parent, text(children));
  }
}
function fromClassLike(value) {
  if (typeof value === "string") {
    return value;
  }
  if (isArray(value)) {
    return value.map(fromClassLike).join(" ");
  }
  if (typeof value === "object" && value) {
    return Object.entries(value).filter(([, v]) => v).map(([k]) => k).join(" ");
  }
  return "";
}
function setStyles(element2, value) {
  if (isAccessor(value)) {
    addNodeEffect(element2, () => setStyles(element2, value()), {
      name: "css style object"
    });
  } else if (typeof value === "string") {
    element2.setAttribute("style", value);
  } else if (typeof value === "object") {
    for (const key in value) {
      const val = value[key];
      if (isAccessor(val)) {
        addNodeEffect(element2, () => element2.style[key] = val(), {
          name: `css style.${key}`
        });
      } else {
        element2.style[key] = val;
      }
    }
  }
}
function h(tag, props, ...children) {
  let _el;
  if (typeof tag === "string") {
    const el = element(tag);
    appendReactive(el, props?.children || children);
    for (const key in props) {
      const value = props[key];
      if (el instanceof HTMLElement && (key === "class" || key === "className")) {
        if (isAccessor(value)) {
          addNodeEffect(
            el,
            () => el.className = fromClassLike(value()),
            { name: "className" }
          );
        } else {
          el.className = fromClassLike(value);
        }
      } else if (key === "classList") {
        for (const name in value) {
          addNodeEffect(
            el,
            () => el.classList.toggle(name, !!unref(value[name])),
            { name: `classList.${name}` }
          );
        }
      } else if (key === "use") {
        if (typeof value === "function") {
          value(el);
        }
      } else if (key === "style") {
        setStyles(el, value);
      } else if (key.startsWith("bind:")) {
        Bindable[key.slice(5)](value)(el);
      } else if (key.startsWith("on:") || key.startsWith("oncapture:")) {
      } else if (key in el) {
        if (isAccessor(value)) {
          addNodeEffect(el, () => el[key] = value(), {
            name: `element property ${key}`
          });
        } else {
          el[key] = value;
        }
      } else {
        if (isAccessor(value)) {
          addNodeEffect(el, () => attr(el, key, value()), {
            name: `element attribute ${key}`
          });
        } else {
          attr(el, key, value);
        }
      }
    }
    _el = el;
  } else if (typeof tag === "function") {
    const actualChildren = children.length === 1 ? children[0] : children;
    if (children.length) {
      if (!props) {
        props = { children: actualChildren };
      } else if (!props.children) {
        props = { ...props, children: actualChildren };
      }
    } else if (!props) {
      props = {};
    }
    let value;
    try {
      value = tag(props);
    } catch {
      value = new tag(props);
    }
    _el = value;
  } else {
    throw new TypeError(
      `willow.h must be passed a tag name or function, but was passed a ${typeof tag}`
    );
  }
  for (const key in props) {
    const value = props[key];
    if (key.startsWith("on:")) {
      if (typeof value === "function") {
        listen(_el, key.slice(3), value);
      }
    } else if (key.startsWith("oncapture:")) {
      if (typeof value === "function") {
        listen(_el, key.slice(10), value, true);
      }
    }
  }
  return _el;
}
((h2) => {
  function f({ children }) {
    const fragment = new WillowFragment();
    appendReactive(fragment, children);
    return fragment;
  }
  h2.f = f;
})(h || (h = {}));
const propsSymbol = Symbol("willow.propsSymbol");
function cleanupNode(node) {
  node.willowScopes?.forEach((scope) => scope.cleanup());
  node.childNodes.forEach(cleanupNode);
}
export {
  cleanupNode,
  h
};
