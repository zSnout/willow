import { List } from "./list.js";
import { map } from "./map.js";
import { Accessor } from "./primitives.js";

export function For<T>({
  children: fn,
  each,
}: {
  children: (value: T, index: Accessor<number>) => JSX.Element;
  each: Iterable<T>;
}) {
  return List({
    children: map(each, fn, { name: "<For>" }),
  });
}
