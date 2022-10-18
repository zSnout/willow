import { h } from "./jsx.js";
import { createSignal } from "./primitives.js";
class WillowElement extends HTMLElement {
  static observedAttributes;
  styles;
  constructor() {
    super();
    const root = this.attachShadow({ mode: "open" });
    const node = this.render();
    if (node) {
      root.appendChild(node);
    }
    queueMicrotask(() => {
      if (this.styles) {
        root.appendChild(h("style", null, this.styles));
      }
    });
  }
  w = {};
  attribute(name, defaultValue) {
    const [get, set] = createSignal(this.getAttribute(name));
    const watchers = this.w[name] ??= /* @__PURE__ */ new Set();
    if (typeof defaultValue == "number") {
      watchers.add((value) => {
        const partial = +(value ?? defaultValue);
        set(isNaN(partial) ? partial : defaultValue);
      });
    } else if (typeof defaultValue == "string") {
      watchers.add((value) => set(value ?? defaultValue));
    } else if (typeof defaultValue == "boolean") {
      watchers.add((value) => set(value != null));
    } else {
      watchers.add((value) => set(value ?? defaultValue));
    }
    return get;
  }
  attributeChangedCallback(attribute, oldValue, newValue) {
    if (oldValue === newValue)
      return;
    const watchers = this.w[attribute];
    if (!watchers)
      return;
  }
}
export {
  WillowElement
};
