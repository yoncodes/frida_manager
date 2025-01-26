// @ts-nocheck

import { logger } from "../plugins/logger.js";
import "frida-il2cpp-bridge";
import * as fs from "fs";

/*
// Function to find protected export name in libil2cpp.so
function getProtectedExportName() {
    const moduleName = "libil2cpp.so";
    const suffix = "_wasting_your_life";

    const moduleBase = Module.findBaseAddress(moduleName);
    if (!moduleBase) {
        throw new Error(`Failed to find module base for ${moduleName}`);
    }

    // Get IMAGE_DOS_HEADER
    const dosHeader = moduleBase;
    const e_lfanew = dosHeader.add(0x3C).readU32();

    // Get IMAGE_NT_HEADERS
    const ntHeaders = dosHeader.add(e_lfanew);
    const optionalHeader = ntHeaders.add(0x18);

    // Get IMAGE_DATA_DIRECTORY for export table
    const exportDataDirectory = optionalHeader.add(0x70); // IMAGE_DIRECTORY_ENTRY_EXPORT
    const exportTableVA = exportDataDirectory.readU32();
    const exportTableSize = exportDataDirectory.add(4).readU32();

    if (exportTableVA === 0) {
        throw new Error("No export table found.");
    }

    const exportTable = moduleBase.add(exportTableVA);

    // Read export directory
    const addressOfNamesVA = exportTable.add(0x20).readU32();
    const numberOfNames = exportTable.add(0x18).readU32();
    const addressOfNames = moduleBase.add(addressOfNamesVA);

    for (let i = 0; i < numberOfNames; i++) {
        const nameRva = addressOfNames.add(i * 4).readU32();
        const nameAddress = moduleBase.add(nameRva);
        const exportName = nameAddress.readUtf8String();

        if (exportName.includes(suffix)) {
            return exportName;
        }
    }

    // Default export name if no match is found
    return "il2cpp_domain_get_assemblies";
}

// Initialize IL2CPP API using the resolved protected export name
function initIl2cppApi() {
    const protectedExportName = getProtectedExportName();
    logger.log(`[+] Protected export name: ${protectedExportName}`);

    // Dynamically resolve API functions
    const il2cppBase = Module.findBaseAddress("libil2cpp.so");
    if (!il2cppBase) {
        throw new Error("Failed to find base address of libil2cpp.so");
    }

    const il2cppApi = {
        il2cpp_domain_get: new NativeFunction(Module.getExportByName("libil2cpp.so", "il2cpp_domain_get"), "pointer", []),
        il2cpp_thread_attach: new NativeFunction(Module.getExportByName("libil2cpp.so", "il2cpp_thread_attach"), "pointer", ["pointer"]),
        il2cpp_domain_get_assemblies: new NativeFunction(Module.getExportByName("libil2cpp.so", protectedExportName), "pointer", ["pointer", "pointer"]),
        il2cpp_assembly_get_image: new NativeFunction(Module.getExportByName("libil2cpp.so", "il2cpp_assembly_get_image"), "pointer", ["pointer"]),
        il2cpp_image_get_name: new NativeFunction(Module.getExportByName("libil2cpp.so", "il2cpp_image_get_name"), "pointer", ["pointer"]),
        il2cpp_image_get_class_count: new NativeFunction(Module.getExportByName("libil2cpp.so", "il2cpp_image_get_class_count"), "int", ["pointer"]),
    };

    return il2cppApi;
}

// Main start function
export function start() {
    try {
        logger.log("[+] Starting il2cpp dump...");

        // Step 1: Get the domain
        const domain = il2cppApi.il2cpp_domain_get();

        // Step 2: Attach the thread
        const thread = il2cppApi.il2cpp_thread_attach(domain);

        // Step 3: Get assemblies
        const sizePtr = Memory.alloc(Process.pointerSize);
        const assemblies = il2cppApi.il2cpp_domain_get_assemblies(domain, sizePtr);
        const assemblyCount = sizePtr.readInt();
        logger.log(`[+] Found ${assemblyCount} assemblies.`);

        // Step 4: Process each assembly
        for (let j = 0; j < classCount; j++) {
            try {
                const kclass = il2cppApi.il2cpp_image_get_class(image.handle, j);
                if (kclass.isNull()) {
                    logger.warn(`[!] Class pointer at index ${j} is null. Skipping...`);
                    continue;
                }
                
                const className = kclass.getName(); // Ensure `getName` is properly implemented in `Il2CppClass`
                logger.log(`\t[+] Class ${j}: ${className}`);
        
                const methods = [];
                const methodIter = Memory.alloc(Process.pointerSize); // Iterator for methods
                while (true) {
                    const methodInfo = il2cppApi.il2cpp_class_get_methods(kclass.handle, methodIter);
                    if (methodInfo.isNull()) break;
        
                    const methodName = il2cppApi.il2cpp_method_get_name(methodInfo.handle);
                    methods.push(methodName);
                }
                logger.log(`\t\t[+] Methods (${methods.length}): ${methods.join(", ")}`);
            } catch (error) {
                logger.error(`[!] Error processing class at index ${j}: ${error.message}`);
            }
        }
        

        logger.log("[+] Dump completed successfully.");
    } catch (error) {
        logger.error(`[!] Error: ${error.message}\n${error.stack}`);
    }
}
*/

export function start(fileName?: string, path?: string): void {
    console.log("Starting extended dump...");

    Il2Cpp.perform(() => {
        // it will use default directory path and file name: /<default_path>/<default_name>.cs
        Il2Cpp.dump("dump.cs");
    });
}
