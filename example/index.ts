import parseTar from '../src/parseTar';
(async () => {
  const file = await fetch(new URL('./file.tar', import.meta.url)).then(val => val.blob());
  const files = await parseTar(file);
  console.log(
    files,
    files.map(val => val.contents.text())
  );
})();
