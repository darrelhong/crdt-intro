import { LWWRegister } from "./LWWRegister";
import { State, Value } from "./interfaces";

export class LWWMap<T> {
  readonly id: string;
  data = new Map<string, LWWRegister<T | null>>();

  constructor(id: string, state: State<T>) {
    this.id = id;

    for (const [key, register] of Object.entries(state)) {
      this.data.set(key, new LWWRegister(this.id, register));
    }
  }

  get value(): Value<T> {
    const value: Value<T> = {};

    for (const [key, register] of this.data.entries()) {
      if (register.value !== null) {
        value[key] = register.value;
      }
    }
    return value;
  }

  get state(): State<T> {
    const state: State<T> = {};

    for (const [key, register] of this.data.entries()) {
      state[key] = register.state;
    }

    return state;
  }

  merge(state: State<T>): void {
    for (const [key, remoteRegister] of Object.entries(state)) {
      const localRegister = this.data.get(key);

      if (localRegister) {
        localRegister.merge(remoteRegister);
      } else {
        this.data.set(key, new LWWRegister(this.id, remoteRegister));
      }
    }
  }

  set(key: string, value: T): void {
    const register = this.data.get(key);

    if (register) {
      register.set(value);
    }
    this.data.set(key, new LWWRegister(this.id, [this.id, 1, value]));
  }

  get(key: string): T | null | undefined {
    return this.data.get(key)?.value;
  }

  delete(key: string): void {
    this.data.get(key)?.set(null);
  }

  has(key: string): boolean {
    return this.data[key] !== null;
  }
}
