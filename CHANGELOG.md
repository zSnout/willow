# Repo Link - 0.4.8 (October 27, 2022)

This version adds a link to the GitHub repo.

# Web Components - 0.4.1 through 0.4.7 (October 18, 2022)

The old WillowElement component has been removed. Instead, we have a new shadow
DOM based component: WillowElement (v2)!

## Replaced Classes

### `WillowElement`

is a custom element constructor and provides shadow root functionality. To use
it, you must create a subclass and provide a `render` method that returns a DOM
node. To get the value of existing attributes, use the `.attribute()` method.

```ts
export abstract class WillowElement extends HTMLElement {
  static observedAttributes?: readonly string[];

  connectedCallback?(): void;
  disconnectedCallback?(): void;
  adoptedCallback?(): void;

  styles?: string | Accessor<string>;

  shadowRoot: ShadowRoot;

  constructor();

  abstract render(): JSX.Element;

  attribute(name: string): Accessor<string | undefined>;
  attribute<T extends number>(name: string, defaultValue: T): Accessor<T>;
  attribute<T extends string>(name: string, defaultValue: T): Accessor<T>;
  attribute<T extends boolean>(name: string, defaultValue: T): Accessor<T>;
}
```

#### `static WillowElement.observedAttributes` (overridable)

is a list of attributes that should be watched by the DOM. See `.attribute()`
for more information.

#### `new WillowElement`

constructs a new component. This will create a shadow root, append a `<style>`
element with the content of the `.styles` property, call the `.render()` method,
and append its return value (if any) to the shadow root.

#### `WillowElement.adoptedCallback` (overridable)

is called when the element's parent node is changed.

#### `WillowElement.attribute`

creates an `Accessor` that reflects the value of a given attribute. If the
attribute's name is in `observedAttributes`, the accessor will update when the
corresponding attribute is changed. It accepts a default value and will force
the accessor's type to match the default value's. If no default value is passed,
the accessor will return a string or `undefined`.

#### `WillowElement.connectedCallback` (overridable)

is called when the element is appended to the DOM.

#### `WillowElement.disconnectedCallback` (overridable)

is called when the element is removed from the DOM.

#### `WillowElement.shadowRoot`

contains the shadow root with this element's content.

#### `WillowElement.styles` (overridable)

has a string or `Accessor<string>` to the scoped styles for this custom element.

# Initial Release - 0.3.6 (September 22, 2022)

0.3.6 brings our biggest update yet. I mean, we could add nothing and it'd be
our biggest update ever: it's our first release. Hooray!

This release is 0.3.6 instead of 0.1.0 because I needed to fix a few things
immediately after releasing 0.1.0, but you can download those from NPM.

## New Components

### `<Await>`

renders a component based on a Promise's state: pending, fulfilled, or rejected.
If it is passed an accessor to a Promise, the component will update when the
accessor's value changes. Because of the possible ambiguity of a default state,
this component uses named `pending`, `then`, and `catch` props instead of
accepting children.

```ts
declare function Await<T>(props: {
  value: ValueOrAccessor<T>;
  pending?: JSX.Element;
  then?: (value: Awaited<T>) => JSX.Element;
  catch?: (error: unknown) => JSX.Element;
}): JSX.Element;
```

### `<Dynamic>`

creates an element and replaces it whenever the accessor passed to it changes.

```ts
declare function Dynamic(props: {
  children: Accessor<JSX.Element>;
}): JSX.Element;
```

### `<For>`

takes an iterable of values (e.g. an array, Set, or Map), maps them through a
function, and outputs the results into a `WillowFragment`. In order to respond
to changes, it may be passed a store. When changes occur, it attempts to reuse
old nodes and move them around instead of creating new nodes. It uses the value
of an object to cache new DOM nodes instead of a manual key function. This
**_requires_** that all of the iterable's items have a different value. If they
don't, unexpected errors will occur.

```ts
declare function For<T>(props: {
  children: (value: T, index: Accessor<number>) => JSX.Element;
  each: Iterable<T>;
}): JSX.Element;
```

### `<List>`

accepts an iterable (e.g. an array, Set, or Map) of DOM nodes or an accessor to
them and renders them into the DOM. It updates the nodes whenever the underlying
accessor or iterable changes. To receive updates on a plain iterable, it must be
wrapped in a store.

```ts
declare function List(props: {
  children: ValueOrAccessor<Iterable<JSX.Element>>;
}): JSX.Element;
```

### `<Maybe>`

