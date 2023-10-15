import { LWWRegister } from "./LWWRegister";

const aliceLww = new LWWRegister("alice", ["alice", 0, ""]);

const bobLww = new LWWRegister("bob", ["bob", 0, ""]);

aliceLww.set("foo");
aliceLww.set("foobar");
bobLww.set("bar");
bobLww.set("barf");
// bobLww.set("barfoo");

aliceLww.merge(bobLww.state);

console.log(aliceLww.get());
