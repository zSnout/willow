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
  readonly onCleanup = new Set<Effect>();

  constructor(private readonly effect: Effect) {
    if (currentScope) {
      currentScope.onCleanup.add(() => this.cleanup());
    }

    this.run();
  }

  cleanup() {
    const onCleanup = [...this.onCleanup];
    this.onCleanup.clear();
    onCleanup.forEach((fn) => fn());
  }

  run() {
    const parentScope = currentScope;
    currentScope = this;
    this.effect();
    currentScope = parentScope;
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

export function createSignal<T = any>(): Signal<T | undefined>;
export function createSignal<T>(value: T): Signal<T>;
export function createSignal<T>(value?: T): Signal<T> {
  const tracking = new Set<EffectScope>();

  const get: Accessor<T> = () => {
    const scope = currentScope;

    if (scope) {
      scope.onCleanup.add(() => tracking.delete(scope));
      tracking.add(scope);
    }

    return value!;
  };

  const set: Setter<T> = (val: T) => {
    value = val;
    tracking.forEach((scope) => scope.run());
  };

  return [get, set];
}

export function createEffect(effect: Effect) {
  return new EffectScope(effect);
}

export function createMemo<T>(update: Accessor<T>): Accessor<T> {
  const [get, set] = createSignal<T>(0 as any);
  createEffect(() => set(update()));
  return get;
}

export function createComputed<T>(value: T, update: (oldValue: T) => T) {
  const [get, set] = createSignal<T>(0 as any);
  createEffect(() => set((value = update(value))));
  return get;
}

export function untrack<T>(accessor: Accessor<T>): T {
  const parentScope = currentScope;
  currentScope = undefined;
  const value = accessor();
  currentScope = parentScope;
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

export function createReactive<T extends object>(object: T): T {
  // Functions and Nodes are excluded from deep reactivity for performance reasons.
  if (typeof object === "function" || object instanceof Node) {
    return object;
  }

  const tracking = new Set<EffectScope>();

  return new Proxy<T>(object, {
    get(target, key, receiver) {
      const scope = currentScope;

      if (scope) {
        scope.onCleanup.add(() => tracking.delete(scope));
        tracking.add(scope);
      }

      const value = Reflect.get(target, key, receiver);

      if (typeof value === "object") {
        return createReactive(value);
      } else if (
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
      } else {
        return value;
      }
    },
    set(...args) {
      const result = Reflect.set(...args);
      tracking.forEach((scope) => scope.run());
      return result;
    },
  });
}
