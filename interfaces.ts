import { LWWRegister } from "./LWWRegister";

interface CRDT<T, S> {
  value: T;
  state: S;
  merge(state: S): void;
}

type Value<T> = {
  [key: string]: T;
};

type State<T> = {
  [key: string]: LWWRegister<T | null>["state"];
};
