function $parcel$defineInteropFlag(a) {
  Object.defineProperty(a, '__esModule', {value: true, configurable: true});
}
function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$defineInteropFlag(module.exports);

$parcel$export(module.exports, "default", () => $2bdd3d1603727488$export$2e2bcd8739ae039);
$parcel$export(module.exports, "TarFile", () => $f9b86a07e378842e$export$54ab42ec615919cc);
$parcel$export(module.exports, "TarFileType", () => $f9b86a07e378842e$export$bc16dfd6a6ab4662);
let $f9b86a07e378842e$export$bc16dfd6a6ab4662;
(function(TarFileType1) {
    TarFileType1[TarFileType1["NormalFile"] = 0] = "NormalFile";
    TarFileType1[TarFileType1["HardLink"] = 1] = "HardLink";
    TarFileType1[TarFileType1["SymbolicLink"] = 2] = "SymbolicLink";
    TarFileType1[TarFileType1["CharacterSpecial"] = 3] = "CharacterSpecial";
    TarFileType1[TarFileType1["BlockSpecial"] = 4] = "BlockSpecial";
    TarFileType1[TarFileType1["Directory"] = 5] = "Directory";
    TarFileType1[TarFileType1["NamedFIFOPipe"] = 6] = "NamedFIFOPipe";
    TarFileType1[TarFileType1["ContiguousFile"] = 7] = "ContiguousFile";
    TarFileType1["Vendor"] = "vendor";
})($f9b86a07e378842e$export$bc16dfd6a6ab4662 || ($f9b86a07e378842e$export$bc16dfd6a6ab4662 = {}));
class $f9b86a07e378842e$export$54ab42ec615919cc {
    name = "";
    mode = 0;
    uid = 0;
    gid = 0;
    size = 0;
    mtime = new Date(0);
    type = 0;
    linkname = "";
    contents = new Blob();
    uname = "";
    gname = "";
    deviceMajor = 0;
    deviceMinor = 0;
    fileNamePrefix = "";
}
async function $f9b86a07e378842e$export$2e2bcd8739ae039(headerBlock) {
    const header = await headerBlock.arrayBuffer();
    const file = new $f9b86a07e378842e$export$54ab42ec615919cc();
    file.name = $f9b86a07e378842e$var$readString(header, 0, 100);
    file.mode = $f9b86a07e378842e$var$readOctal(header, 100, 8);
    file.uid = $f9b86a07e378842e$var$readOctal(header, 108, 8);
    file.gid = $f9b86a07e378842e$var$readOctal(header, 116, 8);
    file.size = $f9b86a07e378842e$var$readOctal(header, 124, 12);
    file.mtime = new Date($f9b86a07e378842e$var$readOctal(header, 136, 12) * 1000);
    const checksum = $f9b86a07e378842e$var$readString(header, 148, 8);
    const ftype = $f9b86a07e378842e$var$readString(header, 156, 1);
    if (ftype) {
        if (ftype.charCodeAt(0) >= 48 && ftype.charCodeAt(0) <= 57) file.type = ftype.charCodeAt(0);
        else file.type = "vendor";
    } else file.type = 0;
    file.linkname = $f9b86a07e378842e$var$readString(header, 157, 100);
    const ustarIndicator = $f9b86a07e378842e$var$readString(header, 257, 6);
    if (ustarIndicator === "ustar") {
        file.uname = $f9b86a07e378842e$var$readString(header, 265, 32);
        file.gname = $f9b86a07e378842e$var$readString(header, 297, 32);
        file.deviceMajor = $f9b86a07e378842e$var$readOctal(header, 329, 8);
        file.deviceMinor = $f9b86a07e378842e$var$readOctal(header, 337, 8);
        file.fileNamePrefix = $f9b86a07e378842e$var$readString(header, 345, 155);
    } else console.warn("No Ustar indicator detected in tar file");
    return file;
}
function $f9b86a07e378842e$var$readString(input, start = 0, size) {
    const decoder = new TextDecoder("ascii");
    let buf = new Uint8Array(input.slice(start, size ? start + size : undefined));
    const nullIdx = buf.indexOf(0);
    buf = buf.slice(0, nullIdx);
    return decoder.decode(buf);
}
function $f9b86a07e378842e$var$readOctal(input, start = 0, end) {
    return parseInt($f9b86a07e378842e$var$readString(input, start, end), 8);
}



async function $2bdd3d1603727488$export$2e2bcd8739ae039(tarfile) {
    const input = new Blob([
        tarfile
    ]);
    const blocks = $2bdd3d1603727488$var$getBlocks(input);
    let files = [];
    {
        let mode = "header";
        let file;
        let fileBlocks = [];
        let fileBlocksCount = 0;
        let fileIdx = 0;
        for (const block of blocks){
            if (mode === "file") {
                if (fileIdx < fileBlocksCount) {
                    fileBlocks.push(block);
                    fileIdx++;
                } else {
                    file.contents = new Blob(fileBlocks).slice(0, file.size);
                    files.push(Object.freeze(file));
                    if (await $2bdd3d1603727488$var$isEmptyBlock(block)) break;
                    mode = "header";
                }
            }
            if (mode === "header") {
                file = await (0, $f9b86a07e378842e$export$2e2bcd8739ae039)(block);
                mode = "file";
                fileBlocks = [];
                fileBlocksCount = Math.ceil(file.size / 512);
                fileIdx = 0;
            }
        }
    }
    return files;
}
function $2bdd3d1603727488$var$getBlocks(input, size = 512) {
    const noOfBlocks = Math.floor(input.size / size);
    const ret = [];
    for(let i = 0; i < noOfBlocks; i++)ret.push(input.slice(i * size, (i + 1) * size));
    return ret;
}
async function $2bdd3d1603727488$var$isEmptyBlock(block) {
    const buf = new Uint8Array(await block.arrayBuffer());
    return buf.every((val)=>val === 0);
}


//# sourceMappingURL=index.js.map
