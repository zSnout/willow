import { Await } from "../await.js";
import { Dynamic } from "../dynamic.js";
import { For } from "../for.js";
import { h } from "../jsx.js";
import { Maybe } from "../maybe.js";
import { Accessor, createSignal, untrack } from "../primitives.js";
import { createMemo, createStore } from "../reactivity.js";

const [age, setAge] = createSignal(14, { name: "age" });
const [name, setName] = createSignal("Zachary", { name: "name" });
const plural = createMemo(() => (age() === 1 ? "" : "s"), { name: "plural" });
const isPlural = createMemo(() => age() !== 1, { name: "isPlural" });
const numbers = createStore<number[]>([], { name: "number list" });

function wait() {
  return new Promise<any>((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.3) {
        reject(
          new Error(
            `passcode ${(+Math.random().toString().slice(2, 12)).toString(
              36
            )} is bad`
          )
        );
      } else {
        resolve(Math.floor(1000000 * Math.random()));
      }
    }, Math.random() * 5000);
  });
}

function makeWaitSignal() {
  const [get, set] = createSignal(wait(), { name: "wait signal" });

  setInterval(() => {
    set(wait());
  }, 10000);

  return get;
}

function NumberCard(number: number, index: Accessor<number>) {
  return (
    <div style={{ backgroundColor: "black", color: "white" }}>
      <h1>
        My key is {number} at index {index}.
      </h1>

      <p>{Math.random()}</p>

      <button on:click={() => numbers.splice(untrack(index), 1)}>
        remove it
      </button>

      <Await
        value={makeWaitSignal()}
        then={(value) => <>{value}</>}
        catch={() => <>error</>}
        pending={<>pending...</>}
      />
    </div>
  );
}

const [quote, setQuote] = createSignal(
  <blockquote>{Math.random()}</blockquote>,
  { name: "blockquote" }
);

setTimeout(() => {
  setQuote(<p>abc</p>);

  setTimeout(() => {
    setQuote(<h3>another heading</h3>);
  }, 5000);
}, 5000);

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

    <Dynamic>{quote}</Dynamic>

    <button on:click={() => numbers.push(Math.random())}>add at end</button>

    <br />

    <button on:click={() => numbers.unshift(Math.random())}>
      add at front
    </button>

    <br />

    <button
      on:click={() => {
        const index = Math.floor(numbers.length * Math.random());
        console.log(index);
        numbers.splice(index, 1);
      }}
    >
      remove at random
    </button>

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(min(400px, 100%), 1fr))",
        gap: "0.5em",
      }}
    >
      <For each={numbers}>{NumberCard}</For>
    </div>
  </>
);
