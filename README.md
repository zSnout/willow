# Welcome to Willow

What is Willow? Willow

- is a reactive library
- enables JSX syntax
- has static typing
- makes DOM events easy
- works with inputs fluidly
- has simple components

Willow does not aim to

- use a virtual DOM
- recompute components for every update (_cough_ _cough_ React)
- be a custom compiler
- give you every feature possible
- create a custom language

# What's unique about Willow?

Like every web framework, Willow has a few unique features.

First of all, it takes inspiration from SolidJS and copies its Signals, Effects,
and Memos. However, it doesn't add extra features such as `batch` in order to
stay as performant as possible.

In Willow, JSX compiles directly to DOM nodes. This allows you to use standard
DOM operations with Willow elements, such as `.append()` and `.innerHTML`. This
allows Willow components to be used in _almost every other web framework_.

Compiling to DOM nodes has the alternate advantage of not requiring a custom
render function. How do you render a Willow component?
`document.body.append(node)`.

Willow also uses a custom element called a `WillowFragment` to render fragments.
At its core, a `WillowFragment` is basically a hidden element. We'll talk more
about it later. It you want to get to the juicy details, skip to
[How do fragments work?](#how-do-fragments-work).

# The reactivity system

Like Solid, Willow's reactivity system is based on two primitives: Signals and
Effects. A Signal stores a value and notifies linked Effects when it changes. An
Effect can access Signals and runs code whenever its accessed Signals change.
Let's look at how they work in code.

## Signals

```typescript
import { createSignal } from "@zsnout/willow";

const [name, setName] = createSignal("Katniss");

console.log(name()); // Katniss
setName("Everdeen");
console.log(name()); // Everdeen
```

To create a signal, we use `createSignal` and pass it an initial value. It
returns a tuple of two elements. The first is an accessor. When called, it
returns the current value of the Signal. The second is a setter function. When
called with a value, it sets the current value of the signal to its argument and
notifies Effects about the change.

You can also pass a Signal a function taking the previous value and returning
the new one. This can be used to prevent Effects from tracking that Signal.

```typescript
import { createSignal } from "@zsnout/willow";

const [age, setAge] = createSignal(13);

console.log(age()); // 13
setAge((oldAge) => oldAge + 1);
console.log(age()); // 14
```

For TypeScript users, here are the type declarations for Signals:

```typescript
type Accessor<T> = () => T;
type Setter<T> = (value: T) => void;
type Updater<T> = (update: (oldValue: T) => T) => void;
type SetterAndUpdater<T> = Setter<T> & Updater<T>;
type Signal<T> = [get: Accessor<T>, set: SetterAndUpdater<T>];

function createSignal<T = any>(): Signal<T | undefined>;
function createSignal<T>(value: T): Signal<T>;
```

## Effects

Speaking of Effects, let's learn how to use them. We'll update our previous
example to use Effects instead of manual checking.

```typescript
import { createEffect, createSignal } from "@zsnout/willow";

const [name, setName] = createSignal("Harry");

createEffect(() => {
  console.log(name());
});
// The effect is run once and outputs Harry.

setName("Potter");
// The effect automatically reruns and outputs Potter.

setName("");
// The effect automatically reruns and outputs no text.
```

To create an effect, we use `createEffect` and pass a function. The function is
immediately run once and checked for accessed Signals. Whenever these Signals
are changed, the effect is updated synchronously.

## Memos

Memos are a combination of Signals and Effects. They compute a value and update
it whenever its dependencies change.

```typescript
import { createMemo, createSignal } from "@zsnout/willow";

const [number, setNumber] = createSignal(4);
const doubled = createMemo(() => number() * 2);

console.log(number()); // 4
console.log(doubled()); // 8

setNumber(7);
console.log(number()); // 7
console.log(doubled()); // 14
```

In Willow, JSX components use Effects under the hood to update whenever values
change. To Willow, rendering is just a side effect of the reactivity system.

# Let's write some JSX

Now that we understand reactivity, let's use it to write some JSX code. We'll
start by creating a fragment. For those who haven't used them before, a fragment
basically holds a bunch of DOM nodes. When appended to the DOM, they are
rendered without a container element. Willow's fragments are implemented in a
special way, but we'll talk about them later. To write a fragment in JSX, write
an empty HTML tag. That's it!

When writing JSX code, you'll need to import Willow's `h` function. This is used
behind the scenes to render JSX.

```tsx
import { h } from "@zsnout/willow";

const root = <></>;
```

Let's add an HTML element into this that shows the person's name. We'll start by
creating a Signal for their name.

```tsx
import { createSignal, h } from "@zsnout/willow";

const [name, setName] = createSignal("");

const root = (
  <>
    <p>Your name is {name}.</p>
  </>
);
```

Notice how we're not using an Effect to re-render the paragraph when the name
changes. Willow detects that we're passing a Signal and automatically creates an
Effect around it.

### Rendering into the DOM

To render our script into the DOM, we'll use a standard DOM method.

```tsx
import { createSignal, h } from "@zsnout/willow";

const [name, setName] = createSignal("");

const root = (
  <>
    <p>Your name is {name}.</p>
  </>
);

document.body.append(root);
```

### The event system

Let's add an input field and learn how Willow's event system works.

```tsx
import { createSignal, h } from "@zsnout/willow";

const [name, setName] = createSignal("");

const root = (
  <>
    <input value={name} on:input={(event) => setName(event.target.value)} />
    <p>Your name is {name}.</p>
  </>
);

document.body.append(root);
```

Notice how we used curly braces to pass JavaScript expressions to JSX
attributes. This is a common pattern and one you'll see a lot, so make sure to
remember it. Additionally, most JSX attributes accept Signals or direct values.

We also used a `/>` to close the `input` element. While not required in HTML
code, explicitly closing an element is required by JSX law, so make sure to add
it.

You'll also see how Willow uses `on:event` methods to bind event handlers. Most
framework use `onEvent` for native events and `on:event` for custom events, but
Willow simplifies this by using the same syntax for both. You'll also notice
that we used ES6 arrow functions to capture the event parameter and call
`setName`.

### bind:... syntax

This looks like a lot of boilerplate just to work with input fields. Is there an
easier syntax? Of course! Willow provides a few builtin bind:... attributes, and
one of those is bind:value. It accepts a Signal and automatically binds to the
`value` attribute and `on:input` event. Let's use it.

```tsx
import { createSignal, h } from "@zsnout/willow";

const [name, setName] = createSignal("");

const root = (
  <>
    <input bind:value={[name, setName]} />
    <p>Your name is {name}.</p>
  </>
);

document.body.append(root);
```

We've now created a simple form for users to type in their name before we greet
them.

### Using &lt;Maybe&gt;

Something seems off about the demo. Maybe it's that we say "You name is ." when
the input field is empty. Let's fix that by using our first JSX component:
`<Maybe>`.

`<Maybe>` accepts a `when` prop. It should be an accessor that returns a
boolean. In Willow, an accessor is either

1. the first part of a Signal, also known as the getter,
2. a Memo, or
3. a function accepting zero arguments and returning a value.

We'll use the third option in our `<Maybe>` and only show the paragraph when the
user's name is over 3 letters long.

```tsx
import { createSignal, h, Maybe } from "@zsnout/willow";

const [name, setName] = createSignal("");

const root = (
  <>
    <input bind:value={[name, setName]} />

    <Maybe when={() => name().length >= 3}>
      <p>Your name is {name}.</p>
    </Maybe>
  </>
);

document.body.append(root);
```

Congratulations! You've just used your first JSX component. Let's create one by
extracting the `<Maybe>` logic into its own component.

### Creating components

A component is just a function that returns a DOM node or JSX content (but JSX
is just shorthand for DOM nodes). A component accepts one parameter, its props
(short for properties). We'll make a component called `ConditionalName` that
accepts an accessor for its `name`.

In the example below, we use destructuring to get the name prop from the first
argument.

```tsx
import { createSignal, h, Maybe } from "@zsnout/willow";

const [name, setName] = createSignal("");

function ConditionalName({ name }) {
  return (
    <Maybe when={() => name().length >= 3}>
      <p>Your name is {name}.</p>
    </Maybe>
  );
}

const root = (
  <>
    <input bind:value={[name, setName]} />
    <ConditionalName name={name} />
  </>
);

document.body.append(root);
```

We can even extract the whole fragment into a component.

```tsx
import { createSignal, h, Maybe } from "@zsnout/willow";

function NameInput() {
  const [name, setName] = createSignal("");

  return (
    <>
      <input bind:value={[name, setName]} />
      <ConditionalName name={name} />
    </>
  );
}

function ConditionalName({ name }) {
  return (
    <Maybe when={() => name().length >= 3}>
      <p>Your name is {name}.</p>
    </Maybe>
  );
}

const root = <NameInput />;

document.body.append(root);
```

Now that all the code is in separate components, we can use it multiple times.

```tsx
import { createSignal, h, Maybe } from "@zsnout/willow";

function NameInput() {
  const [name, setName] = createSignal("");

  return (
    <>
      <input bind:value={[name, setName]} />
      <ConditionalName name={name} />
    </>
  );
}

function ConditionalName({ name }) {
  return (
    <Maybe when={() => name().length >= 3}>
      <p>Your name is {name}.</p>
    </Maybe>
  );
}

const root = (
  <>
    <p>The first account</p>
    <NameInput />

    <p>The second user</p>
    <NameInput />

    <p>The third wheel</p>
    <NameInput />
  </>
);

document.body.append(root);
```

# How do fragments work?

Okay, let's talk about Willow's fragments now. They're implemented in a very
unusual way, but it's very clever and works without complex reactive systems.

When first designing fragments, the Willow team used native `DocumentFragment`s,
and they seemed pretty good. Unfortunately, `DocumentFragment`s lose their
children when appended to the DOM, so they weren't an optimal choice. Our team
decided to recreate these using our own logic.

We created a `WillowFragment` class that extended a DOM `Comment`. The comment
was to be used as an anchor to which the fragment's children would be appended.
We then created custom getters, setters, and methods for these DOM methods:
after, appendChild, before, children, childNodes, contains, firstChild,
hasChildNodes, insertBefore, lastChild, nextElementSibling, nextSibling, remove,
removeChild, replaceChild, and replaceWith. We then use the DOMNodeInserted and
DOMNodeRemoved events to detect when the element is appended as a child or
removed and append its virtual children after the comment.

The reason we use `WillowFragment`s is that they can be passed around, inserted,
removed, and act like normal DOM nodes. The cost of this amazing addition is a
mere 1.4 kilobytes and makes things easier on any developer working on Willow
projects.
