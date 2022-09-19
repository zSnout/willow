import { createComputed, untrack, ValueOrAccessor } from "./reactivity.js";

export function Maybe({
  when,
  fallback,
  children,
}: {
  when: ValueOrAccessor<boolean>;
  fallback?: JSX.Element;
  children: JSX.Element;
}) {
  if (!fallback) {
    fallback = document.createComment(" Maybe ");
  }

  if (typeof when === "boolean") {
    return when ? children : fallback;
  }

  const node = untrack(when) ? children : fallback;

  const computed = createComputed(node, (oldNode) => {
    const node = when() ? children : fallback!;

    if (node !== oldNode) {
      oldNode.replaceWith(node);
    }

    return node;
  });

  return untrack(computed);
}
