export function devLog(type: string, action: string, name: string | undefined) {
  if (__DEV__ && name) {
    console.log(`${type} '${name}' ${action}`);
  }
}

export function startDevScope(name: string | undefined) {
  if (__DEV__ && name) {
    console.group(name);
  }
}

export function endDevScope(name: string | undefined) {
  if (__DEV__ && name) {
    console.groupEnd();
  }
}

// This variable can be inlined by esbuild and other builders.
globalThis.__DEV__ = true;

declare global {
  var __DEV__: boolean;
}
