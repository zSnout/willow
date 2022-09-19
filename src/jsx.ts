import { Bindable } from "./bindable.js";
import { createEffect, isAccessor, Signal } from "./reactivity.js";

function element(tag: string) {
  return document.createElement(tag);
}

function append(parent: Node, child: Node) {
  parent.appendChild(child);
}

function remove(parent: Node, child: Node) {
  parent.removeChild(child);
}

function listen(
  node: Node,
  type: string,
  callback: (event: Event) => void
): () => void {
  node.addEventListener(type, callback);
  return () => node.removeEventListener(type, callback);
}

function text(data: unknown) {
  const node = document.createTextNode("");

  if (typeof data === "function") {
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
  if (Array.isArray(children)) {
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

  if (Array.isArray(value)) {
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
      } else if (key === "use" || key.startsWith("use:")) {
        if (typeof value === "function") {
          value(el);
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
    if (!props) {
      props = { children };
    } else if (!props.children) {
      props = { ...props, children };
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
  private listeners = new Map<string, ((data?: any) => void) | undefined>();

  constructor(props: T) {
    props = { ...props };

    for (const key in props) {
      if (key.startsWith("on:")) {
        this.listeners.set(key.slice(3), props[key]);
      }
    }

    this.node = this.render(props);
  }

  emit<K extends keyof T & `on:${string}`>(
    type: K extends `on:${infer T}` ? T : never,
    ...data: Parameters<T[K]>
  ) {
    const callback = this.listeners.get(type);
    callback?.(...data);
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
} & Bindable<T>;

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
