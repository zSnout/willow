import { List } from "./list.js";
import { reactiveMap } from "./map.js";
function For({
  children: fn,
  each
}) {
  return List({
    children: reactiveMap(each, fn, { name: "<For>" })
  });
}
export {
  For
};
