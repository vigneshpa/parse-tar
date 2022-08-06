export default function parseTar(
  tarfile: Blob
): Promise<Readonly<TarFile<Blob>>[]>;
export default function parseTar(
  tarfile: ArrayBuffer | ArrayBufferLike
): Readonly<TarFile<Uint8Array>>[];
export default function parseTar(
  tarfile: Blob | ArrayBuffer | ArrayBufferLike
) {
  if (tarfile instanceof Blob) {
    return (async () => {
      const input = new Blob([tarfile]);
      const noOfBlocks = input.size / 512;
      const files: Readonly<TarFile<Blob>>[] = [];
      {
        let blockIdx = 0;
        while (blockIdx < noOfBlocks) {
          const block = input.slice(blockIdx * 512, (blockIdx + 1) * 512);
          if (await isEmptyBlock(block)) break;
          const file = parseTarHeader<Blob>(await block.arrayBuffer());
          const fileBlocksCount = Math.ceil(file.size / 512);
          file.contents = input
            .slice((blockIdx + 1) * 512, (blockIdx + 1 + fileBlocksCount) * 512)
            .slice(0, file.size);
          files.push(Object.freeze(file!));
          blockIdx += fileBlocksCount + 1;
        }
      }
      return files;
    })();
  } else {
    const input = new Uint8Array(tarfile);
    const noOfBlocks = input.byteLength / 512;
    const files: Readonly<TarFile<Uint8Array>>[] = [];
    {
      let blockIdx = 0;
      while (blockIdx < noOfBlocks) {
        const block = input.slice(blockIdx * 512, (blockIdx + 1) * 512);
        if (isEmptyBlock(block)) break;
        const file = parseTarHeader<Uint8Array>(block);
        const fileBlocksCount = Math.ceil(file.size / 512);
        file.contents = input
          .slice((blockIdx + 1) * 512, (blockIdx + 1 + fileBlocksCount) * 512)
          .slice(0, file.size);
        files.push(Object.freeze(file!));
        blockIdx += fileBlocksCount + 1;
      }
      return files;
    }
  }
}
function isEmptyBlock(block: Blob): Promise<boolean>;
function isEmptyBlock(block: Uint8Array): boolean;
function isEmptyBlock(block: Blob | Uint8Array) {
  if (block instanceof Blob)
    return block
      .arrayBuffer()
      .then((val) => new Uint8Array(val))
      .then((buf) => buf.every((val) => val === 0));
  return block.every((val) => val === 0);
}
// https://en.wikipedia.org/wiki/Tar_(computing)#Header
export const enum TarFileType {
  NormalFile = 0,
  HardLink = 1,
  SymbolicLink = 2,
  CharacterSpecial = 3,
  BlockSpecial = 4,
  Directory = 5,
  NamedFIFOPipe = 6,
  ContiguousFile = 7,
  Vendor = "vendor",
}
export class TarFile<T extends Blob | Uint8Array> {
  name: string = "";
  mode: number = 0;
  uid: number = 0;
  gid: number = 0;
  size: number = 0;
  mtime: Date = new Date(0);
  type: TarFileType = TarFileType.NormalFile;
  linkname: string = "";
  contents?: T;
  uname: string = "";
  gname: string = "";
  deviceMajor: number = 0;
  deviceMinor: number = 0;
  fileNamePrefix: string = "";
}
let ustarWarned = false;
function parseTarHeader<T extends Blob | Uint8Array>(header: ArrayBuffer) {
  const file = new TarFile<T>();
  file.name = readString(header, 0, 100);
  file.mode = readOctal(header, 100, 8);
  file.uid = readOctal(header, 108, 8);
  file.gid = readOctal(header, 116, 8);
  file.size = readOctal(header, 124, 12);
  file.mtime = new Date(readOctal(header, 136, 12) * 1000);
  const checksum = readString(header, 148, 8);
  const ftype = readString(header, 156, 1);
  if (ftype)
    if (ftype.charCodeAt(0) >= 48 && ftype.charCodeAt(0) <= 57)
      file.type = ftype.charCodeAt(0);
    else file.type = TarFileType.Vendor;
  else file.type = TarFileType.NormalFile;
  file.linkname = readString(header, 157, 100);

  const ustarIndicator = readString(header, 257, 6);
  if (ustarIndicator === "ustar") {
    file.uname = readString(header, 265, 32);
    file.gname = readString(header, 297, 32);
    file.deviceMajor = readOctal(header, 329, 8);
    file.deviceMinor = readOctal(header, 337, 8);
    file.fileNamePrefix = readString(header, 345, 155);
  } else if (!ustarWarned) {
    console.warn("No Ustar indicator detected in tar file");
    ustarWarned = true;
  }
  return file;
}
function readString(input: ArrayBufferLike, start: number = 0, size?: number) {
  const decoder = new TextDecoder("ascii");
  let buf = new Uint8Array(input.slice(start, size ? start + size : undefined));
  const nullIdx = buf.indexOf(0);
  buf = buf.slice(0, nullIdx);
  return decoder.decode(buf);
}
function readOctal(input: ArrayBufferLike, start: number = 0, end?: number) {
  return parseInt(readString(input, start, end), 8);
}
