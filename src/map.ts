import { Accessor, createEffect, createSignal, Setter } from "./primitives.js";
import { createManualStore } from "./reactivity.js";

export function map<T, U>(
  list: Iterable<T>,
  fn: (value: T, index: Accessor<number>) => U,
  options?: { name?: string }
): readonly U[] {
  const cache = new Map<
    T,
    [value: U, index: number, setIndex: Setter<number>]
  >();

  const [result, update] = createManualStore<U[]>([]);

  createEffect(() => {
    let index = -1;
    for (const item of list) {
      const cached = cache.get(item);
      index++;

      if (cached) {
        if (cached[1] !== index) {
          cached[2]((cached[1] = index));
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
