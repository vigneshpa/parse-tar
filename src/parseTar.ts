import parseTarHeader, { TarFile } from './parseTarHeader.ts';
export { TarFile, TarFileType } from './parseTarHeader.ts';
export default async function parseTar(tarfile: File | Blob | ArrayBuffer | ArrayBufferLike) {
  const input = new Blob([tarfile]);
  const noOfBlocks = input.size / 512;
  const files: Readonly<TarFile>[] = [];
  {
    let blockIdx = 0;
    while (blockIdx < noOfBlocks) {
      const block = input.slice(blockIdx * 512, (blockIdx + 1) * 512);
      if (await isEmptyBlock(block)) break;
      const file = await parseTarHeader(block);
      const fileBlocksCount = Math.ceil(file.size / 512);
      file.contents = input.slice((blockIdx + 1) * 512, (blockIdx + 1 + fileBlocksCount) * 512).slice(0, file.size);
      files.push(Object.freeze(file!));
      blockIdx += fileBlocksCount + 1;
    }
  }
  return files;
}

async function isEmptyBlock(block: Blob) {
  const buf = new Uint8Array(await block.arrayBuffer());
  return buf.every(val => val === 0);
}
