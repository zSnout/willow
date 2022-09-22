export function devLog(type, action, name) {
    if (__DEV__ && name) {
        console.log(`${type} '${name}' ${action}`);
    }
}
export function startDevScope(name) {
    if (__DEV__ && name) {
        console.group(name);
    }
}
export function endDevScope(name) {
    if (__DEV__ && name) {
        console.groupEnd();
    }
}
// This variable can be inlined by esbuild and other builders.
globalThis.__DEV__ = true;
