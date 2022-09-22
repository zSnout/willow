globalThis.__DEV__=!0;var p;function b(){return p}var E=class{constructor(e,n){this.effect=e;this.name=n;p?.c.add(this),this.run()}t=new Set;c=new Set;track(e){this.t.add(e)}cleanup(){this.t.forEach(e=>e.delete(this)),this.t.clear(),this.c.forEach(e=>e.cleanup()),this.c.clear()}run(){let e=p;p=this,this.effect(),p=e}};function m(t,e){let n=new Set;return[()=>{let s=p;return s&&(s.track(n),n.add(s)),t},s=>{typeof s=="function"?t=s(t):t=s,n.forEach(i=>i.run())}]}function a(t,e){return new E(t,e?.name)}function f(t){return typeof t=="function"}function R(t){return typeof t=="function"}function D(t){return Array.isArray(t)&&t.length===2&&f(t[0])&&R(t[1])}function ce(t){let e=Object.create(null);for(let n in t){let r=t[n];f(r)?Object.defineProperty(e,n,{configurable:!0,enumerable:!0,get(){return r()}}):D(r)?Object.defineProperty(e,n,{configurable:!0,enumerable:!0,get(){return r[0]()},set(o){return o[1](o)}}):e[n]=r}return e}var L="addEventListener",y="lastChild",T="splice",v="nextElementSibling",_="nextSibling";var A=class extends Array{item(e){return this[e]}namedItem(e){return this.find(n=>n.nodeName==e)||null}},l=class extends Comment{after(...e){let n=this.n.at(-1);n?n.after(...e):super.after(...e),this.r()}appendChild(e){return this.n.push(e),this.r(),e}before(...e){let n=this.n.at(-1);n?n.before(...e):super.before(...e),this.r()}get children(){return this.n.filter(e=>e instanceof Element)}get childNodes(){return this.n}contains(e){return this==e||this.n.some(n=>n.contains(e))}get firstChild(){return this.n[0]||null}hasChildNodes(){return!!this.n.length}insertBefore(e,n){let r=this.n.indexOf(n);return r==-1||(this.n[T](r,0,e),this.r()),e}get[y](){return this.n.at(-1)||null}get[v](){return this[y]?this[y][v]:super[v]}get[_](){return this[y]?this[y][_]:super[_]}remove(){super.remove(),this.u()}removeChild(e){let n=this.n.indexOf(e);return n==-1||(this.n[T](n,1),this.r()),e}replaceChild(e,n){let r=this.n.indexOf(e);return r==-1||(this.n[T](r,1,n),this.r()),n}setTo(...e){this.u(),this.n[T](0,this.n.length,...e.filter(n=>n)),this.r()}replaceWith(...e){this.u(),super.replaceWith(...e),this.r()}n=new A;constructor(e="Fragment"){super(),this.data=` ${e} `,this[L]("DOMNodeInserted",n=>{n.target==this&&this.r()}),this[L]("DOMNodeRemoved",n=>{n.target==this&&this.u()})}r(){super.after(...this.n.filter(e=>e))}u(){this.n.forEach(e=>e?.remove())}};function he(t,e){let[n,r]=m(0);return a(()=>r(t()),e?.name?{name:`memo '${e?.name}'`}:{}),n}function Se(t,e){let[n,r]=m(0);return a(()=>r(t=e(t))),n}function h(t){return f(t)?t():t}var W=new Set(["pop","push","reverse","shift","sort","splice","unshift","fill","copyWithin"]),B=new Set(["add","clear","delete"]),H=new Set(["clear","delete","set"]);function M(t,e){if(typeof t=="function"||t instanceof Node)return t;let n=new Set;return new Proxy(t,{get(r,o,s){let i=Reflect.get(r,o,s);if(typeof i=="function"&&(r instanceof Array&&W.has(o)||r instanceof Set&&B.has(o)||r instanceof Map&&H.has(o)))return function(){let u=i.apply(this,arguments);return n.forEach(x=>x.run()),u};let c=b();return c&&(c.track(n),n.add(c)),typeof i=="object"?M(i):i},set(...r){let o=Reflect.set(...r);return n.forEach(s=>s.run()),o}})}function J(t,e){let n=new Set;return[new Proxy(t,{get(o,s,i){let c=Reflect.get(o,s,i),u=b();return u&&(u.track(n),n.add(u)),typeof c=="object"&&c?M(c):c}}),()=>n.forEach(o=>o.run())]}function Ae({value:t,pending:e,then:n,catch:r}){let o=new l("Await"),s=0;return a(async()=>{let i=++s;o.setTo(e);try{let c=await h(t);if(s!==i)return;o.setTo(n?.(c))}catch(c){if(s!==i)return;o.setTo(r?.(c))}},{name:"<Await>"}),o}function ke({children:t}){let e=new l("Dynamic");return a(()=>{e.setTo(t())},{name:"<Dynamic>"}),e}function X({children:t}){let e=new l("List");return a(()=>e.setTo(...h(t)),{name:"<List>"}),e}function O(t,e,n){let r=new Map,[o,s]=J([]);return a(()=>{let i=-1;for(let c of t){let u=r.get(c);if(i++,u)u[1]!==i&&(u[2](u[1]=i),o[i]=u[0]);else{let[x,j]=m(i),k=e(c,x);r.set(c,[k,i,j]),o[i]=k}}o.length=++i,s()},n),o}function Re({children:t,each:e}){return X({children:O(e,t,{name:"<For>"})})}var P;(n=>{function t([r,o]){return s=>{let i=!1;a(()=>{i||(s.value=r())},{name:"bind:value"}),S(s,"input",()=>{i=!0,o(s.value),i=!1})}}n.value=t;function e([r,o]){return s=>{let i=!1;a(()=>{i||(s.value=""+r())},{name:"bind:numeric"}),S(s,"input",()=>{i=!0,o(+s.value),i=!1})}}n.numeric=e})(P||={});function U(t){return Array.isArray(t)}var q=new Set(["svg","animate","animateTransform","circle","clipPath","defs","desc","ellipse","feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feDistantLight","feFlood","feFuncA","feFuncB","feFuncG","feFuncR","feGaussianBlur","feImage","feMerge","feMergeNode","feMorphology","feOffset","fePointLight","feSpecularLighting","feSpotLight","feTile","feTurbulence","filter","foreignObject","g","image","line","linearGradient","marker","mask","metadata","path","pattern","polygon","polyline","radialGradient","rect","stop","switch","symbol","text","textPath","tspan","use","view"]);function G(t){return q.has(t)?document.createElementNS("http://www.w3.org/2000/svg",t):document.createElement(t)}function w(t,e){t.appendChild(e)}function S(t,e,n,r=!1){t.addEventListener(e,n,r)}function N(t){return document.createTextNode(""+t)}function K(t,e,n){t.setAttribute(e,""+n)}function z(t){return t instanceof Node}function d(t,e,n){let r=a(e,n);(t.willowScopes||=new Set).add(r)}function C(t,e){if(U(e))e.forEach(n=>C(t,n));else if(f(e)){let n=N("");d(n,()=>n.data=""+e(),{name:"reactive text"}),w(t,n)}else z(e)?w(t,e):w(t,N(e))}function V(t){return typeof t=="string"?t:U(t)?t.map(V).join(" "):typeof t=="object"&&t?Object.entries(t).filter(([,e])=>e).map(([e])=>e).join(" "):""}function $(t,e){if(f(e))d(t,()=>$(t,e()),{name:"css style object"});else if(typeof e=="string")t.setAttribute("style",e);else if(typeof e=="object")for(let n in e){let r=e[n];f(r)?d(t,()=>t.style[n]=r(),{name:`css style.${n}`}):t.style[n]=r}}function F(t,e,...n){if(typeof t=="string"){let r=G(t);C(r,n);for(let o in e){let s=e[o];r instanceof HTMLElement&&(o==="class"||o==="className")?f(s)?d(r,()=>r.className=V(s()),{name:"className"}):r.className=V(s):o==="classList"||(o==="use"?typeof s=="function"&&s(r):o==="style"?$(r,s):o.startsWith("bind:")?P[o.slice(5)](s)(r):o.startsWith("on:")?typeof s=="function"&&S(r,o.slice(3),s):o.startsWith("oncapture:")?typeof s=="function"&&S(r,o.slice(10),s,!0):o.includes("-")?f(s)?d(r,()=>K(r,o,s()),{name:`element attribute ${o}`}):K(r,o,s):f(s)?d(r,()=>r[o]=s(),{name:`element property ${o}`}):r[o]=s)}return r}else if(typeof t=="function"){let r=n.length===1?n[0]:n;n.length&&(e?e.children||(e={...e,children:r}):e={children:r});let o;try{o=t(e)}catch{o=new t(e)}return o instanceof g?o.node:o}throw new TypeError(`willow.h must be passed a tag name or function, but was passed a ${typeof t}`)}(e=>{function t({children:n}){let r=new l;return C(r,n),r}e.f=t})(F||={});var Q=Symbol("willow.propsSymbol"),g=class{static of(e){return class extends g{render(n){return e(this,n)}}}node;[Q];l={};constructor(e){e={...e};for(let n in e)n.startsWith("on:")&&(this.l[n.slice(3)]=e[n]);this.node=this.render(e)}cleanup(){I(this.node),this.node.remove(),this.node=N("")}emit(e,...n){this.l[e]?.(...n)}};function I(t){t.willowScopes?.forEach(e=>e.cleanup()),t.childNodes.forEach(I)}function nt({when:t,fallback:e,children:n}){if(typeof t=="boolean")return t?n:e||document.createComment(" Maybe ");let r=new l("Maybe");return a(()=>{let o=t()?n:e;o?r.setTo(o):r.setTo()},{name:"<Maybe>"}),r}export{Ae as Await,ke as Dynamic,Re as For,X as List,nt as Maybe,g as WillowElement,l as WillowFragment,I as cleanupNode,Se as createComputed,J as createManualStore,he as createMemo,M as createStore,F as h,O as reactiveMap,ce as toStore,h as unref};
