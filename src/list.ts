import { WillowFragment } from "./fragment.js";
import { createEffect, ValueOrAccessor } from "./primitives.js";
import { unref } from "./reactivity.js";

export function List({
  children,
}: {
  children: ValueOrAccessor<Iterable<JSX.Element>>;
}): JSX.Element {
  const node = new WillowFragment("List");

  createEffect(() => node.setTo(...unref(children)), { name: "<List>" });

  return node;
}
