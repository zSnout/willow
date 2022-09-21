import { For } from "./for.js";
import { h } from "./jsx.js";
import { Maybe } from "./maybe.js";
import {
  Accessor,
  createMemo,
  createReactive,
  createSignal,
  untrack,
} from "./reactivity.js";

const [age, setAge] = createSignal(0, { name: "age" });
const [name, setName] = createSignal("Zachary", { name: "name" });
const plural = createMemo(() => (age() === 1 ? "" : "s"), { name: "plural" });
const isPlural = createMemo(() => age() !== 1, { name: "isPlural" });
const nums = createReactive<number[]>([]);

function NumberCard(number: number, index: Accessor<number>) {
  return (
    <div>
      <h1>
        My key is {number} at index {index}.
      </h1>

      <p>{Math.random()}</p>

      <button on:click={() => nums.splice(untrack(index), 1)}>remove it</button>
    </div>
  );
}

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

    <button on:click={() => nums.push(Math.random())}>add at end</button>

    <br />

    <button on:click={() => nums.unshift(Math.random())}>add at front</button>

    <br />

    <button
      on:click={() => {
        const index = Math.floor(nums.length * Math.random());
        console.log(index);
        nums.splice(index, 1);
      }}
    >
      remove at random
    </button>

    <For each={nums}>{NumberCard}</For>
  </>
);
