import { WillowFragment } from "./fragment.js";
import { createEffect } from "./primitives.js";
import { unref } from "./reactivity.js";
export function Await({ value, pending, then, catch: c, }) {
    const fragment = new WillowFragment("Await");
    let asyncId = 0;
    createEffect(async () => {
        const id = ++asyncId;
        fragment.setTo(pending);
        try {
            const result = await unref(value);
            if (asyncId !== id)
                return;
            fragment.setTo(then?.(result));
        }
        catch (error) {
            if (asyncId !== id)
                return;
            fragment.setTo(c?.(error));
        }
    }, { name: "<Await>" });
    return fragment;
}
