import {
  isAccessor,
  isSignal
} from "./primitives.js";
function toStore(object) {
  const result = /* @__PURE__ */ Object.create(null);
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
      result[key] = value;
    }
  }
  return result;
}
export {
  toStore
};
