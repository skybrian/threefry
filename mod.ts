// adapted from:
// https://github.com/DEShawResearch/random123/blob/main/include/Random123/threefry.h
/*
Copyright 2010-2011, D. E. Shaw Research.
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are
met:

* Redistributions of source code must retain the above copyright
  notice, this list of conditions, and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright
  notice, this list of conditions, and the following disclaimer in the
  documentation and/or other materials provided with the distribution.

* Neither the name of D. E. Shaw Research nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
"AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

type Counter = Uint32Array;
type Key = Uint32Array;

const skein_ks_parity = 0x1BD11BDA;

export function rotl(x: number, n: number) {
  return (x << (n & 31)) | (x >>> ((32 - n) & 31));
}

export function threefry4x32(
  counter: Counter,
  key: Key,
): Counter {
  const ks0 = key[0];
  const ks1 = key[1];
  const ks2 = key[2];
  const ks3 = key[3];
  const ks4 = skein_ks_parity ^ ks0 ^ ks1 ^ ks2 ^ ks3;

  let X0 = (counter[0] + ks0) | 0;
  let X1 = (counter[1] + ks1) | 0;
  let X2 = (counter[2] + ks2) | 0;
  let X3 = (counter[3] + ks3) | 0;

  // deno-fmt-ignore
  {
    // round >0
    X0 = (X0 + X1) | 0; X1 = rotl(X1, 10); X1 ^= X0;
    X2 = (X2 + X3) | 0; X3 = rotl(X3, 26); X3 ^= X2;

    // round >1
    X0 = (X0 + X3) | 0; X3 = rotl(X3, 11); X3 ^= X0;
    X2 = (X2 + X1) | 0; X1 = rotl(X1, 21); X1 ^= X2;

    // round >2
    X0 = (X0 + X1) | 0; X1 = rotl(X1, 13); X1 ^= X0;
    X2 = (X2 + X3) | 0; X3 = rotl(X3, 27); X3 ^= X2;

    // round >3
    X0 = (X0 + X3) | 0; X3 = rotl(X3, 23); X3 ^= X0;
    X2 = (X2 + X1) | 0; X1 = rotl(X1, 5); X1 ^= X2;

    // inject key
    X0 = (X0 + ks1) | 0; X1 = (X1 + ks2) | 0; X2 = (X2 + ks3)|0; X3 = (X3 + ks4) | 0;
    X3 = (X3 + 1) | 0;

    // round >4
    X0 = (X0 + X1) | 0; X1 = rotl(X1, 6); X1 ^= X0;
    X2 = (X2 + X3) | 0; X3 = rotl(X3, 20); X3 ^= X2;

    // round >5
    X0 = (X0 + X3) | 0; X3 = rotl(X3, 17); X3 ^= X0;
    X2 = (X2 + X1) | 0; X1 = rotl(X1, 11); X1 ^= X2;

    // round >6
    X0 = (X0 + X1) | 0; X1 = rotl(X1, 25); X1 ^= X0;
    X2 = (X2 + X3) | 0; X3 = rotl(X3, 10); X3 ^= X2;

    // round >7
    X0 = (X0 + X3) | 0; X3 = rotl(X3, 18); X3 ^= X0;
    X2 = (X2 + X1) | 0; X1 = rotl(X1, 20); X1 ^= X2;

    // inject key
    X0 = (X0 + ks2) | 0; X1 = (X1 + ks3) | 0; X2 = (X2 + ks4)|0; X3 = (X3 + ks0) | 0;
    X3 = (X3 + 2) | 0;

    // round >8
    X0 = (X0 + X1) | 0; X1 = rotl(X1, 10); X1 ^= X0;
    X2 = (X2 + X3) | 0; X3 = rotl(X3, 26); X3 ^= X2;

    // round >9
    X0 = (X0 + X3) | 0; X3 = rotl(X3, 11); X3 ^= X0;
    X2 = (X2 + X1) | 0; X1 = rotl(X1, 21); X1 ^= X2;

    // round >10
    X0 = (X0 + X1) | 0; X1 = rotl(X1, 13); X1 ^= X0;
    X2 = (X2 + X3) | 0; X3 = rotl(X3, 27); X3 ^= X2;
    
    // round >11
    X0 = (X0 + X3) | 0; X3 = rotl(X3, 23); X3 ^= X0;
    X2 = (X2 + X1) | 0; X1 = rotl(X1, 5); X1 ^= X2;

    // inject key
    X0 = (X0 + ks3) | 0; X1 = (X1 + ks4) | 0; X2 = (X2 + ks0)|0; X3 = (X3 + ks1) | 0;
    X3 = (X3 + 3) | 0;

    // round >12
    X0 = (X0 + X1) | 0; X1 = rotl(X1, 6); X1 ^= X0;
    X2 = (X2 + X3) | 0; X3 = rotl(X3, 20); X3 ^= X2;
  }

  return new Uint32Array([X0, X1, X2, X3]);
}
