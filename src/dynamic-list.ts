import { createEffect } from "./reactivity";

export function DynamicList({
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
      last.appendChild(element);
      last = element;
    }
  });

  return fallback;
}
