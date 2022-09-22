import { isAccessor, isSignal, } from "./primitives.js";
export function toStore(object) {
    const result = Object.create(null);
    for (const key in object) {
        const value = object[key];
        if (isAccessor(value)) {
            Object.defineProperty(result, key, {
                configurable: true,
                enumerable: true,
                get() {
                    return value();
                },
            });
        }
        else if (isSignal(value)) {
            Object.defineProperty(result, key, {
                configurable: true,
                enumerable: true,
                get() {
                    return value[0]();
                },
                set(value) {
                    return value[1](value);
                },
            });
        }
        else {
            result[key] = value;
        }
    }
    return result;
}
