import { createEffect } from "./reactivity.js";

export function List({
  children,
  fallback,
}: {
  children: readonly JSX.Element[];
  fallback?: JSX.Element;
}): JSX.Element {
  if (!fallback) {
    fallback = document.createComment(" DynamicList ");
  }

  let prev: JSX.Element[] = [];

  createEffect(() => {
    prev.forEach((element) => element.remove());

    let last: ChildNode = fallback!;
    for (const element of children) {
      last.parentNode?.insertBefore(element, last.nextSibling);
      last = element;
    }
  });

  return fallback;
}
