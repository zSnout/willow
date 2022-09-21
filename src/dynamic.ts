import { WillowFragment } from "./fragment.js";
import { Accessor, createEffect } from "./reactivity.js";

export function Dynamic({
  children: get,
}: {
  children: Accessor<JSX.Element>;
}): JSX.Element {
  const node = new WillowFragment("Dynamic");

  createEffect(
    () => {
      node.replaceChildrenWith(get());
    },
    { name: "<Dynamic>" }
  );

  return node;
}
