import parseTarHeader, { TarFile } from './parseTarHeader';
export { TarFile, TarFileType } from './parseTarHeader';
export default async function parseTar(tarfile: File | Blob | ArrayBuffer | ArrayBufferLike) {
  const input = new Blob([tarfile]);
  const blocks = getBlocks(input);
  let files: Readonly<TarFile>[] = [];
  {
    let mode: 'header' | 'file' = 'header';
    let file: TarFile;
    let fileBlocks: Blob[] = [];
    let fileBlocksCount = 0;
    let fileIdx = 0;
    for (const block of blocks) {
      if (mode === 'file') {
        if (fileIdx < fileBlocksCount) {
          fileBlocks.push(block);
          fileIdx++;
        } else {
          file!.contents = new Blob(fileBlocks).slice(0, file!.size);
          files.push(Object.freeze(file!));
          if (await isEmptyBlock(block)) break;
          mode = 'header';
        }
      }
      if (mode === 'header') {
        file = await parseTarHeader(block);
        mode = 'file';
        fileBlocks = [];
        fileBlocksCount = Math.ceil(file.size / 512);
        fileIdx = 0;
      }
    }
  }
  return files;
}
function getBlocks(input: Blob, size = 512) {
  const noOfBlocks = Math.floor(input.size / size);
  const ret: Blob[] = [];
  for (let i = 0; i < noOfBlocks; i++) {
    ret.push(input.slice(i * size, (i + 1) * size));
  }
  return ret;
}

async function isEmptyBlock(block: Blob) {
  const buf = new Uint8Array(await block.arrayBuffer());
  return buf.every(val => val === 0);
}
