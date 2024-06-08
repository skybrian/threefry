import { describe, it } from "@std/testing/bdd";
import { assertEquals } from "@std/assert";

import { rotl, threefry4x32 } from "./mod.ts";

function asHex(arr: number[] | Uint32Array): string[] {
  return Array.from(arr).map((num) =>
    (num >>> 0).toString(16).padStart(8, "0")
  );
}

describe("rotl", () => {
  it("rotates numbers to the left", () => {
    assertEquals(rotl(1, 0), 1);
    assertEquals(rotl(1, 1), 2);
    assertEquals(rotl(1, 30), 0x40000000);
  });
  it("wraps around for bits shifted off to the right", () => {
    assertEquals(rotl(1, 31), -0x80000000);
    assertEquals(rotl(2, 31), 1);
    assertEquals(asHex([rotl(0xdeadbeef, 32)]), asHex([0xdeadbeef]));
    assertEquals(asHex([rotl(0xdeadbeef, 20)]), asHex([0xeefdeadb]));
  });
});

// Known answers for 13 rounds, from:
// https://github.com/DEShawResearch/random123/blob/main/tests/kat_vectors

const zeros = new Uint32Array([0, 0, 0, 0]);
const ones = new Uint32Array([0xffffffff, 0xffffffff, 0xffffffff, 0xffffffff]);
const pi = new Uint32Array([
  0x243f6a88,
  0x85a308d3,
  0x13198a2e,
  0x03707344,
  0xa4093822,
  0x299f31d0,
  0x082efa98,
  0xec4e6c89,
]);

const known = [{
  name: "zeros",
  counter: zeros,
  key: zeros,
  answer: new Uint32Array([0x531c7e4f, 0x39491ee5, 0x2c855a92, 0x3d6abf9a]),
}, {
  name: "ones",
  counter: ones,
  key: ones,
  answer: new Uint32Array([0xc4189358, 0x1c9cc83a, 0xd5881c67, 0x6a0a89e0]),
}, {
  name: "pi",
  counter: pi.slice(0, 4),
  key: pi.slice(4, 8),
  answer: new Uint32Array([0x4aa71d8f, 0x734738c2, 0x431fc6a8, 0xae6debf1]),
}];

describe("threefry4x32", () => {
  describe("returns known answers", () => {
    for (const example of known) {
      it(`for ${example.name}`, () => {
        assertEquals(
          asHex(threefry4x32(example.counter, example.key)),
          asHex(example.answer),
        );
      });
    }
  });
});
