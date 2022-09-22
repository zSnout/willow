import { WillowFragment } from "./fragment.js";
import { Setter, Signal } from "./primitives.js";
declare namespace Bindable {
    export function value([get, set]: Signal<string>): (el: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement) => void;
    export function numeric([get, set]: Signal<number>): (el: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement) => void;
    type InferElementRequirement<T> = T extends (value: any) => (el: infer ElementType) => void ? ElementType : never;
    type InferValueRequirement<T> = T extends (value: infer ValueType) => (el: any) => void ? ValueType extends Signal<infer SignalType> ? Signal<SignalType> : ValueType : never;
    export type For<T> = {
        [K in keyof typeof Bindable as T extends InferElementRequirement<typeof Bindable[K]> ? `bind:${K}` : never]?: InferValueRequirement<typeof Bindable[K]>;
    };
    export {};
}
export declare type ClassLike = string | ClassLike[] | Record<string, boolean> | undefined | null;
export declare function h(tag: string | JSX.FC<JSX.Props> | JSX.CC<JSX.Props>, props?: JSX.Props | null, ...children: unknown[]): JSX.Element;
export declare namespace h {
    function f({ children }: {
        children: JSX.Child;
    }): WillowFragment;
}
declare const propsSymbol: unique symbol;
export declare abstract class WillowElement<T extends JSX.Props = JSX.Props> {
    static of<T extends JSX.Props>(render: (self: WillowElement<T>, props: T) => JSX.Element): typeof WillowElement<T>;
    node: ChildNode;
    [propsSymbol]: T;
    /** listeners */
    private l;
    constructor(props: T);
    cleanup(): void;
    emit<K extends keyof T & `on:${string}`>(type: K extends `on:${infer T}` ? T : never, ...data: Parameters<T[K]>): void;
    abstract render(props: T): JSX.Element;
}
export declare function cleanupNode(node: Node): void;
declare global {
    namespace JSX {
        type BindableFor<T> = Bindable.For<T>;
        type ElementClass = Element | WillowElement<Props>;
        interface Props {
            [name: string]: any;
            [bindable: `bind:${string}`]: Signal<any>;
            [event: `on:${string}`]: ((value: any) => void) | (() => void);
            [slot: `slot:${string}`]: JSX.Element | ((...args: any) => JSX.Element);
            children?: any;
            use?: Setter<JSX.Element>;
        }
        interface ElementAttributesProperty {
            [propsSymbol]: {};
        }
        interface ElementChildrenAttribute {
            children: {};
        }
        type FC<T extends Props> = (props: T) => Element;
        type CC<T extends Props> = typeof WillowElement<T>;
    }
}
export {};
