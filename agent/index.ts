//@ts-nocheck
import { logger } from "../plugins/logger.js";
import { start } from "./test.js";
import * as Plugins from "../plugins/index.js";
import "frida-il2cpp-bridge";

setImmediate(main);

function main() {

logger.log("Running script with Frida...");
Plugins.bypass_wifi_check();
Plugins.bypass_vpn();
Plugins.bypass_developerMode_check();
Plugins.bypass_root();
Plugins.bypassJavaFileCheck();
Plugins.bypassNativeFileCheck();
Plugins.bypassRootAppCheck();
Plugins.bypassShellCheck();
//Plugins.bypassCertificatePinningWithTimeout(500); // This assumes you have a mitm cert in /data/local/tmp/mitmproxy-ca-cert.cer.crt



Il2Cpp.perform(() => {

});
    


rpc.exports = {
    start: async function () {
        if (typeof start !== "undefined") {
            try {
                const isLoaded = await Plugins.waitForLibIl2CppLoad(10000, 500);
                if (!isLoaded) {
                    throw new Error("libil2cpp failed to load within the timeout period.");
                }

                logger.log("libil2cpp is loaded. Proceeding with operations...");
                
                start();
            } catch (error) {
                logger.error(`An error occurred during startup: ${error.message}`);
            }
        } else {
            logger.error("Dumper is not defined!");
        }
    }
}};
