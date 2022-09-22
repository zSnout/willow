import { Accessor } from "./primitives.js";
export declare function For<T>({ children: fn, each, }: {
    children: (value: T, index: Accessor<number>) => JSX.Element;
    each: Iterable<T>;
}): JSX.Element;
