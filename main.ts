import { LWWRegister } from "./LWWRegister";

const aliceLww = new LWWRegister("alice", "");

const bobLww = new LWWRegister("bob", "");

aliceLww.set("foo");
aliceLww.set("foobar");
bobLww.set("bar");
bobLww.set("barf");
// bobLww.set("barfoo");

aliceLww.merge(bobLww.state);

console.log(aliceLww.get());
