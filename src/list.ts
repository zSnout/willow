import { WillowFragment } from "./fragment.js";
import { createEffect, unref, ValueOrAccessor } from "./reactivity.js";

export function List({
  children,
}: {
  children: ValueOrAccessor<Iterable<JSX.Element>>;
}): JSX.Element {
  const node = new WillowFragment();

  createEffect(
    () => {
      node.replaceChildrenWith(...unref(children));
    },
    { name: "<List>" }
  );

  return node;
}
