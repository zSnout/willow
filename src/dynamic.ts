import { WillowFragment } from "./fragment.js";
import { Accessor, createEffect } from "./primitives.js";

export function Dynamic({
  children: get,
}: {
  children: Accessor<JSX.Element>;
}): JSX.Element {
  const node = new WillowFragment("Dynamic");

  createEffect(
    () => {
      node.setTo(get());
    },
    { name: "<Dynamic>" }
  );

  return node;
}
