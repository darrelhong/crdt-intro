import { LWWRegister } from "./LWWRegister";
import { State } from "./interfaces";

export class LWWMap<T> {
  readonly id: string;
  data = new Map<string, LWWRegister<T | null>>();

  constructor(id: string, state: State<T>) {
    this.id = id;

    for (const [key, register] of Object.entries(state)) {
      this.data.set(key, new LWWRegister(this.id, register));
    }
  }
}
