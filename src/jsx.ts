import { createEffect, get, isAccessor, Signal } from "./reactivity.js";

namespace Bindable {
  export function value(signal: Signal<string>) {
    return (el: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement) => {
      el.value = get(signal);
      listen(el, "input", () => signal.set(el.value));
    };
  }

  export function numeric(signal: Signal<number>) {
    return (el: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement) => {
      el.value = "" + +get(signal);
      listen(el, "input", () => signal.set(+el.value));
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

  export type For<T extends HTMLElement> = {
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

function element(tag: string) {
  return document.createElement(tag);
}

function append(parent: Node, child: Node) {
  parent.appendChild(child);
}

function remove(parent: Node, child: Node) {
  parent.removeChild(child);
}

function listen(node: Node, type: string, callback: (event: Event) => void) {
  node.addEventListener(type, callback);
}

function text(data: unknown) {
  const node = document.createTextNode("");

  if (isAccessor(data)) {
    createEffect(() => setData(node, data()));
  } else {
    setData(node, data);
  }

  return node;
}

function attr(node: Element, key: string, value: unknown) {
  node.setAttribute(key, "" + value);
}

function setData(node: CharacterData, data: unknown) {
  node.data = String(data);
}

function isNode(value: unknown): value is Node {
  return value instanceof Node;
}

function appendAll(parent: Node, children: unknown) {
  if (isArray(children)) {
    for (const child of children) {
      if (isNode(child)) {
        append(parent, child);
      } else {
        append(parent, text(child));
      }
    }
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

export function h(
  tag: string | JSX.FC<JSX.Props> | JSX.CC<JSX.Props>,
  props?: JSX.Props | null,
  ...children: unknown[]
): JSX.Element {
  if (typeof tag === "string") {
    const el = element(tag);
    appendAll(el, children);

    for (const key in props) {
      const value = props[key];

      if (key === "class") {
        if (isAccessor(value)) {
          createEffect(() => (el.className = fromClassLike(value() as any)));
        } else {
          el.className = fromClassLike(value);
        }
      } else if (key === "ref") {
        if (isAccessor(value)) {
          value.set?.(el);
        }
      } else if (key === "use") {
        if (typeof value === "function") {
          value(el);
        } else if (isArray(value)) {
          value.forEach((fn) => fn(el));
        }
      } else if (key.startsWith("bind:")) {
        (Bindable as any)[key.slice(5)](value)(el);
      } else if (key.startsWith("on:")) {
        if (typeof value === "function") {
          listen(el, key.slice(3), value as any);
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
    const fragment = document.createDocumentFragment();
    appendAll(fragment, children);

    return fragment;
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

type ElementProps<T extends HTMLElement> = {
  children?: any;
  class?: ClassLike;
  ref?: Signal<T>;
  use?: ((el: T) => void) | ((el: T) => void)[];
} & {
  [K in keyof HTMLElementEventMap as `on:${K}`]?: (
    event: HTMLElementEventMap[K]
  ) => void;
} & Bindable.For<T>;

declare global {
  namespace JSX {
    interface Element extends Node {}

    type ElementClass = Element | WillowElement<Props>;

    interface Props {
      [name: string]: any;
      [bindable: `bind:${string}`]: Signal<any>;
      [event: `on:${string}`]: ((value: any) => void) | (() => void);
      children?: any;
      use?: ((node: Node) => void) | ((node: Node) => void)[];
    }

    export type IntrinsicElements = {
      [K in keyof HTMLElementTagNameMap]: ElementProps<
        HTMLElementTagNameMap[K]
      >;
    };

    export interface ElementAttributesProperty {
      [propsSymbol]: {};
    }

    export interface ElementChildrenAttribute {
      children: {};
    }

    type FC<T extends Props> = (props: T) => Element;
    type CC<T extends Props> = typeof WillowElement<T>;

    interface IntrinsicAttributes {}

    interface IntrinsicClassAttributes extends IntrinsicAttributes {
      ref?: Signal<Node>;
      use?: ((node: Node) => void) | ((node: Node) => void)[];
    }
  }
}
