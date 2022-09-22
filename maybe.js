import { WillowFragment } from "./fragment.js";
import { createEffect } from "./primitives.js";
export function Maybe({ when, fallback, children, }) {
    if (typeof when === "boolean") {
        return when ? children : fallback || document.createComment(" Maybe ");
    }
    const node = new WillowFragment("Maybe");
    createEffect(() => {
        const result = when() ? children : fallback;
        if (result) {
            node.setTo(result);
        }
        else {
            node.setTo();
        }
    }, { name: "<Maybe>" });
    return node;
}
