import { Accessor, createEffect, untrack } from "./reactivity";

export function Dynamic({
  children: get,
}: {
  children: Accessor<JSX.Element>;
}) {
  let node = untrack(get);
  createEffect(() => node.replaceWith((node = get())));

  return node;
}
