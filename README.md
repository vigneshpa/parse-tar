 #  Parse Tar
A simple TypeScript/JavaScript program to untar files from a tarball.

Streaming untar is planned.

---
## Documentation
This module exports the `parseTar` function which accepts a tar file as `Blob`, `ArrayBuffer` or any `ArrayBufferLike` objects.

This function will return a promise of array of parsed `TarFiles`.

`TarFile` is a TypeScript class which holds all the information of a file
