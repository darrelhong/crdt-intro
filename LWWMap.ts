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
}
