import {
  isAccessor,
  isSignal,
  untrack
} from "./primitives.js";
function toStore(object) {
  const result = /* @__PURE__ */ Object.create(null);
  untrack(() => {
    for (const key in object) {
      const value = object[key];
      if (isAccessor(value)) {
        Object.defineProperty(result, key, {
          configurable: true,
          enumerable: true,
          get() {
            return value();
          }
        });
      } else if (isSignal(value)) {
        Object.defineProperty(result, key, {
          configurable: true,
          enumerable: true,
          get() {
            return value[0]();
          },
          set(value2) {
            return value2[1](value2);
          }
        });
      } else {
        Object.defineProperty(result, key, {
          configurable: true,
          enumerable: true,
          get() {
            return object[key];
          }
        });
      }
    }
  });
  return result;
}
export {
  toStore
};
