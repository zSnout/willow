import { createEffect } from "./reactivity.js";

export function List({
  children,
}: {
  children: readonly JSX.Element[];
}): JSX.Element {
  const fallback = document.createComment(" DynamicList ");
  let prev: JSX.Element[] = [];

  createEffect(() => {
    prev.forEach((element) => element.remove());

    let last: ChildNode = fallback;
    for (const element of children) {
      console.log(element);

      last.parentNode?.insertBefore(element, last.nextSibling);
      last = element;
    }
  });

  return fallback;
}
