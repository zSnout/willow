import { ValueOrAccessor } from "./primitives.js";
export declare function Await<T>({ value, pending, then, catch: c, }: {
    value: ValueOrAccessor<T>;
    pending?: JSX.Element;
    then?: (value: Awaited<T>) => JSX.Element;
    catch?: (error: unknown) => JSX.Element;
}): JSX.Element;
