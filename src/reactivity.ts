export type Accessor<T> = (() => T) & { set?: Setter<T> };
export type Setter<T> = (value: T) => void;
export type ValueOrAccessor<T> = T | Accessor<T>;
export type Signal<T> = Accessor<T> & { set: Setter<T> };

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

export function isAccessor(value: unknown): value is Accessor<unknown> {
  return typeof value === "function";
}

export function isSignal(value: unknown): value is Signal<unknown> {
  return isAccessor(value) && "set" in value;
}

export function createSignal<T = any>(): Signal<T | undefined>;
export function createSignal<T>(value: T): Signal<T>;
export function createSignal<T>(value?: T): Signal<T> {
  const tracking = new Set<EffectScope>();

  const signal: Signal<T> = (() => {
    const scope = currentScope;

    if (scope) {
      scope.onCleanup.add(() => tracking.delete(scope));
      tracking.add(scope);
    }

    return value;
  }) as any;

  signal.set = (val: T) => {
    value = val;
    tracking.forEach((scope) => scope.run());
  };

  return signal;
}

export function createEffect(effect: Effect): void {
  new EffectScope(effect);
}

export function createMemo<T>(update: Accessor<T>): Accessor<T> {
  const signal = createSignal<T>(0 as any);
  createEffect(() => signal.set(update()));
  return () => signal();
}

export function createReadable<T>(value: Signal<T>): Accessor<T>;
export function createReadable<T>(value: T, executor: Executor<T>): Accessor<T>;
export function createReadable<T>(value: T, executor?: Executor<T>) {
  if (!executor) {
    return () => (value as any)();
  }

  const signal = createSignal<T>(value);
  executor(signal);
  return () => signal();
}

export function get<T>(read: Accessor<T>) {
  const parentScope = currentScope;
  currentScope = undefined;
  const value = read();
  currentScope = parentScope;
  return value;
}
