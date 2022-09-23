import { StandardProperties } from "csstype";
import { MaybeAccessors } from "./accessors.js";
import { WillowFragment } from "./fragment.js";
import {
  createEffect,
  Effect,
  isAccessor,
  Setter,
  Signal,
} from "./primitives.js";
import { unref } from "./reactivity.js";

namespace Bindable {
  export function value([get, set]: Signal<string>) {
    return (el: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement) => {
      let isUpdating = false;

      createEffect(
        () => {
          if (isUpdating) return;
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

  export function numeric([get, set]: Signal<number>) {
    return (el: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement) => {
      let isUpdating = false;

      createEffect(
        () => {
          if (isUpdating) return;
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

const svgElements = new Set([
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
]);

function element(tag: string) {
  if (svgElements.has(tag)) {
    return document.createElementNS("http://www.w3.org/2000/svg", tag);
  }

  return document.createElement(tag);
}

function append(parent: Node, child: Node) {
  parent.appendChild(child);
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

function addNodeEffect(
  node: Node,
  effect: Effect,
  options?: { name?: string }
) {
  const scope = createEffect(effect, options);

  (node.willowScopes ||= new Set()).add(scope);
}

function appendReactive(parent: Node, children: JSX.Child) {
  if (isArray(children)) {
    children.forEach((child) => appendReactive(parent, child));
  } else if (isAccessor(children)) {
    const node = text("");

    addNodeEffect(node, () => (node.data = "" + children()), {
      name: "reactive text",
    });

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

type StyleValue =
  | MaybeAccessors<StandardProperties>
  | string
  | (() => StyleValue);

function setStyles(
  element: Element & ElementCSSInlineStyle,
  value: StyleValue
) {
  if (isAccessor(value)) {
    addNodeEffect(element, () => setStyles(element, value()), {
      name: "css style object",
    });
  } else if (typeof value === "string") {
    element.setAttribute("style", value);
  } else if (typeof value === "object") {
    for (const key in value) {
      const val = (value as any)[key];

      if (isAccessor(val)) {
        addNodeEffect(element, () => ((element.style as any)[key] = val()), {
          name: `css style.${key}`,
        });
      } else {
        (element.style as any)[key] = val;
      }
    }
  }
}

export function h<P extends JSX.Props>(
  tag: JSX.FcOrCc<P>,
  props: P
): JSX.Element;
export function h<P extends JSX.Props>(
  tag: JSX.FcOrCc<P>,
  props: Omit<P, "children">,
  ...children: JSX.ChildrenAsArray<P>
): JSX.Element;
export function h<
  K extends keyof JSX.IntrinsicElements & keyof HTMLElementTagNameMap
>(
  tag: K,
  props?: JSX.IntrinsicElements[K] | null,
  ...children: JSX.Child[]
): HTMLElementTagNameMap[K];
export function h<
  K extends keyof JSX.IntrinsicElements & keyof SVGElementTagNameMap
>(
  tag: K,
  props?: JSX.IntrinsicElements[K] | null,
  ...children: JSX.Child[]
): SVGElementTagNameMap[K];
export function h<K extends keyof JSX.IntrinsicElements>(
  tag: K,
  props?: JSX.IntrinsicElements[K] | null,
  ...children: JSX.Child[]
): JSX.Element;
export function h(
  tag: string | JSX.FcOrCc<JSX.Props>,
  props?: JSX.Props | null,
  ...children: unknown[]
): JSX.Element {
  if (typeof tag === "string") {
    const el = element(tag);
    appendReactive(el, (props?.children || children) as JSX.Child);

    for (const key in props) {
      const value = props[key];

      if (
        el instanceof HTMLElement &&
        (key === "class" || key === "className")
      ) {
        if (isAccessor(value)) {
          addNodeEffect(
            el,
            () => (el.className = fromClassLike(value() as any)),
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
          addNodeEffect(el, () => attr(el, key, value()), {
            name: `element attribute ${key}`,
          });
        } else {
          attr(el, key, value);
        }
      } else {
        if (isAccessor(value)) {
          addNodeEffect(el, () => ((el as any)[key] = value()), {
            name: `element property ${key}`,
          });
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
    } else if (!props) {
      props = {};
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
  export function f({ children }: { children: JSX.Child }) {
    const fragment = new WillowFragment();
    appendReactive(fragment, children);

    return fragment;
  }
}

const propsSymbol = Symbol("willow.propsSymbol");

export abstract class WillowElement<T extends JSX.Props = JSX.Props> {
  static of<T extends JSX.Props>(
    render: (self: WillowElement<T>, props: T) => JSX.Element
  ): typeof WillowElement<T> {
    return class extends WillowElement<T> {
      render(props: T): JSX.Element {
        return render(this, props);
      }
    };
  }

  node: ChildNode;

  [propsSymbol]!: T;

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

  cleanup() {
    cleanupNode(this.node);
    this.node.remove();
    this.node = text("");
  }

  emit<K extends keyof T & `on:${string}`>(
    type: K extends `on:${infer T}` ? T : never,
    ...data: Parameters<T[K]>
  ) {
    this.l[type]?.(...data);
  }

  abstract render(props: T): JSX.Element;
}

export function cleanupNode(node: Node) {
  node.willowScopes?.forEach((scope) => scope.cleanup());
  node.childNodes.forEach(cleanupNode);
}

declare global {
  namespace JSX {
    type BindableFor<T> = Bindable.For<T>;

    type ElementClass = Element | WillowElement<Props>;

    interface Props {
      [name: string]: any;
      [bindable: `bind:${string}`]: Signal<any>;
      [event: `on:${string}`]: ((value: any) => void) | (() => void);
      [slot: `slot:${string}`]: JSX.Element | ((...args: any) => JSX.Element);
      children?: any;
      use?: Setter<JSX.Element>;
    }

    export interface ElementAttributesProperty {
      [propsSymbol]: {};
    }

    export interface ElementChildrenAttribute {
      children: {};
    }

    type FC<T extends Props> = (props: T) => Element;
    type CC<T extends Props> = typeof WillowElement<T>;
    type FcOrCc<T extends Props> = FC<T> | CC<T>;

    type ChildrenAsArray<T> = T extends undefined
      ? []
      : T extends any[]
      ? T
      : [T];
  }
}
