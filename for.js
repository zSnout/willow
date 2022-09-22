import { List } from "./list.js";
import { map } from "./map.js";
function For({
  children: fn,
  each
}) {
  return List({
    children: map(each, fn, { name: "<For>" })
  });
}
export {
  For
};
