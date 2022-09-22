import { WillowFragment } from "./fragment.js";
import { createEffect } from "./primitives.js";
import { unref } from "./reactivity.js";
export function List({ children, }) {
    const node = new WillowFragment("List");
    createEffect(() => node.setTo(...unref(children)), { name: "<List>" });
    return node;
}
