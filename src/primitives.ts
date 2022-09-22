import { devLog, endDevScope, startDevScope } from "./dev-log.js";

export type Accessor<T> = () => T;
export type Setter<T> = (value: T) => void;
export type Updater<T> = (update: (oldValue: T) => T) => void;
export type SetterAndUpdater<T> = Setter<T> & Updater<T>;
export type ValueOrAccessor<T> = T | Accessor<T>;
export type Signal<T> = [get: Accessor<T>, set: Setter<T> & Updater<T>];
export type Effect = () => void;

let currentScope: EffectScope | undefined;

export function getScope() {
  return currentScope;
}

export class EffectScope {
  private readonly t = new Set<
    /** `tracking` variable of Signals */ Set<EffectScope>
  >();

  /** children */
  private readonly c = new Set<EffectScope>();

  constructor(private readonly effect: Effect, readonly name?: string) {
    currentScope?.c.add(this);

    this.run();
  }

  track(set: Set<EffectScope>) {
    this.t.add(set);
  }

  cleanup() {
    if (__DEV__) devLog("effect", "cleaned up", this.name);

    this.t.forEach((tracker) => tracker.delete(this));
    this.t.clear();
    this.c.forEach((scope) => scope.cleanup());
    this.c.clear();
  }

  run() {
    if (__DEV__) startDevScope(this.name);

    const parentScope = currentScope;
    currentScope = this;
    this.effect();
    currentScope = parentScope;

    if (__DEV__) endDevScope(this.name);
  }
}

export function createSignal<T = any>(): Signal<T | undefined>;
export function createSignal<T>(
  value: T,
  options?: { name?: string }
): Signal<T>;
export function createSignal<T>(
  value?: T,
  options?: { name?: string }
): Signal<T> {
  if (__DEV__ && typeof value === "function") {
    console.warn(
      "Signals should not be used to store functions. This may lead to issues when passed to a prop requiring a ValueOrAccessor."
    );
  }

  const tracking = new Set<EffectScope>();

  const get: Accessor<T> = () => {
    if (__DEV__) devLog("signal", "accessed", options?.name);

    const scope = currentScope;

    if (scope) {
      scope.track(tracking);
      tracking.add(scope);
    }

    return value!;
  };

  const set: SetterAndUpdater<T> = (val: T | ((oldValue: T) => T)) => {
    if (__DEV__) devLog("signal", "set", options?.name);

    if (typeof val === "function") {
      value = (val as any)(value);
    } else {
      value = val;
    }

    tracking.forEach((effect) => effect.run());
  };

  return [get, set];
}

export function createEffect(effect: Effect, options?: { name?: string }) {
  return new EffectScope(effect, options?.name);
}

export function isAccessor(value: unknown): value is Accessor<any> {
  return typeof value === "function";
}

export function isSetter(value: unknown): value is Setter<any> {
  return typeof value === "function";
}

export function isSignal(value: unknown): value is Signal<any> {
  return (
    Array.isArray(value) &&
    value.length === 2 &&
    isAccessor(value[0]) &&
    isSetter(value[1])
  );
}

export function untrack<T>(
  accessor: Accessor<T>,
  options?: { name?: string }
): T {
  if (__DEV__) startDevScope(options?.name || "untrack");

  const parentScope = currentScope;
  currentScope = undefined;
  const value = accessor();
  currentScope = parentScope;

  if (__DEV__) endDevScope(options?.name || "untrack");

  return value;
}
