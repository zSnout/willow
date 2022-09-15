import { createEffect } from "./core.js";

function element(tag: string) {
  return document.createElement(tag);
}

function append(parent: Node, child: Node) {
  parent.appendChild(child);
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

export interface JsxProps {
  [x: string]: unknown;
}

export function h(
  tag: string | JSX.FC,
  props?: JsxProps | null,
  ...children: unknown[]
) {
  if (typeof tag === "string") {
    const el = element(tag);
    appendAll(el, children);

    return el;
  } else if (typeof tag === "function") {
    if (!props) {
      props = { children };
    } else if (!props.children) {
      props = { ...props, children };
    }

    try {
      return tag(props);
    } catch {
      return new (tag as any)(props);
    }
  }
}

export namespace h {
  export function f({ children }: JsxProps) {
    const fragment = document.createDocumentFragment();
    appendAll(fragment, children);

    return fragment;
  }
}

declare global {
  namespace JSX {
    export interface Element extends Node {}

    export type IntrinsicElements = {
      [K in keyof HTMLElementTagNameMap]: any;
    };

    export type FC = (props: JsxProps) => Element;
    export type CC = new (props: JsxProps) => Element;
  }
}
