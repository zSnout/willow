import { Accessor, Effect, ValueOrAccessor } from "./primitives.js";
export declare function createMemo<T>(update: Accessor<T>, options?: {
    name?: string;
}): Accessor<T>;
export declare function createComputed<T>(value: T, update: (oldValue: T) => T): Accessor<T>;
export declare function unref<T>(accessor: ValueOrAccessor<T>): T;
export declare function createStore<T extends object>(object: T, options?: {
    name?: string;
}): T;
export declare type ManualStore<T> = [proxy: T, update: Effect];
export declare function createManualStore<T extends object>(object: T, options?: {
    name?: string;
}): ManualStore<T>;
