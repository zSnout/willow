import { Accessor } from "./primitives.js";
export declare function map<T, U>(list: Iterable<T>, fn: (value: T, index: Accessor<number>) => U, options?: {
    name?: string;
}): U[];
