// @ts-nocheck


import { logger } from "./logger.js";

export function bypass_wifi_check(): void {
    Java.perform(() => {
    const classx = Java.use("android.net.ConnectivityManager");
    const networkInfo = classx.getActiveNetworkInfo;

    networkInfo.implementation = function (...args: any[]) {
        logger.log('Hook getActiveNetworkInfo()');
        const netInfo = networkInfo.call(this);
        
        // Uncomment for debugging
        // logger.log('\t netInfo1: '+ netInfo);
        // Example when using SIM
        //  returnVal:[type: MOBILE[LTE], state: CONNECTED/CONNECTED, reason: (unspecified), extra: internet, failover: false, available: true, roaming: false]

        const networkInfo_class = Java.use("android.net.NetworkInfo");
        // Create a new instance of NetworkInfo with modified values
        const networkInfo2 = networkInfo_class.$new(0, 0, "MOBILE", "LTE");
        const netDetailedState = Java.use("android.net.NetworkInfo$DetailedState");

        networkInfo2.mIsAvailable.value = true;
        networkInfo2.setDetailedState(netDetailedState.CONNECTED.value, null, null);

        logger.log('return modified networkInfo');
        // Uncomment for debugging
        // logger.log('\t netInfo2: '+ networkInfo2);

        return networkInfo2;
    };

    const classxCapabilities = Java.use("android.net.NetworkCapabilities");
    const hasTransport = classxCapabilities.hasTransport;

    hasTransport.implementation = function (transportType: number): boolean {
        logger.log('Hook NetworkCapabilities.hasTransport(i)');
        logger.log(`Hook hasTransport(${transportType})`);
        const oldResult = hasTransport.call(this, transportType);
        logger.log(`oldResult: ${oldResult}`);

        if (transportType === 0) {
            const newResult = true;
            logger.log(`newResult: ${newResult}`);
            return newResult;
        } else {
            return false;
        }
    };
});
}

