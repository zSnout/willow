import { createEffect, createSignal } from "./primitives.js";
import { createManualStore } from "./reactivity.js";
function reactiveMap(list, fn, options) {
  const cache = /* @__PURE__ */ new Map();
  const [result, update] = createManualStore([]);
  createEffect(() => {
    let index = -1;
    for (const item of list) {
      const cached = cache.get(item);
      index++;
      if (cached) {
        if (cached[1] !== index) {
          cached[2](cached[1] = index);
          result[index] = cached[0];
        }
      } else {
        const [getIndex, setIndex] = createSignal(index);
        const value = fn(item, getIndex);
        cache.set(item, [value, index, setIndex]);
        result[index] = value;
      }
    }
    result.length = ++index;
    update();
  }, options);
  return result;
}
export {
  reactiveMap
};
