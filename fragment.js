const ael = "addEventListener";
const lc = "lastChild";
const s = "splice";
const nes = "nextElementSibling";
const ns = "nextSibling";
const n = null;
class WillowNodeList extends Array {
    item(index) {
        return this[index];
    }
    namedItem(name) {
        return this.find((value) => value.nodeName == name) || n;
    }
}
export class WillowFragment extends Comment {
    after(...nodes) {
        const last = this.n.at(-1);
        if (last) {
            last.after(...nodes);
        }
        else {
            super.after(...nodes);
        }
        this.r();
    }
    appendChild(node) {
        this.n.push(node);
        this.r();
        return node;
    }
    before(...nodes) {
        const last = this.n.at(-1);
        if (last) {
            last.before(...nodes);
        }
        else {
            super.before(...nodes);
        }
        this.r();
    }
    get children() {
        return this.n.filter((value) => value instanceof Element);
    }
    get childNodes() {
        return this.n;
    }
    contains(other) {
        return this == other || this.n.some((node) => node.contains(other));
    }
    get firstChild() {
        return this.n[0] || n;
    }
    hasChildNodes() {
        return !!this.n.length;
    }
    insertBefore(node, child) {
        const index = this.n.indexOf(child);
        if (index == -1)
            return node;
        this.n[s](index, 0, node);
        this.r();
        return node;
    }
    get [lc]() {
        return this.n.at(-1) || n;
    }
    get [nes]() {
        if (this[lc]) {
            return this[lc][nes];
        }
        else {
            return super[nes];
        }
    }
    get [ns]() {
        if (this[lc]) {
            return this[lc][ns];
        }
        else {
            return super[ns];
        }
    }
    remove() {
        super.remove();
        this.u();
    }
    removeChild(child) {
        const index = this.n.indexOf(child);
        if (index == -1)
            return child;
        this.n[s](index, 1);
        this.r();
        return child;
    }
    replaceChild(node, child) {
        const index = this.n.indexOf(node);
        if (index == -1)
            return child;
        this.n[s](index, 1, child);
        this.r();
        return child;
    }
    setTo(...nodes) {
        this.u();
        this.n[s](0, this.n.length, ...nodes.filter((x) => x));
        this.r();
    }
    replaceWith(...nodes) {
        this.u();
        super.replaceWith(...nodes);
        this.r();
    }
    /** nodes */
    n = new WillowNodeList();
    constructor(name = "Fragment") {
        super();
        this.data = ` ${name} `;
        this[ael]("DOMNodeInserted", (event) => {
            if (event.target != this)
                return;
            this.r();
        });
        this[ael]("DOMNodeRemoved", (event) => {
            if (event.target != this)
                return;
            this.u();
        });
    }
    /** render */
    r() {
        super.after(...this.n.filter((x) => x));
    }
    /** unrender */
    u() {
        this.n.forEach((node) => node?.remove());
    }
}
