import { devLog } from "./dev-log.js";
import {
  Accessor,
  createEffect,
  createSignal,
  Effect,
  EffectScope,
  getScope,
  isAccessor,
  Updater,
  ValueOrAccessor,
} from "./primitives.js";

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

export function createComputed<T>(
  update: Updater<T | undefined, T>
): Accessor<T>;
export function createComputed<T>(value: T, update: Updater<T>): Accessor<T>;
export function createComputed<T>(value: T, update?: (oldValue: T) => T) {
  if (typeof value === "function") {
    [value, update] = [undefined, value] as any;
  }

  const [get, set] = createSignal<T>(0 as any);
  createEffect(() => set((value = update!(value))));
  return get;
}

export function unref<T>(accessor: ValueOrAccessor<T>): T {
  if (isAccessor(accessor)) {
    return accessor();
  } else {
    return accessor as any;
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

export function createStore<T extends object>(
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
          tracking.forEach((effect) => effect.run());
          return result;
        };
      }

      if (__DEV__)
        devLog(
          `property ${String(key)} of store ${
            (target as any)[Symbol.toStringTag] || "Object"
          }`,
          "accessed",
          options?.name
        );

      const scope = getScope();

      if (scope) {
        scope.track(tracking);
        tracking.add(scope);
      }

      if (typeof value === "object") {
        return createStore(value);
      } else {
        return value;
      }
    },
    set(...args) {
      if (__DEV__)
        devLog(
          `property ${String(args[1])} of store ${
            (args[0] as any)[Symbol.toStringTag] || "Object"
          }`,
          "set",
          options?.name
        );

      const result = Reflect.set(...args);
      tracking.forEach((effect) => effect.run());
      return result;
    },
  });
}

export type ManualStore<T> = [proxy: T, update: Effect];

export function createManualStore<T extends object>(
  object: T,
  options?: { name?: string }
): ManualStore<T> {
  const tracking = new Set<EffectScope>();

  const proxy = new Proxy<T>(object, {
    get(target, key, receiver) {
      const value = Reflect.get(target, key, receiver);

      if (__DEV__)
        devLog(
          `property ${String(key)} of manual reactive ${
            (target as any)[Symbol.toStringTag] || "Object"
          }`,
          "accessed",
          options?.name
        );

      const scope = getScope();

      if (scope) {
        scope.track(tracking);
        tracking.add(scope);
      }

      if (typeof value === "object" && value) {
        return createStore(value);
      } else {
        return value;
      }
    },
  });

  return [proxy, () => tracking.forEach((effect) => effect.run())];
}
