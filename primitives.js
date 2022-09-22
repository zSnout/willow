import { devLog, endDevScope, startDevScope } from "./dev-log.js";
let currentScope;
export function getScope() {
    return currentScope;
}
export class EffectScope {
    effect;
    name;
    t = new Set();
    /** children */
    c = new Set();
    constructor(effect, name) {
        this.effect = effect;
        this.name = name;
        currentScope?.c.add(this);
        this.run();
    }
    track(set) {
        this.t.add(set);
    }
    cleanup() {
        if (__DEV__)
            devLog("effect", "cleaned up", this.name);
        this.t.forEach((tracker) => tracker.delete(this));
        this.t.clear();
        this.c.forEach((scope) => scope.cleanup());
        this.c.clear();
    }
    run() {
        if (__DEV__)
            startDevScope(this.name);
        const parentScope = currentScope;
        currentScope = this;
        this.effect();
        currentScope = parentScope;
        if (__DEV__)
            endDevScope(this.name);
    }
}
export function createSignal(value, options) {
    if (__DEV__ && typeof value === "function") {
        console.warn("Signals should not be used to store functions. This may lead to issues when passed to a prop requiring a ValueOrAccessor.");
    }
    const tracking = new Set();
    const get = () => {
        if (__DEV__)
            devLog("signal", "accessed", options?.name);
        const scope = currentScope;
        if (scope) {
            scope.track(tracking);
            tracking.add(scope);
        }
        return value;
    };
    const set = (val) => {
        if (__DEV__)
            devLog("signal", "set", options?.name);
        if (typeof val === "function") {
            value = val(value);
        }
        else {
            value = val;
        }
        tracking.forEach((effect) => effect.run());
    };
    return [get, set];
}
export function createEffect(effect, options) {
    return new EffectScope(effect, options?.name);
}
export function isAccessor(value) {
    return typeof value === "function";
}
export function isSetter(value) {
    return typeof value === "function";
}
export function isSignal(value) {
    return (Array.isArray(value) &&
        value.length === 2 &&
        isAccessor(value[0]) &&
        isSetter(value[1]));
}
export function untrack(accessor, options) {
    if (__DEV__)
        startDevScope(options?.name || "untrack");
    const parentScope = currentScope;
    currentScope = undefined;
    const value = accessor();
    currentScope = parentScope;
    if (__DEV__)
        endDevScope(options?.name || "untrack");
    return value;
}
