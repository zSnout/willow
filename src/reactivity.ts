export type Accessor<T> = () => T;
export type Setter<T> = (value: T) => void;
export type ValueOrAccessor<T> = T | Accessor<T>;
export type Signal<T> = [get: Accessor<T>, set: Setter<T>];

export type Effect = () => void;

export type Executor<T> = (signal: Signal<T>) => void;

let currentScope: EffectScope | undefined;

export function getScope() {
  return currentScope;
}

export class EffectScope {
  readonly onCleanup = new Set<Effect>();

  constructor(private readonly effect: Effect) {
    if (currentScope) {
      currentScope.onCleanup.add(() => this.cleanup());
    }

    this.run();
  }

  cleanup() {
    const onCleanup = [...this.onCleanup];
    this.onCleanup.clear();
    onCleanup.forEach((fn) => fn());
  }

  run() {
    const parentScope = currentScope;
    currentScope = this;
    this.effect();
    currentScope = parentScope;
  }
}

export function isAccessor(value: unknown): value is Accessor<any> {
  return typeof value === "function";
}

export function isSignal(value: unknown): value is Signal<any> {
  return isAccessor(value) && "set" in value;
}

export function createSignal<T = any>(): Signal<T | undefined>;
export function createSignal<T>(value: T): Signal<T>;
export function createSignal<T>(value?: T): Signal<T> {
  const tracking = new Set<EffectScope>();

  const get: Accessor<T> = () => {
    const scope = currentScope;

    if (scope) {
      scope.onCleanup.add(() => tracking.delete(scope));
      tracking.add(scope);
    }

    return value!;
  };

  const set: Setter<T> = (val: T) => {
    value = val;
    tracking.forEach((scope) => scope.run());
  };

  return [get, set];
}

export function createEffect(effect: Effect): void {
  new EffectScope(effect);
}

export function createMemo<T>(update: Accessor<T>): Accessor<T> {
  const [get, set] = createSignal<T>(0 as any);
  createEffect(() => set(update()));
  return get;
}

export function untrack<T>(accessor: Accessor<T>) {
  const parentScope = currentScope;
  currentScope = undefined;
  const value = accessor();
  currentScope = parentScope;
  return value;
}
