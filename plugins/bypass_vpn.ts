// @ts-nocheck


import { logger } from "./logger.js";

export function bypass_vpn(): void {
    setTimeout(() => {
        Java.perform(() => {

            /* API level 28 or below */
            const TYPE_VPN = 0x00000011;
            const connectivityManager = Java.use('android.net.ConnectivityManager');

            connectivityManager.getNetworkInfo.overload('int').implementation = function (netType: number) {
                if (netType && TYPE_VPN === 0x00000011) {
                    const TYPE_ETHERNET = 0x00000009;
                    const ret = this.getNetworkInfo(TYPE_ETHERNET);
                    // This will work assuming that one is not connected to ethernet
                    logger.log(`Called ConnectivityManager.getNetworkInfo(TYPE_VPN)`);
                    logger.log(`Bypassing VPN detection check..`);
                    return ret;
                } else {
                    const ret = this.getNetworkInfo(netType);
                    return ret;
                }
            };

            /* API level 29 and above */
            const TRANSPORT_VPN = 0x00000004;
            const networkCapabilities = Java.use('android.net.NetworkCapabilities');

            networkCapabilities.hasTransport.overload('int').implementation = function (transportType: number) {
                if (transportType && TRANSPORT_VPN === 0x00000004) {
                    logger.log(`Called NetworkCapabilities.hasTransport(TRANSPORT_VPN)`);
                    logger.log(`Bypassing VPN detection check..`);
                    return false;
                } else {
                    return true;
                }
            };

        });

        /* Using NetworkInterface */
        const networkInterface = Java.use('java.net.NetworkInterface');
        const interfaceList = ['tun', 'tun0', 'utun0', 'utun1', 'utun2', 'utun3', 'utun4', 'ppp0', 'ppp', 'pptp'];

        networkInterface.getByName.overload('java.lang.String').implementation = function (name: string) {
            if (interfaceList.includes(name)) {
                logger.log(`Called NetworkInterface.getByName(${name})`);
                logger.log(`Bypassing VPN detection check..`);
                const ret = this.getByName('ZZEIADONN');
                return ret;
            } else {
                const ret = this.getByName(name);
                return ret;
            }
        };

        networkInterface.getDisplayName.overload().implementation = function () {
            const ret = this.getDisplayName();
            if (interfaceList.includes(ret)) {
                logger.log(`Called NetworkInterface.getDisplayName()`);
                logger.log(`Bypassing VPN detection check..`);
                return 'ZDUABIDBWA';
            } else {
                return ret;
            }
        };

        networkInterface.getName.overload().implementation = function () {
            const ret = this.getDisplayName();
            if (interfaceList.includes(ret)) {
                logger.log(`Called NetworkInterface.getName()`);
                logger.log(`Bypassing VPN detection check..`);
                return 'ZDUABIDBWA';
            } else {
                return ret;
            }
        };

    }, 0);
}
