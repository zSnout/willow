import { h } from "./jsx.js";
import { Accessor, createSignal, Setter } from "./primitives.js";

export abstract class WillowElement extends HTMLElement {
  static observedAttributes?: readonly string[];

  connectedCallback?(): void;
  disconnectedCallback?(): void;
  adoptedCallback?(): void;

  styles?: string | Accessor<string>;

  declare shadowRoot: ShadowRoot;

  constructor() {
    super();

    const root = this.attachShadow({ mode: "open" });

    if (this.styles) {
      root.appendChild(h("style", null, this.styles));
    }

    const node = this.render();
    if (node) {
      root.appendChild(node);
    }
  }

  abstract render(): JSX.Element | undefined;

  private w: Record<string, Set<Setter<string | null>> | undefined> = {};

  attribute(name: string): Accessor<string | undefined>;
  attribute<T extends number>(name: string, defaultValue: T): Accessor<T>;
  attribute<T extends string>(name: string, defaultValue: T): Accessor<T>;
  attribute<T extends boolean>(name: string, defaultValue: T): Accessor<T>;
  attribute(name: string, defaultValue?: any) {
    const [get, set] = createSignal<any>(this.getAttribute(name));

    const watchers = (this.w[name] ??= new Set());

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

  attributeChangedCallback(
    attribute: string,
    oldValue: string | null,
    newValue: string | null
  ) {
    if (oldValue === newValue) return;

    const watchers = this.w[attribute];
    if (!watchers) return;
  }
}
