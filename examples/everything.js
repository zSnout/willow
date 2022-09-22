import { Await } from "../await.js";
import { Dynamic } from "../dynamic.js";
import { For } from "../for.js";
import { h } from "../jsx.js";
import { Maybe } from "../maybe.js";
import { createSignal, untrack } from "../primitives.js";
import { createMemo, createStore } from "../reactivity.js";
const [age, setAge] = createSignal(14, { name: "age" });
const [name, setName] = createSignal("Zachary", { name: "name" });
const plural = createMemo(() => (age() === 1 ? "" : "s"), { name: "plural" });
const isPlural = createMemo(() => age() !== 1, { name: "isPlural" });
const nums = createStore([], { name: "number list" });
function wait() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (Math.random() < 0.3) {
                reject(new Error(`passcode ${(+Math.random().toString().slice(2, 12)).toString(36)} is bad`));
            }
            else {
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
function NumberCard(number, index) {
    return (h("div", { style: { backgroundColor: "black", color: "white" } },
        h("h1", null,
            "My key is ",
            number,
            " at index ",
            index,
            "."),
        h("p", null, Math.random()),
        h("button", { "on:click": () => nums.splice(untrack(index), 1) }, "remove it"),
        h(Await, { value: makeWaitSignal(), then: (value) => h(h.f, null, value), catch: () => h(h.f, null, "error"), pending: h(h.f, null, "pending...") })));
}
const [quote, setQuote] = createSignal(h("blockquote", null, Math.random()), { name: "blockquote" });
setTimeout(() => {
    setQuote(h("p", null, "abc"));
    setTimeout(() => {
        setQuote(h("h3", null, "another heading"));
    }, 5000);
}, 5000);
document.body.appendChild(h(h.f, null,
    h("input", { "bind:value": [name, setName] }),
    h("input", { "bind:numeric": [age, setAge] }),
    h("h1", null,
        name,
        " is ",
        age,
        " year",
        plural,
        " old."),
    h(Maybe, { when: isPlural },
        h("p", null, "not plural L")),
    h(Dynamic, null, quote),
    h("button", { "on:click": () => nums.push(Math.random()) }, "add at end"),
    h("br", null),
    h("button", { "on:click": () => nums.unshift(Math.random()) }, "add at front"),
    h("br", null),
    h("button", { "on:click": () => {
            const index = Math.floor(nums.length * Math.random());
            console.log(index);
            nums.splice(index, 1);
        } }, "remove at random"),
    h("div", { style: {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(min(400px, 100%), 1fr))",
            gap: "0.5em",
        } },
        h(For, { each: nums }, NumberCard))));
