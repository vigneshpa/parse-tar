function $4879e75d69ba72fd$export$2e2bcd8739ae039(tarfile) {
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
                if (await $4879e75d69ba72fd$var$isEmptyBlock(block)) break;
                const file = $4879e75d69ba72fd$var$parseTarHeader(await block.arrayBuffer());
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
                if ($4879e75d69ba72fd$var$isEmptyBlock(block)) break;
                const file = $4879e75d69ba72fd$var$parseTarHeader(block);
                const fileBlocksCount = Math.ceil(file.size / 512);
                file.contents = input.slice((blockIdx + 1) * 512, (blockIdx + 1 + fileBlocksCount) * 512).slice(0, file.size);
                files.push(Object.freeze(file));
                blockIdx += fileBlocksCount + 1;
            }
            return files;
        }
    }
}
function $4879e75d69ba72fd$var$isEmptyBlock(block) {
    if (block instanceof Blob) return block.arrayBuffer().then((val)=>new Uint8Array(val)).then((buf)=>buf.every((val)=>val === 0));
    return block.every((val)=>val === 0);
}
let $4879e75d69ba72fd$export$bc16dfd6a6ab4662;
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
})($4879e75d69ba72fd$export$bc16dfd6a6ab4662 || ($4879e75d69ba72fd$export$bc16dfd6a6ab4662 = {}));
class $4879e75d69ba72fd$export$54ab42ec615919cc {
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
let $4879e75d69ba72fd$var$ustarWarned = false;
function $4879e75d69ba72fd$var$parseTarHeader(header) {
    const file = new $4879e75d69ba72fd$export$54ab42ec615919cc();
    file.name = $4879e75d69ba72fd$var$readString(header, 0, 100);
    file.mode = $4879e75d69ba72fd$var$readOctal(header, 100, 8);
    file.uid = $4879e75d69ba72fd$var$readOctal(header, 108, 8);
    file.gid = $4879e75d69ba72fd$var$readOctal(header, 116, 8);
    file.size = $4879e75d69ba72fd$var$readOctal(header, 124, 12);
    file.mtime = new Date($4879e75d69ba72fd$var$readOctal(header, 136, 12) * 1000);
    const checksum = $4879e75d69ba72fd$var$readString(header, 148, 8);
    const ftype = $4879e75d69ba72fd$var$readString(header, 156, 1);
    if (ftype) {
        if (ftype.charCodeAt(0) >= 48 && ftype.charCodeAt(0) <= 57) file.type = ftype.charCodeAt(0);
        else file.type = "vendor";
    } else file.type = 0;
    file.linkname = $4879e75d69ba72fd$var$readString(header, 157, 100);
    const ustarIndicator = $4879e75d69ba72fd$var$readString(header, 257, 6);
    if (ustarIndicator === "ustar") {
        file.uname = $4879e75d69ba72fd$var$readString(header, 265, 32);
        file.gname = $4879e75d69ba72fd$var$readString(header, 297, 32);
        file.deviceMajor = $4879e75d69ba72fd$var$readOctal(header, 329, 8);
        file.deviceMinor = $4879e75d69ba72fd$var$readOctal(header, 337, 8);
        file.fileNamePrefix = $4879e75d69ba72fd$var$readString(header, 345, 155);
    } else if (!$4879e75d69ba72fd$var$ustarWarned) {
        console.warn("No Ustar indicator detected in tar file");
        $4879e75d69ba72fd$var$ustarWarned = true;
    }
    return file;
}
function $4879e75d69ba72fd$var$readString(input, start = 0, size) {
    const decoder = new TextDecoder("ascii");
    let buf = new Uint8Array(input.slice(start, size ? start + size : undefined));
    const nullIdx = buf.indexOf(0);
    buf = buf.slice(0, nullIdx);
    return decoder.decode(buf);
}
function $4879e75d69ba72fd$var$readOctal(input, start = 0, end) {
    return parseInt($4879e75d69ba72fd$var$readString(input, start, end), 8);
}


export {$4879e75d69ba72fd$export$2e2bcd8739ae039 as default, $4879e75d69ba72fd$export$bc16dfd6a6ab4662 as TarFileType, $4879e75d69ba72fd$export$54ab42ec615919cc as TarFile};
//# sourceMappingURL=index.js.map
