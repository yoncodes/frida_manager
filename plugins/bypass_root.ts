// @ts-nocheck

import { logger } from "./logger.js";

function readCString(ptr: NativePointer): string {
    return (Memory as any).readCString(ptr)!;
}

function writeUtf8String(ptr: NativePointer, value: string): void {
    (Memory as any).writeUtf8String(ptr, value);
}

const commonPaths: string[] = [
    "/data/local/bin/su",
    "/data/local/su",
    "/data/local/xbin/su",
    "/dev/com.koushikdutta.superuser.daemon/",
    "/sbin/su",
    "/system/app/Superuser.apk",
    "/system/bin/failsafe/su",
    "/system/bin/su",
    "/su/bin/su",
    "/system/etc/init.d/99SuperSUDaemon",
    "/system/sd/xbin/su",
    "/system/xbin/busybox",
    "/system/xbin/daemonsu",
    "/system/xbin/su",
    "/system/sbin/su",
    "/vendor/bin/su",
    "/cache/su",
    "/data/su",
    "/dev/su",
    "/system/bin/.ext/su",
    "/system/usr/we-need-root/su",
    "/system/app/Kinguser.apk",
    "/data/adb/magisk",
    "/sbin/.magisk",
    "/cache/.disable_magisk",
    "/dev/.magisk.unblock",
    "/cache/magisk.log",
    "/data/adb/magisk.img",
    "/data/adb/magisk.db",
    "/data/adb/magisk_simple",
    "/init.magisk.rc",
    "/system/xbin/ku.sud",
    "/data/adb/ksu",
    "/data/adb/ksud"
];

const ROOTmanagementApp: string[] = [
    "com.noshufou.android.su",
    "com.noshufou.android.su.elite",
    "eu.chainfire.supersu",
    "com.koushikdutta.superuser",
    "com.thirdparty.superuser",
    "com.yellowes.su",
    "com.koushikdutta.rommanager",
    "com.koushikdutta.rommanager.license",
    "com.dimonvideo.luckypatcher",
    "com.chelpus.lackypatch",
    "com.ramdroid.appquarantine",
    "com.ramdroid.appquarantinepro",
    "com.topjohnwu.magisk",
    "me.weishu.kernelsu"
];

export function bypass_root(): void {
    Java.perform(() => {
        const RootPackages = [
            "com.noshufou.android.su", "com.noshufou.android.su.elite", "eu.chainfire.supersu",
            "com.koushikdutta.superuser", "com.thirdparty.superuser", "com.yellowes.su", "com.koushikdutta.rommanager",
            "com.koushikdutta.rommanager.license", "com.dimonvideo.luckypatcher", "com.chelpus.lackypatch",
            "com.ramdroid.appquarantine", "com.ramdroid.appquarantinepro", "com.devadvance.rootcloak", "com.devadvance.rootcloakplus",
            "de.robv.android.xposed.installer", "com.saurik.substrate", "com.zachspong.temprootremovejb", "com.amphoras.hidemyroot",
            "com.amphoras.hidemyrootadfree", "com.formyhm.hiderootPremium", "com.formyhm.hideroot", "me.phh.superuser",
            "eu.chainfire.supersu.pro", "com.kingouser.com", "com.topjohnwu.magisk"
        ];

        const RootBinaries = ["su", "busybox", "supersu", "Superuser.apk", "KingoUser.apk", "SuperSu.apk", "magisk"];

        const RootProperties = {
            "ro.build.selinux": "1",
            "ro.debuggable": "0",
            "service.adb.root": "0",
            "ro.secure": "1"
        };

        const RootPropertiesKeys = Object.keys(RootProperties);

        const PackageManager = Java.use("android.app.ApplicationPackageManager");
        const Runtime = Java.use("java.lang.Runtime");
        const NativeFile = Java.use("java.io.File");
        const SystemProperties = Java.use("android.os.SystemProperties");

        PackageManager.getPackageInfo.overload("java.lang.String", "int").implementation = function (pname: string, flags: number) {
            if (RootPackages.includes(pname)) {
                logger.log("Bypass root check for package: " + pname);
                pname = "set.package.name.to.a.fake.one.so.we.can.bypass.it";
            }
            return this.getPackageInfo.overload("java.lang.String", "int").call(this, pname, flags);
        };

        NativeFile.exists.implementation = function (): boolean {
            const name = NativeFile.getName.call(this);
            if (RootBinaries.includes(name)) {
                logger.log("Bypass return value for binary: " + name);
                return false;
            }
            return this.exists.call(this);
        };

        const fopenPtr = Module.findExportByName("libc.so", "fopen");
if (fopenPtr !== null) {
    Interceptor.attach(fopenPtr, {
        onEnter(this: any, args: NativePointer[]) {
            try {
                const path = args[0].readUtf8String(); // Read the original path
                if (path) {
                    const executable = path.split("/").pop()!;
                    if (RootBinaries.includes(executable)) {
                        const newPath = "/notexists";
                        const newPathPtr = Memory.allocUtf8String(newPath); // Allocate writable memory for the new path
                        args[0] = newPathPtr; // Update the argument to point to the new path
                        console.log("Bypassed native fopen for binary: " + executable);
                    }
                }
            } catch (error) {
                console.error("Error in fopen hook: ", error);
            }
        },
    });
}


        const systemPtr = Module.findExportByName("libc.so", "system");
        if (systemPtr !== null) {
            Interceptor.attach(systemPtr, {
                onEnter(this: any, args: NativePointer[]) {
                    const cmd = readCString(args[0]);
                    logger.log("SYSTEM CMD: " + cmd);
                    if (cmd.includes("getprop") || cmd === "mount" || cmd.includes("build.prop") || cmd === "id") {
                        logger.log("Bypass native system: " + cmd);
                        writeUtf8String(args[0], "grep");
                    }
                    if (cmd === "su") {
                        logger.log("Bypass native system: " + cmd);
                        writeUtf8String(
                            args[0],
                            "justafakecommandthatcannotexistsusingthisshouldthowanexceptionwheneversuiscalled"
                        );
                    }
                },
            });
        }

        SystemProperties.get.overload("java.lang.String").implementation = function (name: string): string {
            if (RootPropertiesKeys.includes(name)) {
                logger.log("Bypass " + name);
                return RootProperties[name as keyof typeof RootProperties];
            }
            return this.get.call(this, name);
        };

        logger.log("Root detection bypass setup complete.");
    });
}

