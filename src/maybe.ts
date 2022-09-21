import { WillowFragment } from "./fragment.js";
import { createEffect, ValueOrAccessor } from "./reactivity.js";

export function Maybe({
  when,
  fallback,
  children,
}: {
  when: ValueOrAccessor<boolean>;
  fallback?: JSX.Element;
  children: JSX.Element;
}) {
  if (typeof when === "boolean") {
    return when ? children : fallback || document.createComment(" Maybe ");
  }

  const node = new WillowFragment("Maybe");

  createEffect(
    () => {
      const result = when() ? children : fallback;

      if (result) {
        node.rcw(result);
      } else {
        node.rcw();
      }
    },
    { name: "<Maybe>" }
  );

  return node;
}
