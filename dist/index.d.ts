export const enum TarFileType {
    NormalFile = 0,
    HardLink = 1,
    SymbolicLink = 2,
    CharacterSpecial = 3,
    BlockSpecial = 4,
    Directory = 5,
    NamedFIFOPipe = 6,
    ContiguousFile = 7,
    Vendor = "vendor"
}
export class TarFile {
    name: string;
    mode: number;
    uid: number;
    gid: number;
    size: number;
    mtime: Date;
    type: TarFileType;
    linkname: string;
    contents: Blob;
    uname: string;
    gname: string;
    deviceMajor: number;
    deviceMinor: number;
    fileNamePrefix: string;
}
export default function parseTar(tarfile: File | Blob | ArrayBuffer | ArrayBufferLike): Promise<Readonly<TarFile>[]>;

//# sourceMappingURL=index.d.ts.map
