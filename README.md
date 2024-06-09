This is a port to JavaScript of the threefry4x32 generator from the [random123
C++ library](https://github.com/DEShawResearch/random123).

I ended up not using it because I need a split operation and it's unclear how to
do that. The [SplitMix](https://www.npmjs.com/package/splitmix) generator
directly supports splitting.

But figured I'd upload it anyway, just in case someone wants this particular
generator.
