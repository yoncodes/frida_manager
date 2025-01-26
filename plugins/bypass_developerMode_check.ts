
// @ts-nocheck

import { logger } from "./logger.js";

export function bypass_developerMode_check(): void {
    Java.perform(() => {
        const settingSecure = Java.use("android.provider.Settings$Secure");

        settingSecure.getInt.overload(
            "android.content.ContentResolver",
            "java.lang.String",
            "int"
        ).implementation = function (cr: any, name: string, flag: number): number {
            logger.log(`Secure.getInt(cr, name, flag): ${name}, flag: ${flag}`);
            logger.log(`Secure.getInt(${name}) Bypassed`);
            return 0;
        };

        settingSecure.getInt.overload(
            "android.content.ContentResolver",
            "java.lang.String"
        ).implementation = function (cr: any, name: string): number {
            logger.log(`Secure.getInt(cr, name): ${name}`);
            logger.log(`Secure.getInt(${name}) Bypassed`);
            return 0;
        };

        const settingGlobal = Java.use("android.provider.Settings$Global");

        settingGlobal.getInt.overload(
            "android.content.ContentResolver",
            "java.lang.String",
            "int"
        ).implementation = function (cr: any, name: string, flag: number): number {
            logger.log(`Global.getInt(cr, name, flag): ${name}, flag: ${flag}`);
            logger.log(`Global.getInt(${name}) Bypassed`);
            return 0;
        };

        settingGlobal.getInt.overload(
            "android.content.ContentResolver",
            "java.lang.String"
        ).implementation = function (cr: any, name: string): number {
            logger.log(`Global.getInt(cr, name): ${name}`);
            logger.log(`Global.getInt(${name}) Bypassed`);
            return 0;
        };

        logger.log("Developer mode check bypass installed.");
    });
}
