import { For } from "./for.js";
import { h } from "./jsx.js";
import { List } from "./list.js";
import { Maybe } from "./maybe.js";
import { createMemo, createReactive, createSignal } from "./reactivity.js";

const [age, setAge] = createSignal(0, { name: "age" });
const [name, setName] = createSignal("Zachary", { name: "name" });
const plural = createMemo(() => (age() === 1 ? "" : "s"), { name: "plural" });
const isPlural = createMemo(() => age() !== 1, { name: "isPlural" });
const nums = createReactive<number[]>([]);

document.body.appendChild(
  <>
    <input bind:value={[name, setName]} />
    <input bind:numeric={[age, setAge]} />

    <h1>
      {name} is {age} year{plural} old.
    </h1>

    <Maybe when={isPlural}>
      <p>not plural L</p>
    </Maybe>

    <button on:click={() => nums.push(Math.random())}>ayo click me</button>

    <For each={nums}>
      {(num) => (
        <>
          <h2>main: {num}</h2>
          <p>my id: {Math.random()}</p>
        </>
      )}
    </For>
  </>
);
