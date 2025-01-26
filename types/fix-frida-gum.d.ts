declare module "frida-gum" {
    export class NativePointer {
        readUtf8String(): string | null;
        readCString(): string | null;
        toInt32(): number;
        writePointer(value: NativePointerValue): void;
        replace(value: NativePointerValue): void;
        add(offset: number | string): NativePointer;
        sub(offset: number | string): NativePointer;
        isNull(): boolean;
        toString(radix?: number): string;
    }

    export function ptr(value: number | string): NativePointer;

    export const Memory: {
        readCString(ptr: NativePointer): string;
        writeUtf8String(ptr: NativePointer, value: string): void;
        alloc(size: number): NativePointer; // Added alloc method
        scan(
            address: NativePointer,
            size: number,
            pattern: string,
            callbacks: {
                onMatch: (address: NativePointer, size: number) => void;
                onComplete: () => void;
            }
        ): void;
    };

    export const Thread: {
        backtrace(context: CpuContext | null, accuracy: BacktracerAccuracy): NativePointer[];
    };

    export const Backtracer: {
        ACCURATE: BacktracerAccuracy;
        FUZZY: BacktracerAccuracy;
    };

    export const DebugSymbol: {
        fromAddress(address: NativePointer): string;
        findNearest(address: NativePointer): { address: NativePointer; name: string } | null;
    };

    export class Interceptor {
        static attach(
            address: NativePointer | ModuleExportDetails | ApiResolverMatch,
            callbacks: InterceptorAttachCallbacks
        ): void;

        static replace(
            target: NativePointer | ModuleExportDetails | ApiResolverMatch,
            replacement: NativePointer
        ): void;

        static detachAll(): void;
    }

    export interface InterceptorAttachCallbacks {
        onEnter?: (args: NativePointer[]) => void;
        onLeave?: (retval: NativePointer) => void;
        inputPath?: string; // Custom property
    }

    export class Module {
        static findExportByName(
            moduleName: string | null,
            exportName: string
        ): NativePointer | null;

        static enumerateImports(moduleName: string): ModuleImportDetails[];

        static enumerateExports(moduleName: string): ModuleExportDetails[];
    }

    export interface ModuleImportDetails {
        name: string;
        address: NativePointer;
        type: "function" | "variable";
    }

    export interface ModuleExportDetails {
        name: string;
        address: NativePointer;
        type: "function" | "variable";
    }

    export type NativePointerValue = NativePointer | number | string;

    export type CpuContext = any; // Define if needed for your use case
    export type BacktracerAccuracy = any; // Define based on Frida's Backtracer documentation
}
