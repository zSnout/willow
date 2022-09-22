import { ValueOrAccessor } from "./primitives.js";
export declare function Maybe({ when, fallback, children, }: {
    when: ValueOrAccessor<boolean>;
    fallback?: JSX.Element;
    children: JSX.Element;
}): JSX.Element;