conditionally renders a node and an optional fallback if the condition is false.
It changes the output node whenever the accessor passed to it changes.

```ts
declare function Maybe(props: {
  when: ValueOrAccessor<boolean>;
  fallback?: JSX.Element;
  children: JSX.Element;
}): JSX.Element;
```

## New Functions

### `cleanupNode`

cleans up listeners associated with a DOM node.

```ts
declare function cleanupNode(node: Node): void;
```

### `createComputed`

creates a new computed signal. It is like a memo, but the callback is passed its
previous value and takes an initial value. If not passed an initial value, the
updater may be passed `undefined`.

```ts
declare function createComputed<T>(
  update: Updater<T | undefined, T>
): Accessor<T>;

declare function createComputed<T>(value: T, update: Updater<T>): Accessor<T>;
```

### `createEffect`

creates a new effect. The callback provided is called once to set up tracking on
any signals accessed. Whenever linked signals change, the effect is rerun. A
`name` may be passed for debugging purposes.

```ts
declare function createEffect(
  effect: Effect,
  options?: { name?: string }
): EffectScope;
```

### `createMemo`

creates a memo. A memo caches the value returned by its accessor and updates it
whenever signals accessed in the callback are changed. It output an accessor to
the underlying value and notifies linked effects when its value changes.

```ts
declare function createMemo<T>(
  update: Accessor<T>,
  options?: { name?: string }
): Accessor<T>;
```

### `createManualStore`

creates a new manual store. It outputs a tuple of two items: a proxy to a store
and an updater function. The proxy tracks when its properties are accessed in
effects and links those effects. Then, calling the updater will rerun all of
these linked effects. A `name` may be passed for debugging purposes.

```ts
function createManualStore<T extends object>(
  object: T,
  options?: { name?: string }
): ManualStore<T>;
```

### `createSignal`

creates a new signal with an initial value. It returns a tuple of two elements:
an accessor and a setter. The accessor may be called from within an effect to
get the current value of the signal. The setter may be called with a value to
set the signal's value and notify linked effects about the change. The setter
can also be called with an updater function that takes the old signal value and
returns the new one. A `name` may be passed for debugging purposes.

```ts
declare function createSignal<T = any>(): Signal<T | undefined>;
declare function createSignal<T>(
  value: T,
  options?: { name?: string }
): Signal<T>;
```

### `createStore`

creates a reactive store. When a property is accessed, it returns the object's
property and links the current effect. When that property is set, it reruns any
linked effects. In essence, it works like a signal, but for objects. When passed
an array, Set, or Map, calling any methods which mutate the object (e.g. push,
set, clear) will also trigger linked effects. A `name` may be passed for
debugging purposes.

```ts
declare function createStore<T extends object>(
  object: T,
  options?: { name?: string }
): T;
```

### `getScope`

gets the current effect scope and returns it. It may return `undefined` if no
scope exists at the moment.

```ts
declare function getScope(): EffectScope | undefined;
```

### `h`

is used to create new DOM nodes. It takes one of two signatures. The first
accepts the name of an HTML or SVG tag, a list of properties, and an array of
children. It has the _exact_ same signature as `React.createElement`, so it
should be familiar to those coming from that framework. The second accepts a
component constructor, a list of properties, and an array to pass to the
component's `children` prop. The actual typings are more complex and cover
stricter types. In most cases, using JSX with the automatic JSX runtime or the
`h` function works.

```ts
declare function h(component: () => JSX.Element): JSX.Element;

declare function h<P extends JSX.Props>(
  component: JSX.FcOrCc<P>,
  props: P
): JSX.Element;

declare function h<P extends JSX.Props>(
  component: JSX.FcOrCc<P>,
  props: Omit<P, "children">,
  ...children: JSX.ChildrenAsArray<P>
): JSX.Element;

declare function h<
  K extends keyof JSX.IntrinsicElements & keyof HTMLElementTagNameMap
>(
  tag: K,
  props?: JSX.IntrinsicElements[K] | null,
  ...children: JSX.Child[]
): HTMLElementTagNameMap[K];

declare function h<
  K extends keyof JSX.IntrinsicElements & keyof SVGElementTagNameMap
>(
  tag: K,
  props?: JSX.IntrinsicElements[K] | null,
  ...children: JSX.Child[]
): SVGElementTagNameMap[K];

declare function h<K extends keyof JSX.IntrinsicElements>(
  tag: K,
  props?: JSX.IntrinsicElements[K] | null,
  ...children: JSX.Child[]
): JSX.Element;
```

