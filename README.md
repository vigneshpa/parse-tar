 #  Parse Tar
A simple TypeScript/JavaScript program to untar files from a tarball.

Streaming untar is planned.

---
## Documentation
This module exports the function parseTar which accepts the tar file as `Blob`, `ArrayBuffer` or any `ArrayBufferLike` objects.
This function will return a promise of array of parsed files with their contents in `contents` property of each file.
This module is written in typescript so intellisence should work automaticalliy