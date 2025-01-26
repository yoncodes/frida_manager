import { logger } from "./logger.js";

/**
 * Checks if the libil2cpp library is loaded in the target process.
 * If not loaded, it waits until it is loaded.
 * @param {number} timeoutMs - Maximum time to wait for the library to load (in milliseconds).
 * @param {number} intervalMs - Interval between each check (in milliseconds).
 * @returns {Promise<boolean>} - Resolves to true if libil2cpp is loaded, false if timeout is reached.
 */
export async function waitForLibIl2CppLoad(timeoutMs = 10000, intervalMs = 500): Promise<boolean> {
    const startTime = Date.now();

    return new Promise((resolve) => {
        const checkLib = (): void => {
            const baseAddress = Module.findBaseAddress("libil2cpp.so");
            if (baseAddress) {
                logger.log("[+] libil2cpp is loaded at address: " + baseAddress);
                resolve(true);
                return;
            }

            if (Date.now() - startTime >= timeoutMs) {
                logger.error("[-] Timeout reached. libil2cpp is not loaded.");
                resolve(false);
                return;
            }

            setTimeout(checkLib, intervalMs);
        };

        checkLib();
    });
}