### `h.f`

creates fragments. It can be used in TypeScript's `jsxFragmentFactory` config
option to provide proper typing and support for `<> ... </>` syntax.
Alternatively, you may pass it a `children` prop to construct it without the
overhead of `h`.

<!-- prettier-ignore -->
```ts
declare namespace h {
  function f(props: {
    children: JSX.Child;
  }): WillowFragment;
}
```

### `isAccessor`

checks whether a value is an accessor for a signal or memo. Under the hood, it
just checks if the value is a function.

```ts
declare function isAccessor(value: unknown): value is Accessor<any>;
```

### `isSetter`

checks whether a value is an setter for a signal. Under the hood, it just checks
if the value is a function.

```ts
declare function isSetter(value: unknown): value is Setter<any>;
```

### `isSignal`

checks whether a value is a signal. Under the hood, it just checks if the value
is an array of two elements: an accessor and a setter.

```ts
declare function isSignal(value: unknown): value is Signal<any>;
```

### `map`

takes an iterable of values (e.g. an array, Set, or Map), maps them through a
function, and outputs the results into a store of an array. In order to respond
to changes, it may be passed a store. When changes occur, it attempts to reuse
old outputs and move them around instead of creating new outputs. It uses the
value of an object to cache results instead of a manual key function. This
**_requires_** that all of the iterable's items have a different value. If they
don't, unexpected errors will occur. A `name` may be passed for debugging
purposes.

```ts
declare function map<T, U>(
  list: Iterable<T>,
  fn: (value: T, index: Accessor<number>) => U,
  options?: { name?: string }
): U[];
```

### `toStore`

accepts an object whose properties may be accessors and signals. It then returns
a new object with getters and setters for each property. Accessors and standard
properties will be read only and not have setters. Signals will be converted to
a getter and setter pair.

```ts
declare function toStore<T extends object>(object: T): UnwrapNestedAccessors<T>;
```

### `unref`

takes a value or accessor. If passed an accessor, it will call it and return the
underlying value. If passed a value, it returns the value. It can be useful for
unwrapping values that may be values or accessors.

```ts
declare function unref<T>(accessor: ValueOrAccessor<T>): T;
```

### `untrack`

computes a function without tracking any signals accessed within. It may be
directly passed the accessor for a signal or memo to get the value without
tracking the signal or memo in the current effect. It returns the value that the
callback returns. A `name` may be passed for debugging purposes.

```ts
declare function untrack<T>(
  accessor: Accessor<T>,
  options?: {
    name?: string;
  }
): T;
```

## New Classes

### `EffectScope`

is used to create effects and track signals accessed within them.

```ts
declare class EffectScope {
  readonly name?: string | undefined;
  constructor(effect: Effect, name?: string | undefined);
  track(set: Set<EffectScope>): void;
  cleanup(): void;
  run(): void;
}
```

#### `new EffectScope`

creates a new effect scope. It must be passed an effect to run and an optional
`name` used for debugging purposes.

```ts
declare class EffectScope {
  constructor(effect: Effect, name?: string | undefined);
}
```

#### `EffectScope.cleanup`

stops tracking any signals linked with this effect and empties the internal
tracking list. If the effect is rerun after this, the signals will be tracked
again.

```ts
declare class EffectScope {
  cleanup(): void;
}
```

#### `EffectScope.name`

identifies the name of this effect scope. It is used for debugging purposes.

```ts
declare class EffectScope {
  readonly name?: string | undefined;
}
```

#### `EffectScope.run`

sets the current effect scope to `this`, runs the effect passed to the
constructor, and resets the current effect scope to whatever it was previously,
be that a parent scope or `undefined`. Any signals accessed in the effect will
be added to an internal tracking list.

```ts
declare class EffectScope {
  run(): void;
}
```

#### `EffectScope.track`

adds the given set of effects to an internal tracking list. When `.cleanup` is
called, the effect scope will remove itself from this set. This is usually
called by the `createSignal` and `createStore` functions, but user-defined
signals may also use this method.

```ts
declare class EffectScope {
  readonly name?: string | undefined;
  constructor(effect: Effect, name?: string | undefined);
  track(set: Set<EffectScope>): void;
  cleanup(): void;
  run(): void;
}
```

### `WillowElement`

can be used for more advanced components that emit events. To use it, you must
create a subclass of it and provide a `render` function that accepts a list of
properties and returns a DOM node.

