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
  Vendor = 'vendor',
}
export class TarFile {
  name: string = '';
  mode: number = 0;
  uid: number = 0;
  gid: number = 0;
  size: number = 0;
  mtime: Date = new Date(0);
  type: TarFileType = TarFileType.NormalFile;
  linkname: string = '';
  contents: Blob = new Blob();
  uname: string = '';
  gname: string = '';
  deviceMajor: number = 0;
  deviceMinor: number = 0;
  fileNamePrefix: string = '';
}
export default async function parseTarHeader(headerBlock: Blob) {
  const header = await headerBlock.arrayBuffer();

  const file = new TarFile();
  file.name = readString(header, 0, 100);
  file.mode = readOctal(header, 100, 8);
  file.uid = readOctal(header, 108, 8);
  file.gid = readOctal(header, 116, 8);
  file.size = readOctal(header, 124, 12);
  file.mtime = new Date(readOctal(header, 136, 12) * 1000);
  const checksum = readString(header, 148, 8);
  const ftype = readString(header, 156, 1);
  if (ftype)
    if (ftype.charCodeAt(0) >= 48 && ftype.charCodeAt(0) <= 57) file.type = ftype.charCodeAt(0);
    else file.type = TarFileType.Vendor;
  else file.type = TarFileType.NormalFile;
  file.linkname = readString(header, 157, 100);

  const ustarIndicator = readString(header, 257, 6);
  if (ustarIndicator === 'ustar') {
    file.uname = readString(header, 265, 32);
    file.gname = readString(header, 297, 32);
    file.deviceMajor = readOctal(header, 329, 8);
    file.deviceMinor = readOctal(header, 337, 8);
    file.fileNamePrefix = readString(header, 345, 155);
  } else console.warn('No Ustar indicator detected in tar file');
  return file;
}
function readString(input: ArrayBufferLike, start: number = 0, size?: number) {
  const decoder = new TextDecoder('ascii');
  let buf = new Uint8Array(input.slice(start, size ? start + size : undefined));
  const nullIdx = buf.indexOf(0);
  buf = buf.slice(0, nullIdx);
  return decoder.decode(buf);
}
function readOctal(input: ArrayBufferLike, start: number = 0, end?: number) {
  return parseInt(readString(input, start, end), 8);
}
