export class LWWRegister<T> {
  readonly id: string;
  state: [peerId: string, timestamp: number, value: T];

  constructor(id: string, state: [string, number, T]) {
    this.id = id;
    this.state = state;
  }

  get value(): T {
    return this.state[2];
  }

  set(value: T): void {
    this.state = [this.id, this.state[1] + 1, value];
  }

  merge(state: [peerId: string, timestamp: number, value: T]): void {
    const [remotePeerId, remoteTimestamp] = state;
    const [localPeerId, localTimestamp] = this.state;

    if (localTimestamp > remoteTimestamp) {
      return;
    }

    if (localTimestamp == remoteTimestamp && localPeerId > remotePeerId) {
      return;
    }

    this.state = state;
  }
}
