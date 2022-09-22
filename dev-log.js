function devLog(type, action, name) {
  if (false) {
    console.log(`${type} '${name}' ${action}`);
  }
}
function startDevScope(name) {
  if (false) {
    console.group(name);
  }
}
function endDevScope(name) {
  if (false) {
    console.groupEnd();
  }
}
globalThis.__DEV__ = true;
export {
  devLog,
  endDevScope,
  startDevScope
};
