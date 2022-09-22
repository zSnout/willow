import {
  Accessor,
  isAccessor,
  isSignal,
  Signal,
  untrack,
  ValueOrAccessor,
} from "./primitives.js";

export type UnwrapNestedAccessors<T> = {
  readonly [K in keyof T as T[K] extends Signal<any>
    ? never
    : K]: T[K] extends ValueOrAccessor<infer U> ? U : never;
} & {
  [K in keyof T as T[K] extends Signal<any> ? K : never]: T[K] extends Signal<
    infer U
  >
    ? U
    : never;
};

export type MaybeAccessors<T> = {
  [K in keyof T]: T[K] extends Accessor<any>
    ? T[K]
    : T[K] extends Signal<any>
    ? T[K]
    : ValueOrAccessor<T[K]>;
};

export function toStore<T extends object>(
  object: T
): /** We use this format of UnwrapNestedAccessors to display the type better in IDEs. */ {
  [K in keyof UnwrapNestedAccessors<T>]: UnwrapNestedAccessors<T>[K];
} {
  const result = Object.create(null);

  untrack(() => {
    for (const key in object) {
      const value = object[key];

      if (isAccessor(value)) {
        Object.defineProperty(result, key, {
          configurable: true,
          enumerable: true,
          get() {
            return value();
          },
        });
      } else if (isSignal(value)) {
        Object.defineProperty(result, key, {
          configurable: true,
          enumerable: true,
          get() {
            return value[0]();
          },
          set(value) {
            return value[1](value);
          },
        });
      } else {
        Object.defineProperty(result, key, {
          configurable: true,
          enumerable: true,
          get() {
            return object[key];
          },
        });
      }
    }
  });

  return result;
}
