import {
  Accessor,
  createEffect,
  createReactive,
  createSignal,
  Setter,
} from "./reactivity.js";

export function reactiveMap<T, U, K>(
  list: Iterable<T>,
  fn: (value: T, index: Accessor<number>) => U,
  key: (value: T) => K = (x) => x as any,
  options?: { name?: string }
) {
  const cache = new Map<
    K,
    [value: U, index: number, setIndex: Setter<number>]
  >();

  const result = createReactive<U[]>([]);

  createEffect(() => {
    let index = -1;
    for (const item of list) {
      const _key = key(item);
      const cached = cache.get(_key);
      index++;

      if (cached) {
        if (cached[1] !== index) {
          cached[2]((cached[1] = index));
          result[index] = cached[0];
        }
      } else {
        const [getIndex, setIndex] = createSignal(index);
        const value = fn(item, getIndex);
        cache.set(_key, [value, index, setIndex]);
        result[index] = value;
      }
    }
  }, options);

  return result;
}
