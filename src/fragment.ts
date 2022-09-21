class WillowNodeList extends Array<ChildNode & NonDocumentTypeChildNode> {
  item(index: number): Node {
    return this[index];
  }

  namedItem(name: string): Node | null {
    return this.find((value) => value.nodeName === name) || null;
  }
}

const nes = "nextElementSibling";
const ns = "nextSibling";
const lc = "lastChild";

export class WillowFragment extends Comment {
  after(...nodes: (string | Node)[]) {
    const last = this.n.at(-1);

    if (last) {
      last.after(...nodes);
    } else {
      super.after(...nodes);
    }

    this.r();
  }

  appendChild<T extends Node>(node: T) {
    this.n.push(node as any);
    this.r();
    return node;
  }

  before(...nodes: (string | Node)[]) {
    const last = this.n.at(-1);

    if (last) {
      last.before(...nodes);
    } else {
      super.before(...nodes);
    }

    this.r();
  }

  get children(): HTMLCollection {
    return this.n.filter(
      (value): value is Element => value instanceof Element
    ) as any;
  }

  get childNodes(): NodeListOf<ChildNode> {
    return this.n as any;
  }

  contains(other: Node | null): boolean {
    return this === other || this.n.some((node) => node.contains(other));
  }

  get firstChild() {
    return this.n[0] || null;
  }

  hasChildNodes() {
    return !!this.n.length;
  }

  insertBefore<T extends Node>(node: T, child: Node | null) {
    const index = this.n.indexOf(child as any);
    if (index === -1) return node;

    this.n.splice(index, 0, node as any);
    this.r();
    return node;
  }

  get [lc]() {
    return this.n.at(-1) || null;
  }

  get [nes]() {
    if (this[lc]) {
      return this[lc][nes];
    } else {
      return super[nes];
    }
  }

  get [ns]() {
    if (this[lc]) {
      return this[lc][ns];
    } else {
      return super[ns];
    }
  }

  remove() {
    super.remove();
    this.u();
  }

  removeChild<T extends Node>(child: T) {
    const index = this.n.indexOf(child as any);
    if (index === -1) return child;

    this.n.splice(index, 1);
    this.r();
    return child;
  }

  replaceChild<T extends Node>(node: Node, child: T) {
    const index = this.n.indexOf(node as any);
    if (index === -1) return child;

    this.n.splice(index, 1, child as any);
    this.r();
    return child;
  }

  setTo(...nodes: (Node | null | undefined)[]) {
    this.u();
    this.n.splice(0, this.n.length, ...(nodes.filter((x) => x) as any));
    this.r();
  }

  replaceWith(...nodes: (string | Node)[]) {
    this.u();
    super.replaceWith(...nodes);
    this.r();
  }

  /** nodes */
  private n = new WillowNodeList();

  constructor(name = "Fragment") {
    super();
    this.data = ` ${name} `;

    this.addEventListener("DOMNodeInserted", (event) => {
      if (event.target != this) return;
      this.r();
    });

    this.addEventListener("DOMNodeRemoved", (event) => {
      if (event.target != this) return;
      this.u();
    });
  }

  /** render */
  private r() {
    super.after(...this.n.filter((x) => x));
  }

  /** unrender */
  private u() {
    this.n.forEach((node) => node?.remove());
  }
}
