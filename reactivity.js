import { devLog } from "./dev-log.js";
import { createEffect, createSignal, getScope, isAccessor, } from "./primitives.js";
export function createMemo(update, options) {
    const [get, set] = createSignal(0);
    createEffect(() => set(update()), options?.name ? { name: `memo '${options?.name}'` } : {});
    return get;
}
export function createComputed(value, update) {
    const [get, set] = createSignal(0);
    createEffect(() => set((value = update(value))));
    return get;
}
export function unref(accessor) {
    if (isAccessor(accessor)) {
        return accessor();
    }
    else {
        return accessor;
    }
}
const arrayKeys = new Set([
    "pop",
    "push",
    "reverse",
    "shift",
    "sort",
    "splice",
    "unshift",
    "fill",
    "copyWithin",
]);
const setKeys = new Set(["add", "clear", "delete"]);
const mapKeys = new Set(["clear", "delete", "set"]);
export function createStore(object, options) {
    // Functions and Nodes are excluded from deep reactivity for performance reasons.
    if (typeof object === "function" || object instanceof Node) {
        return object;
    }
    const tracking = new Set();
    return new Proxy(object, {
        get(target, key, receiver) {
            const value = Reflect.get(target, key, receiver);
            if (typeof value === "function" &&
                ((target instanceof Array && arrayKeys.has(key)) ||
                    (target instanceof Set && setKeys.has(key)) ||
                    (target instanceof Map && mapKeys.has(key)))) {
                return function () {
                    const result = value.apply(this, arguments);
                    tracking.forEach((effect) => effect.run());
                    return result;
                };
            }
            if (__DEV__)
                devLog(`property ${String(key)} of store ${target[Symbol.toStringTag] || "Object"}`, "accessed", options?.name);
            const scope = getScope();
            if (scope) {
                scope.track(tracking);
                tracking.add(scope);
            }
            if (typeof value === "object") {
                return createStore(value);
            }
            else {
                return value;
            }
        },
        set(...args) {
            if (__DEV__)
                devLog(`property ${String(args[1])} of store ${args[0][Symbol.toStringTag] || "Object"}`, "set", options?.name);
            const result = Reflect.set(...args);
            tracking.forEach((effect) => effect.run());
            return result;
        },
    });
}
export function createManualStore(object, options) {
    const tracking = new Set();
    const proxy = new Proxy(object, {
        get(target, key, receiver) {
            const value = Reflect.get(target, key, receiver);
            if (__DEV__)
                devLog(`property ${String(key)} of manual reactive ${target[Symbol.toStringTag] || "Object"}`, "accessed", options?.name);
            const scope = getScope();
            if (scope) {
                scope.track(tracking);
                tracking.add(scope);
            }
            if (typeof value === "object" && value) {
                return createStore(value);
            }
            else {
                return value;
            }
        },
    });
    return [proxy, () => tracking.forEach((effect) => effect.run())];
}
