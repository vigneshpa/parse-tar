import parseTar from '../src/parseTar';
import { decompressSync } from 'fflate';
(async () => {
  const file = await fetch(new URL('./file.tar.gz', import.meta.url)).then(val => val.blob());
  const tar = decompressSync(new Uint8Array(await file.arrayBuffer()));
  console.log({ tar });
  const files = await parseTar(tar);
  console.log(files);
  console.log(Promise.all([...files.map(val => val.contents.text())]));
})();
