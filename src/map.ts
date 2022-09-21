import {
  Accessor,
  createEffect,
  createReactive,
  createSignal,
  Setter,
  untrack,
} from "./reactivity.js";

export function reactiveMap<T, U>(
  list: Iterable<T>,
  fn: (value: T, index: Accessor<number>) => U,
  options?: { name?: string }
) {
  const cache = new Map<
    T,
    [value: U, index: number, setIndex: Setter<number>]
  >();

  const temp: U[] = [];
  const result = createReactive<U[]>([]);

  createEffect(() => {
    temp.length = 0;

    let index = -1;
    for (const item of list) {
      const cached = cache.get(item);
      index++;

      if (cached) {
        if (cached[1] !== index) {
          cached[2]((cached[1] = index));
        }

        temp[index] = cached[0];
      } else {
        const [getIndex, setIndex] = createSignal(index);
        const value = fn(item, getIndex);
        cache.set(item, [value, index, setIndex]);
        temp[index] = value;
      }
    }

    untrack(() => result.splice(0, result.length, ...temp));
  }, options);

  return result;
}
