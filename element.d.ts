import { Accessor } from "./primitives.js";
export declare abstract class WillowElement extends HTMLElement {
    static observedAttributes?: readonly string[];
    connectedCallback?(): void;
    disconnectedCallback?(): void;
    adoptedCallback?(): void;
    styles?: string | Accessor<string>;
    shadowRoot: ShadowRoot;
    constructor();
    abstract render(): JSX.Element | undefined;
    private w;
    attribute(name: string): Accessor<string | undefined>;
    attribute<T extends number>(name: string, defaultValue: T): Accessor<T>;
    attribute<T extends string>(name: string, defaultValue: T): Accessor<T>;
    attribute<T extends boolean>(name: string, defaultValue: T): Accessor<T>;
    attributeChangedCallback(attribute: string, oldValue: string | null, newValue: string | null): void;
}
