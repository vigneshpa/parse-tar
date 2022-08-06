export default function parseTar(tarfile: Blob): Promise<Readonly<TarFile<Blob>>[]>;
export default function parseTar(tarfile: ArrayBuffer | ArrayBufferLike): Readonly<TarFile<Uint8Array>>[];
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
export class TarFile<T extends Blob | Uint8Array> {
    name: string;
    mode: number;
    uid: number;
    gid: number;
    size: number;
    mtime: Date;
    type: TarFileType;
    linkname: string;
    contents?: T;
    uname: string;
    gname: string;
    deviceMajor: number;
    deviceMinor: number;
    fileNamePrefix: string;
}

//# sourceMappingURL=index.d.ts.map
