import { List } from "./list.js";
import { reactiveMap } from "./map.js";
import { Accessor } from "./reactivity.js";

export function For<T>({
  children: fn,
  each,
}: {
  children: (value: T, index: Accessor<number>) => JSX.Element;
  each: Iterable<T>;
}) {
  return List({
    children: reactiveMap(each, fn, { name: "<For>" }),
  });
}