function stackTraceHere(isLog: boolean): string | void {
    Java.perform(() => {
    const Exception = Java.use("java.lang.Exception");
    const Log = Java.use("android.util.Log");
    const stackinfo = Log.getStackTraceString(Exception.$new());

    if (isLog) {
        logger.log(stackinfo);
    } else {
        return stackinfo;
    }
    });
}

export function bypassJavaFileCheck(): void {
    Java.perform(() => {
    const UnixFileSystem = Java.use("java.io.UnixFileSystem");
    UnixFileSystem.checkAccess.implementation = function (file: any, access: number): boolean {
        const stack = stackTraceHere(false);
        const filename = file.getAbsolutePath();

        if (filename.includes("magisk")) {
            logger.log("Anti Root Detect - check file: " + filename);
            return false;
        }

        if (commonPaths.includes(filename)) {
            logger.log("Anti Root Detect - check file: " + filename);
            return false;
        }

        return this.checkAccess(file, access);
    };
});
}

// Function to bypass fopen checks
export function bypassNativeFileCheck(): void {
    const fopen = Module.findExportByName("libc.so", "fopen");
    if (fopen !== null) {
        Interceptor.attach(fopen, {
            onEnter(this: any, args: NativePointer[]) {
                this.inputPath = readCString(args[0]);
            },
            onLeave(this: any, retval: NativePointer) {
                if (retval.toInt32() !== 0 && commonPaths.includes(this.inputPath)) {
                    logger.log("Anti Root Detect - fopen : " + this.inputPath);
                    retval.replace(ptr(0)); // Replace with null pointer
                }
            }
        });
    }

    const access = Module.findExportByName("libc.so", "access");
    if (access !== null) {
        Interceptor.attach(access, {
            onEnter(this: any, args: NativePointer[]) {
                this.inputPath = readCString(args[0]);
            },
            onLeave(this: any, retval: NativePointer) {
                if (retval.toInt32() === 0 && commonPaths.includes(this.inputPath)) {
                    logger.log("Anti Root Detect - access : " + this.inputPath);
                    retval.writePointer(ptr(-1)); // Replace with -1
                }
            }
        });
    }
}

export function bypassRootAppCheck(): void {
    Java.perform(() => {
    const ApplicationPackageManager = Java.use("android.app.ApplicationPackageManager");
    ApplicationPackageManager.getPackageInfo.overload("java.lang.String", "int").implementation = function (str: string, i: number) {
        if (ROOTmanagementApp.includes(str)) {
            logger.log("Anti Root Detect - check package : " + str);
            str = "ashen.one.ye.not.found";
        }
        return this.getPackageInfo(str, i);
    };
});
}

export function bypassShellCheck(): void {
    Java.perform(() => {
    const String = Java.use("java.lang.String");
    const ProcessImpl = Java.use("java.lang.ProcessImpl");

    ProcessImpl.start.implementation = function (cmdarray: any, env: any, dir: any, redirects: any, redirectErrorStream: any): any {
        if (cmdarray[0] === "mount") {
            logger.log("Anti Root Detect - Shell : " + cmdarray.toString());
            arguments[0] = Java.array("java.lang.String", [String.$new("")]);
            return ProcessImpl.start.apply(this, arguments);
        }

        if (cmdarray[0] === "getprop") {
            logger.log("Anti Root Detect - Shell : " + cmdarray.toString());
            const prop = ["ro.secure", "ro.debuggable"];
            if (prop.includes(cmdarray[1])) {
                arguments[0] = Java.array("java.lang.String", [String.$new("")]);
                return ProcessImpl.start.apply(this, arguments);
            }
        }

        if (cmdarray[0].includes("which")) {
            const prop = ["su"];
            if (prop.includes(cmdarray[1])) {
                logger.log("Anti Root Detect - Shell : " + cmdarray.toString());
                arguments[0] = Java.array("java.lang.String", [String.$new("")]);
                return ProcessImpl.start.apply(this, arguments);
            }
        }

        return ProcessImpl.start.apply(this, arguments);
    };
});
}

