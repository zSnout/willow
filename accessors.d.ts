import { Accessor, Signal, ValueOrAccessor } from "./primitives.js";
export declare type UnwrapNestedAccessors<T> = {
    readonly [K in keyof T as T[K] extends Signal<any> ? never : K]: T[K] extends ValueOrAccessor<infer U> ? U : never;
} & {
    [K in keyof T as T[K] extends Signal<any> ? K : never]: T[K] extends Signal<infer U> ? U : never;
};
export declare type MaybeAccessors<T> = {
    [K in keyof T]: T[K] extends Accessor<any> ? T[K] : T[K] extends Signal<any> ? T[K] : ValueOrAccessor<T[K]>;
};
export declare function toStore<T extends object>(object: T): {
    [K in keyof UnwrapNestedAccessors<T>]: UnwrapNestedAccessors<T>[K];
};
