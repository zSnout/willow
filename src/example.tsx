import { h } from "./jsx.js";
import { Maybe } from "./maybe.js";
import { createMemo, createReactive, createSignal } from "./reactivity.js";

const [age, setAge] = createSignal(0, { name: "age" });
const [name, setName] = createSignal("Zachary", { name: "name" });
const plural = createMemo(() => (age() === 1 ? "" : "s"), { name: "plural" });
const isPlural = createMemo(() => age() !== 1, { name: "isPlural" });
const nums = createReactive<JSX.Element[]>([]);

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

    <button on:click={() => nums.push(<p>{Math.random()}</p>)}>
      ayo click me
    </button>
  </>
);
