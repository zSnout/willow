import { createSignal } from "./core.js";
import { h } from "./jsx.js";

const [count, setCount] = createSignal(0);

setInterval(() => setCount(count() + 1));

const h1 = <h1>{count}</h1>;

const page = <>{h1}</>;

document.body.appendChild(page);
