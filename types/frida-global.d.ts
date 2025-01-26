declare const Java: {
    available: boolean;
    use: (className: string) => any;
    perform: (fn: () => void) => void;
    cast: (instance: any, targetClass: any) => any;
    array: (type: string, values: any[]) => any;
    androidVersion?: string;
};

declare const ptr: (value: number | string) => NativePointer;

declare class NativePointer {
    readUtf8String(): string | null;
    readCString(): string | null;
    readInt(): number; // Added readInt method
    toInt32(): number;
    writePointer(value: NativePointerValue): void;
    replace(value: NativePointerValue): void;
    add(offset: number | string): NativePointer;
    sub(offset: number | string): NativePointer;
    isNull(): boolean;
    toString(radix?: number): string;
    readPointer(): NativePointer; // Add this line
}

declare type NativePointerValue = NativePointer | number | string;

declare const Interceptor: {
    attach(
        address: NativePointer | any,
        callbacks: {
            onEnter?: (args: NativePointer[]) => void;
            onLeave?: (retval: NativePointer) => void;
        }
    ): void;
};

declare const Memory: {
    readCString(ptr: NativePointer): string;
    writeUtf8String(ptr: NativePointer, value: string): void;
    alloc(size: number): NativePointer;

};

declare const Module: {
    findExportByName(moduleName: string | null, exportName: string): NativePointer | null;
    static findBaseAddress(moduleName: string): NativePointer | nul
};


declare class File {
    constructor(path: string, mode: string);
    write(data: string): void;
    flush(): void;
    close(): void;
}
