import { List } from "./list.js";
import {
  Accessor,
  createEffect,
  createMemo,
  createReactive,
  createSignal,
  Setter,
  untrack,
} from "./reactivity.js";

export function reactiveMap<T, U, K>(
  list: Iterable<T>,
  fn: (value: T, index: Accessor<number>) => U,
  key: (value: T) => K = (x) => x as any,
  options?: { name?: string }
) {
  const cache = new Map<
    K,
    [value: U, getIndex: Accessor<number>, setIndex: Setter<number>]
  >();

  const temp: U[] = [];
  const result = createReactive<U[]>([]);

  createEffect(() => {
    let index = -1;
    for (const item of list) {
      const _key = key(item);
      const cached = cache.get(_key);
      index++;

      if (cached) {
        cached[2](index);
        temp[index] = cached[0];
      } else {
        const [getIndex, setIndex] = createSignal(index);
        const value = fn(item, getIndex);
        temp[index] = value;
        cache.set(_key, [value, getIndex, setIndex]);
      }
    }

    untrack(() => {
      result.splice(0, result.length, ...temp);
    });
  }, options);

  return result;
}

export function For<T, K>({
  children: fn,
  each,
  key,
}: {
  children: (value: T, index: Accessor<number>) => JSX.Element;
  each: Iterable<T>;
  key?: (value: T) => K;
}) {
  return List({
    children: reactiveMap(each, fn, key, { name: "<For>" }),
  });

  return List({
    children: createMemo(() => [...each].map((v, i) => fn(v, () => i))),
  });
}
