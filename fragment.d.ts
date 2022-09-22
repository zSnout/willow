declare const lc = "lastChild";
declare const nes = "nextElementSibling";
declare const ns = "nextSibling";
export declare class WillowFragment extends Comment {
    after(...nodes: (string | Node)[]): void;
    appendChild<T extends Node>(node: T): T;
    before(...nodes: (string | Node)[]): void;
    get children(): HTMLCollection;
    get childNodes(): NodeListOf<ChildNode>;
    contains(other: Node | null): boolean;
    get firstChild(): ChildNode & NonDocumentTypeChildNode;
    hasChildNodes(): boolean;
    insertBefore<T extends Node>(node: T, child: Node | null): T;
    get [lc](): (ChildNode & NonDocumentTypeChildNode) | null;
    get [nes](): Element | null;
    get [ns](): ChildNode | null;
    remove(): void;
    removeChild<T extends Node>(child: T): T;
    replaceChild<T extends Node>(node: Node, child: T): T;
    setTo(...nodes: (Node | null | undefined)[]): void;
    replaceWith(...nodes: (string | Node)[]): void;
    /** nodes */
    private n;
    constructor(name?: string);
    /** render */
    private r;
    /** unrender */
    private u;
}
export {};
