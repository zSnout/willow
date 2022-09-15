export type Read<T> = () => T;

export type Write<T> = (value: T) => void;

export type Effect = () => void;

export type Store<T> = [Read<T>, Write<T>];

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

export function createSignal<T>(value: T): Store<T> {
  const tracking = new Set<EffectScope>();

  const read: Read<T> = () => {
    const scope = currentScope;

    if (scope) {
      scope.onCleanup.add(() => tracking.delete(scope));
      tracking.add(scope);
    }

    return value;
  };

  const write: Write<T> = (val: T) => {
    value = val;
    tracking.forEach((scope) => scope.effect());
  };

  return [read, write];
}

export function createEffect(effect: Effect): void {
  const scope = new EffectScope(effect);
  const deactivate = scope.activate();
  effect();
  deactivate();
}

export function createMemo<T>(update: Read<T>): Read<T> {
  const scope = new EffectScope(() => write(update()));
  const deactivate = scope.activate();
  const [read, write] = createSignal<T>(update());
  deactivate();
  return read;
}

export function untrack<T>(read: Read<T>) {
  const parentScope = currentScope;
  currentScope = undefined;
  const value = read();
  currentScope = parentScope;
  return value;
}
