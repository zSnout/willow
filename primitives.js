import "./dev-log.js";
let currentScope;
function getScope() {
  return currentScope;
}
class EffectScope {
  constructor(effect, name) {
    this.effect = effect;
    this.name = name;
    currentScope?.c.add(this);
    this.run();
  }
  t = /* @__PURE__ */ new Set();
  c = /* @__PURE__ */ new Set();
  track(set) {
    this.t.add(set);
  }
  cleanup() {
    if (false)
      devLog("effect", "cleaned up", this.name);
    this.t.forEach((tracker) => tracker.delete(this));
    this.t.clear();
    this.c.forEach((scope) => scope.cleanup());
    this.c.clear();
  }
  run() {
    if (false)
      startDevScope(this.name);
    const parentScope = currentScope;
    currentScope = this;
    this.effect();
    currentScope = parentScope;
    if (false)
      endDevScope(this.name);
  }
}
function createSignal(value, options) {
  if (false) {
    console.warn(
      "Signals should not be used to store functions. This may lead to issues when passed to a prop requiring a ValueOrAccessor."
    );
  }
  const tracking = /* @__PURE__ */ new Set();
  const get = () => {
    if (false)
      devLog("signal", "accessed", options?.name);
    const scope = currentScope;
    if (scope) {
      scope.track(tracking);
      tracking.add(scope);
    }
    return value;
  };
  const set = (val) => {
    if (false)
      devLog("signal", "set", options?.name);
    if (typeof val === "function") {
      value = val(value);
    } else {
      value = val;
    }
    tracking.forEach((effect) => effect.run());
  };
  return [get, set];
}
function createEffect(effect, options) {
  return new EffectScope(effect, options?.name);
}
function isAccessor(value) {
  return typeof value === "function";
}
function isSetter(value) {
  return typeof value === "function";
}
function isSignal(value) {
  return Array.isArray(value) && value.length === 2 && isAccessor(value[0]) && isSetter(value[1]);
}
function untrack(accessor, options) {
  if (false)
    startDevScope(options?.name || "untrack");
  const parentScope = currentScope;
  currentScope = void 0;
  const value = accessor();
  currentScope = parentScope;
  if (false)
    endDevScope(options?.name || "untrack");
  return value;
}
export {
  EffectScope,
  createEffect,
  createSignal,
  getScope,
  isAccessor,
  isSetter,
  isSignal,
  untrack
};
