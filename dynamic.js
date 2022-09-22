import { WillowFragment } from "./fragment.js";
import { createEffect } from "./primitives.js";
function Dynamic({
  children: get
}) {
  const node = new WillowFragment("Dynamic");
  createEffect(
    () => {
      node.setTo(get());
    },
    { name: "<Dynamic>" }
  );
  return node;
}
export {
  Dynamic
};