```ts
declare abstract class WillowElement<T extends JSX.Props = JSX.Props> {
  static of<T extends JSX.Props>(
    render: (self: WillowElement<T>, props: T) => JSX.Element
  ): typeof WillowElement<T>;

  node: ChildNode;

  [propsSymbol]: T;

  constructor(props: T);

  cleanup(): void;

  emit<K extends keyof T & `on:${string}`>(
    type: K extends `on:${infer T}` ? T : never,
    ...data: Parameters<T[K]>
  ): void;

  abstract render(props: T): JSX.Element;
}
```

#### `new WillowElement`

constructs a new component with a set of props. This will call `.render` once
and set the `node` property to its result.

```ts
declare abstract class WillowElement<T extends JSX.Props = JSX.Props> {
  constructor(props: T);
}
```

#### `static WillowElement.of`

creates a new subclass of `WillowElement`. It accepts a render function that is
passed two arguments: the instance of `WillowElement` and the component's props.
You may call `.emit` on the element instance to emit events and type them
properly.

```ts
class WillowElement<T extends JSX.Props = JSX.Props> {
  static of<T extends JSX.Props>(
    render: (self: WillowElement<T>, props: T) => JSX.Element
  ): typeof WillowElement<T>;
}
```

#### `WillowElement.cleanup`

cleans up any listeners and effects associated with the component.

```ts
class WillowElement<T extends JSX.Props = JSX.Props> {
  cleanup(): void;
}
```

#### `WillowElement.emit`

emits an event to the listener passed to the component's props. It can
optionally send one or more values as data to the object.

```ts
class WillowElement<T extends JSX.Props = JSX.Props> {
  emit<K extends keyof T & `on:${string}`>(
    type: K extends `on:${infer T}` ? T : never,
    ...data: Parameters<T[K]>
  ): void;
}
```

#### `WillowElement.node`

is the outputted DOM node of the component. It is returned by the `render`
function and must not be accessed until then.

```ts
class WillowElement<T extends JSX.Props = JSX.Props> {
  node: ChildNode;
}
```

#### `WillowElement.render`

is run once when the component is initialized. It is passed the props of the
component and must return a DOM node.

```ts
class WillowElement<T extends JSX.Props = JSX.Props> {
  abstract render(props: T): JSX.Element;
}
```

#### `WillowElement[propsSymbol]`

is used to type the props of the element but does _not_ have any actual value.
Accessing this field will result in `undefined` as it is purely a compile-time
construct. Additionally, the symbol used is not exported and cannot be
recreated.

```ts
class WillowElement<T extends JSX.Props = JSX.Props> {
  [propsSymbol]: T;
}
```

### `WillowFragment`

is used as a simple interface for rendering multiple elements into the DOM while
being able to pass them around cleanly. Most of its method simply alter DOM
behavior and aren't new, but there is one new method.

```ts
declare class WillowFragment extends Comment {
  constructor(name?: string);

  after(...nodes: (string | Node)[]): void;
  appendChild<T extends Node>(node: T): T;
  before(...nodes: (string | Node)[]): void;
  get children(): HTMLCollection;
  get childNodes(): NodeListOf<ChildNode>;
  contains(other: Node | null): boolean;
  get firstChild(): ChildNode & NonDocumentTypeChildNode;
  hasChildNodes(): boolean;
  insertBefore<T extends Node>(node: T, child: Node | null): T;
  get lastChild(): (ChildNode & NonDocumentTypeChildNode) | null;
  get nextElementSibling(): Element | null;
  get nextSibling(): ChildNode | null;
  remove(): void;
  removeChild<T extends Node>(child: T): T;
  replaceChild<T extends Node>(node: Node, child: T): T;
  setTo(...nodes: (Node | null | undefined)[]): void;
  replaceWith(...nodes: (string | Node)[]): void;
}
```

#### `new WillowFragment`

constructs a new fragment with an optional name. The name is used in the
underlying Comment's data. It can be helpful for debugging purposes. If not
passed, it defaults to `Fragment`.

```ts
declare class WillowFragment extends Comment {
  constructor(name?: string);
}
```

#### `WillowFragment.setTo`

replaces the children of this fragment with the nodes passed to it. If any nodes
are `null` or `undefined`, they will be skipped. We chose the name `setTo`
instead of `replaceChildrenWith` because the frequent use of it in our codebase
would've increased bundle size too much.

```ts
declare class WillowFragment extends Comment {
  setTo(...nodes: (Node | null | undefined)[]): void;
}
```
