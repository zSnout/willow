import { get, Signal } from "./reactivity.js";

export namespace Bindable {
  export function value(signal: Signal<string>) {
    return (el: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement) => {
      el.value = get(signal);
      el.addEventListener("input", () => signal.set?.(el.value));
    };
  }

  export function numeric(signal: Signal<number>) {
    return (el: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement) => {
      el.value = "" + +get(signal);
      el.addEventListener("input", () => signal.set?.(+el.value));
    };
  }
}

export type Bindable<T extends HTMLElement> = {
  [K in keyof typeof Bindable as T extends InferElementRequirement<
    typeof Bindable[K]
  >
    ? `bind:${K}`
    : never]?: InferValueRequirement<typeof Bindable[K]>;
};

type InferElementRequirement<T> = T extends (
  value: any
) => (el: infer ElementType) => void
  ? ElementType
  : never;

type InferValueRequirement<T> = T extends (
  value: infer ValueType
) => (el: any) => void
  ? ValueType extends Signal<infer SignalType>
    ? Signal<SignalType>
    : ValueType
  : never;
