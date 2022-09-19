import { StandardProperties } from "csstype";
import {
  createEffect,
  untrack,
  isAccessor,
  Signal,
  Setter,
} from "./reactivity.js";

namespace Bindable {
  export function value([get, set]: Signal<string>) {
    return (el: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement) => {
      el.value = get();
      listen(el, "input", () => set(el.value));
    };
  }

  export function numeric([get, set]: Signal<number>) {
    return (el: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement) => {
      el.value = "" + Number(untrack(get));
      listen(el, "input", () => set(+el.value));
    };
  }

  type InferElementRequirement<T> = T extends (
    value: any
  ) => (el: infer ElementType) => void
    ? ElementType
    : never;

  type InferValueRequirement<T> = T extends (
    value: infer ValueType
  ) => (el: any) => void
    ? ValueType extends Signal<infer SignalType>
      ? Signal<SignalType>
      : ValueType
    : never;

  export type For<T> = {
    [K in keyof typeof Bindable as T extends InferElementRequirement<
      typeof Bindable[K]
    >
      ? `bind:${K}`
      : never]?: InferValueRequirement<typeof Bindable[K]>;
  };
}

function isArray(value: unknown): value is any[] {
  return Array.isArray(value);
}

const svgElements = [
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
  "view",
];

function element(tag: string) {
  if (svgElements.includes(tag)) {
    return document.createElementNS("http://www.w3.org/2000/svg", tag);
  }

  return document.createElement(tag);
}

function append(parent: Node, child: Node) {
  parent.appendChild(child);
}

function remove(parent: Node, child: Node) {
  parent.removeChild(child);
}

function empty(node: Node) {
  node.childNodes.forEach((child) => remove(node, child));
}

function listen(
  node: Node,
  type: string,
  callback: (event: Event) => void,
  capture = false
) {
  node.addEventListener(type, callback, capture);
}

function text(data: unknown) {
  return document.createTextNode("" + data);
}

function attr(node: Element, key: string, value: unknown) {
  node.setAttribute(key, "" + value);
}

function isNode(value: unknown): value is Node {
  return value instanceof Node;
}

function fragment() {
  return document.createDocumentFragment();
}

function appendAll(parent: Node, children: JSX.Child) {
  if (isArray(children)) {
    children.forEach((child) => appendAll(parent, child));
  } else if (isAccessor(children)) {
    const node = text("");
    createEffect(() => (node.data = "" + children()));

    append(parent, node);
  } else if (isNode(children)) {
    append(parent, children);
  } else {
    append(parent, text(children));
  }
}

export type ClassLike =
  | string
  | ClassLike[]
  | Record<string, boolean>
  | undefined
  | null;

function fromClassLike(value: unknown): string {
  if (typeof value === "string") {
    return value;
  }

  if (isArray(value)) {
    return value.map(fromClassLike).join(" ");
  }

  if (typeof value === "object" && value) {
    return Object.entries(value)
      .filter(([, v]) => v)
      .map(([k]) => k)
      .join(" ");
  }

  return "";
}

type StyleValue = StandardProperties | string | (() => StyleValue);

function setStyles(
  element: Element & ElementCSSInlineStyle,
  value: StyleValue
) {
  if (isAccessor(value)) {
    createEffect(() => setStyles(element, value()));
  } else if (typeof value === "string") {
    element.setAttribute("style", value);
  } else if (typeof value === "object") {
    for (const key in value) {
      const val = (value as any)[key];

      if (isAccessor(val)) {
        createEffect(() => ((element.style as any)[key] = val()));
      } else {
        (element.style as any)[key] = val;
      }
    }
  }
}

export function h(
  tag: string | JSX.FC<JSX.Props> | JSX.CC<JSX.Props>,
  props?: JSX.Props | null,
  ...children: unknown[]
): JSX.Element {
  if (typeof tag === "string") {
    const el = element(tag);
    appendAll(el, children as JSX.Child);

    for (const key in props) {
      const value = props[key];

      if (
        el instanceof HTMLElement &&
        (key === "class" || key === "className")
      ) {
        if (isAccessor(value)) {
          createEffect(() => (el.className = fromClassLike(value() as any)));
        } else {
          el.className = fromClassLike(value);
        }
      } else if (key === "classList") {
      } else if (key === "ref" || key === "use") {
        if (typeof value === "function") {
          value(el);
        }
      } else if (key === "style") {
        setStyles(el, value);
      } else if (key.startsWith("bind:")) {
        (Bindable as any)[key.slice(5)](value)(el);
      } else if (key.startsWith("on:")) {
        if (typeof value === "function") {
          listen(el, key.slice(3), value as any);
        }
      } else if (key.startsWith("oncapture:")) {
        if (typeof value === "function") {
          listen(el, key.slice(10), value as any, true);
        }
      } else if (key.includes("-")) {
        if (isAccessor(value)) {
          createEffect(() => attr(el, key, value()));
        } else {
          attr(el, key, value);
        }
      } else {
        if (isAccessor(value)) {
          createEffect(() => ((el as any)[key] = value()));
        } else {
          (el as any)[key] = value;
        }
      }
    }

    return el;
  } else if (typeof tag === "function") {
    const actualChildren = children.length === 1 ? children[0] : children;

    if (children.length) {
      if (!props) {
        props = { children: actualChildren };
      } else if (!props.children) {
        props = { ...props, children: actualChildren };
      }
    }

    let value: JSX.Element | JSX.ElementClass;
    try {
      value = (tag as any)(props);
    } catch {
      value = new (tag as any)(props);
    }

    if (value instanceof WillowElement) {
      return value.node;
    }

    return value;
  }

  throw new TypeError(
    `willow.h must be passed a tag name or function, but was passed a ${typeof tag}`
  );
}

export namespace h {
  export function f({ children }: JSX.Props) {
    const frag = fragment();
    appendAll(frag, children);

    return frag;
  }
}

const propsSymbol = Symbol("willow.propsSymbol");

export abstract class WillowElement<T extends JSX.Props = JSX.Props> {
  static of<T extends JSX.Props>(
    render: (self: WillowElement<T>, props: T) => JSX.Element
  ) {
    return class extends WillowElement<T> {
      render(props: T): JSX.Element {
        return render(this, props);
      }
    };
  }

  node: Node;

  private [propsSymbol]!: T;

  /** listeners */
  private l: Record<string, ((data?: any) => void) | undefined> = {};

  constructor(props: T) {
    props = { ...props };

    for (const key in props) {
      if (key.startsWith("on:")) {
        this.l[key.slice(3)] = props[key];
      }
    }

    this.node = this.render(props);
  }

  emit<K extends keyof T & `on:${string}`>(
    type: K extends `on:${infer T}` ? T : never,
    ...data: Parameters<T[K]>
  ) {
    this.l[type]?.(...data);
  }

  abstract render(props: T): JSX.Element;
}

declare global {
  namespace JSX {
    type BindableFor<T> = Bindable.For<T>;

    type ElementClass = Element | WillowElement<Props>;

    interface Props {
      [name: string]: any;
      [bindable: `bind:${string}`]: Signal<any>;
      [event: `on:${string}`]: ((value: any) => void) | (() => void);
      children?: any;
      ref?: Setter<Node>;
      use?: (node: Node) => void;
    }

    export interface ElementAttributesProperty {
      [propsSymbol]: {};
    }

    export interface ElementChildrenAttribute {
      children: {};
    }

    type FC<T extends Props> = (props: T) => Element;
    type CC<T extends Props> = typeof WillowElement<T>;
  }
}
