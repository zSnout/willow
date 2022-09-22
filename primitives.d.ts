export declare type Accessor<T> = () => T;
export declare type Setter<T> = (value: T) => void;
export declare type Updater<T> = (update: (oldValue: T) => T) => void;
export declare type SetterAndUpdater<T> = Setter<T> & Updater<T>;
export declare type ValueOrAccessor<T> = [T] extends [Accessor<infer U>] ? U | Accessor<U> : T | Accessor<T>;
export declare type Signal<T> = [get: Accessor<T>, set: Setter<T> & Updater<T>];
export declare type Effect = () => void;
export declare function getScope(): EffectScope | undefined;
export declare class EffectScope {
    private readonly effect;
    readonly name?: string | undefined;
    private readonly t;
    /** children */
    private readonly c;
    constructor(effect: Effect, name?: string | undefined);
    track(set: Set<EffectScope>): void;
    cleanup(): void;
    run(): void;
}
export declare function createSignal<T = any>(): Signal<T | undefined>;
export declare function createSignal<T>(value: T, options?: {
    name?: string;
}): Signal<T>;
export declare function createEffect(effect: Effect, options?: {
    name?: string;
}): EffectScope;
export declare function isAccessor(value: unknown): value is Accessor<any>;
export declare function isSetter(value: unknown): value is Setter<any>;
export declare function isSignal(value: unknown): value is Signal<any>;
export declare function untrack<T>(accessor: Accessor<T>, options?: {
    name?: string;
}): T;
