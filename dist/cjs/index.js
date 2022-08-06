function $parcel$defineInteropFlag(a) {
  Object.defineProperty(a, '__esModule', {value: true, configurable: true});
}
function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$defineInteropFlag(module.exports);

$parcel$export(module.exports, "default", () => $2bdd3d1603727488$export$2e2bcd8739ae039);
$parcel$export(module.exports, "TarFileType", () => $2bdd3d1603727488$export$bc16dfd6a6ab4662);
$parcel$export(module.exports, "TarFile", () => $2bdd3d1603727488$export$54ab42ec615919cc);
function $2bdd3d1603727488$export$2e2bcd8739ae039(tarfile) {
    if (tarfile instanceof Blob) return (async ()=>{
        const input = new Blob([
            tarfile
        ]);
        const noOfBlocks = input.size / 512;
        const files = [];
        {
            let blockIdx = 0;
            while(blockIdx < noOfBlocks){
                const block = input.slice(blockIdx * 512, (blockIdx + 1) * 512);
                if (await $2bdd3d1603727488$var$isEmptyBlock(block)) break;
                const file = $2bdd3d1603727488$var$parseTarHeader(await block.arrayBuffer());
                const fileBlocksCount = Math.ceil(file.size / 512);
                file.contents = input.slice((blockIdx + 1) * 512, (blockIdx + 1 + fileBlocksCount) * 512).slice(0, file.size);
                files.push(Object.freeze(file));
                blockIdx += fileBlocksCount + 1;
            }
        }
        return files;
    })();
    else {
        const input = new Uint8Array(tarfile);
        const noOfBlocks = input.byteLength / 512;
        const files = [];
        {
            let blockIdx = 0;
            while(blockIdx < noOfBlocks){
                const block = input.slice(blockIdx * 512, (blockIdx + 1) * 512);
                if ($2bdd3d1603727488$var$isEmptyBlock(block)) break;
                const file = $2bdd3d1603727488$var$parseTarHeader(block);
                const fileBlocksCount = Math.ceil(file.size / 512);
                file.contents = input.slice((blockIdx + 1) * 512, (blockIdx + 1 + fileBlocksCount) * 512).slice(0, file.size);
                files.push(Object.freeze(file));
                blockIdx += fileBlocksCount + 1;
            }
            return files;
        }
    }
}
function $2bdd3d1603727488$var$isEmptyBlock(block) {
    if (block instanceof Blob) return block.arrayBuffer().then((val)=>new Uint8Array(val)).then((buf)=>buf.every((val)=>val === 0));
    return block.every((val)=>val === 0);
}
let $2bdd3d1603727488$export$bc16dfd6a6ab4662;
(function(TarFileType) {
    TarFileType[TarFileType["NormalFile"] = 0] = "NormalFile";
    TarFileType[TarFileType["HardLink"] = 1] = "HardLink";
    TarFileType[TarFileType["SymbolicLink"] = 2] = "SymbolicLink";
    TarFileType[TarFileType["CharacterSpecial"] = 3] = "CharacterSpecial";
    TarFileType[TarFileType["BlockSpecial"] = 4] = "BlockSpecial";
    TarFileType[TarFileType["Directory"] = 5] = "Directory";
    TarFileType[TarFileType["NamedFIFOPipe"] = 6] = "NamedFIFOPipe";
    TarFileType[TarFileType["ContiguousFile"] = 7] = "ContiguousFile";
    TarFileType["Vendor"] = "vendor";
})($2bdd3d1603727488$export$bc16dfd6a6ab4662 || ($2bdd3d1603727488$export$bc16dfd6a6ab4662 = {}));
class $2bdd3d1603727488$export$54ab42ec615919cc {
    name = "";
    mode = 0;
    uid = 0;
    gid = 0;
    size = 0;
    mtime = new Date(0);
    type = 0;
    linkname = "";
    uname = "";
    gname = "";
    deviceMajor = 0;
    deviceMinor = 0;
    fileNamePrefix = "";
}
let $2bdd3d1603727488$var$ustarWarned = false;
function $2bdd3d1603727488$var$parseTarHeader(header) {
    const file = new $2bdd3d1603727488$export$54ab42ec615919cc();
    file.name = readString(0, 100);
    file.mode = readOctal(100, 8);
    file.uid = readOctal(108, 8);
    file.gid = readOctal(116, 8);
    file.size = readOctal(124, 12);
    file.mtime = new Date(readOctal(136, 12) * 1000);
    const checksum = readString(148, 8);
    const ftype = readString(156, 1);
    if (ftype) {
        if (ftype.charCodeAt(0) >= 48 && ftype.charCodeAt(0) <= 57) file.type = ftype.charCodeAt(0);
        else file.type = "vendor";
    } else file.type = 0;
    file.linkname = readString(157, 100);
    const ustarIndicator = readString(257, 6);
    if (ustarIndicator === "ustar") {
        file.uname = readString(265, 32);
        file.gname = readString(297, 32);
        file.deviceMajor = readOctal(329, 8);
        file.deviceMinor = readOctal(337, 8);
        file.fileNamePrefix = readString(345, 155);
    } else if (!$2bdd3d1603727488$var$ustarWarned) {
        console.warn("No Ustar indicator detected in tar file");
        $2bdd3d1603727488$var$ustarWarned = true;
    }
    return file;
    function readString(start = 0, size) {
        const decoder = new TextDecoder("ascii");
        let buf = new Uint8Array(header.slice(start, size ? start + size : undefined));
        const nullIdx = buf.indexOf(0);
        buf = buf.slice(0, nullIdx);
        return decoder.decode(buf);
    }
    function readOctal(start = 0, end) {
        return parseInt(readString(start, end), 8);
    }
}


//# sourceMappingURL=index.js.map
