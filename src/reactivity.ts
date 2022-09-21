export type Accessor<T> = () => T;
export type Setter<T> = (value: T) => void;
export type ValueOrAccessor<T> = T | Accessor<T>;
export type Signal<T> = [get: Accessor<T>, set: Setter<T>];

export type Effect = () => void;

export type Executor<T> = (signal: Signal<T>) => void;

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
    if (DEV) devLog("effect", "cleaned up", this.name);

    this.t.forEach((tracker) => tracker.delete(this));
    this.t.clear();
    this.c.forEach((scope) => scope.cleanup());
    this.c.clear();
  }

  run() {
    if (DEV) {
      console.group(this.name || "untrack");
    }

    const parentScope = currentScope;
    currentScope = this;
    this.effect();
    currentScope = parentScope;

    if (DEV) {
      console.groupEnd();
    }
  }
}

export function isAccessor(value: unknown): value is Accessor<any> {
  return typeof value === "function";
}

export function isSignal(value: unknown): value is Signal<any> {
  return (
    Array.isArray(value) &&
    value.length === 2 &&
    typeof value[0] === "function" &&
    typeof value[1] === "function"
  );
}

function devLog(type: string, action: string, name: string | undefined) {
  if (DEV && name) {
    console.log(`${type} '${name}' ${action}`);
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
  const tracking = new Set<EffectScope>();

  const get: Accessor<T> = () => {
    if (DEV) devLog("signal", "accessed", options?.name);

    const scope = currentScope;

    if (scope) {
      scope.track(tracking);
      tracking.add(scope);
    }

    return value!;
  };

  const set: Setter<T> = (val: T) => {
    if (DEV) devLog("signal", "set", options?.name);

    value = val;
    tracking.forEach((scope) => scope.run());
  };

  return [get, set];
}

export function createEffect(effect: Effect, options?: { name?: string }) {
  return new EffectScope(effect, options?.name);
}

export function createMemo<T>(
  update: Accessor<T>,
  options?: { name?: string }
): Accessor<T> {
  const [get, set] = createSignal<T>(0 as any);

  createEffect(
    () => set(update()),
    options?.name ? { name: `memo '${options?.name}'` } : {}
  );

  return get;
}

export function createComputed<T>(value: T, update: (oldValue: T) => T) {
  const [get, set] = createSignal<T>(0 as any);
  createEffect(() => set((value = update(value))));
  return get;
}

export function untrack<T>(
  accessor: Accessor<T>,
  options?: { name?: string }
): T {
  if (DEV) {
    console.group(options?.name || "untrack");
  }

  const parentScope = currentScope;
  currentScope = undefined;
  const value = accessor();
  currentScope = parentScope;

  if (DEV) {
    console.groupEnd();
  }

  return value;
}

export function unref<T>(accessor: ValueOrAccessor<T>): T {
  if (isAccessor(accessor)) {
    return accessor();
  } else {
    return accessor;
  }
}

const arrayKeys = new Set<string | symbol>([
  "pop",
  "push",
  "reverse",
  "shift",
  "sort",
  "splice",
  "unshift",
  "fill",
  "copyWithin",
]);

const setKeys = new Set<string | symbol>(["add", "clear", "delete"]);

const mapKeys = new Set<string | symbol>(["clear", "delete", "set"]);

export function createReactive<T extends object>(
  object: T,
  options?: { name?: string }
): T {
  // Functions and Nodes are excluded from deep reactivity for performance reasons.
  if (typeof object === "function" || object instanceof Node) {
    return object;
  }

  const tracking = new Set<EffectScope>();

  return new Proxy<T>(object, {
    get(target, key, receiver) {
      const value = Reflect.get(target, key, receiver);

      if (
        typeof value === "function" &&
        ((target instanceof Array && arrayKeys.has(key)) ||
          (target instanceof Set && setKeys.has(key)) ||
          (target instanceof Map && mapKeys.has(key)))
      ) {
        return function (this: any) {
          const result = value.apply(this, arguments);
          tracking.forEach((scope) => scope.run());
          return result;
        };
      }

      if (DEV)
        devLog(
          `property ${String(key)} of reactive ${
            (target as any)[Symbol.toStringTag] || "Object"
          }`,
          "accessed",
          options?.name
        );

      const scope = currentScope;

      if (scope) {
        scope.track(tracking);
        tracking.add(scope);
      }

      if (typeof value === "object") {
        return createReactive(value);
      } else {
        return value;
      }
    },
    set(...args) {
      if (DEV)
        devLog(
          `property ${String(args[1])} of reactive ${
            (args[0] as any)[Symbol.toStringTag] || "Object"
          }`,
          "set",
          options?.name
        );

      const result = Reflect.set(...args);
      tracking.forEach((scope) => scope.run());
      return result;
    },
  });
}

globalThis.DEV = true;
