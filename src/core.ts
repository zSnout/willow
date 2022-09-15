export type Read<T> = (() => T) & { write?: Write<T> };
export type MaybeRead<T> = T | Read<T>;

export type Write<T> = (value: T) => void;
export type Signal<T> = Read<T> & { write: Write<T> };

export type Effect = () => void;

export type Executor<T> = (signal: Signal<T>) => void;

let currentScope: EffectScope | undefined;

export function getScope() {
  return currentScope;
}

export class EffectScope {
  readonly onCleanup = new Set<Effect>();

  constructor(readonly effect: Effect) {}

  cleanup() {
    const onCleanup = [...this.onCleanup];
    this.onCleanup.clear();
    onCleanup.forEach((fn) => fn());
  }

  activate() {
    const parentScope = currentScope;

    if (parentScope) {
      parentScope.onCleanup.add(() => this.cleanup());
    }

    currentScope = this;

    return () => {
      currentScope = parentScope;
    };
  }
}

export function isSignal(value: unknown): value is Read<unknown> {
  return typeof value === "function";
}

export function createSignal<T>(value: T): Signal<T> {
  const tracking = new Set<EffectScope>();

  const signal: Signal<T> = (() => {
    const scope = currentScope;

    if (scope) {
      scope.onCleanup.add(() => tracking.delete(scope));
      tracking.add(scope);
    }

    return value;
  }) as any;

  signal.write = (val: T) => {
    value = val;
    tracking.forEach((scope) => scope.effect());
  };

  return signal;
}

export function readOnly<T>(signal: Signal<T>): Read<T> {
  return () => signal();
}

export function createEffect(effect: Effect): void {
  const scope = new EffectScope(effect);
  const deactivate = scope.activate();
  effect();
  deactivate();
}

export function createMemo<T>(update: Read<T>): Read<T> {
  const scope = new EffectScope(() => signal.write(update()));
  const deactivate = scope.activate();
  const signal = createSignal<T>(update());
  deactivate();
  return readOnly(signal);
}

export function createReadable<T>(value: T, executor: Executor<T>) {
  const signal = createSignal<T>(value);
  executor(signal);
  return readOnly(signal);
}

export function untrack<T>(read: Read<T>) {
  const parentScope = currentScope;
  currentScope = undefined;
  const value = read();
  currentScope = parentScope;
  return value;
}
