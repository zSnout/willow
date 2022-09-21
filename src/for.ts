import { List } from "./list.js";
import { reactiveMap } from "./map.js";
import { Accessor } from "./reactivity.js";

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
}
