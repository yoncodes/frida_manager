import { logger } from "./logger.js";

let fileOutputStream: any = null; // Global variable to track the file stream

export function writeToFile(data: string): void {
    Java.perform(() => {
        try {
            if (!fileOutputStream) {
                logger.error("[Error] File stream is not initialized. Call openNewFile() first.");
                return;
            }
            const JavaString = Java.use("java.lang.String");
            const byteArray = JavaString.$new(data).getBytes();
            fileOutputStream.write(byteArray);
            fileOutputStream.flush(); // Ensure data is written to the file
        } catch (err) {
            logger.error(`[Error] Failed to write to file: ${err}`);
        }
    });
}

export function closeFileStream(): void {
    Java.perform(() => {
        try {
            if (fileOutputStream) {
                logger.log("[*] Closing file stream...");
                fileOutputStream.flush();
                fileOutputStream.close();
                fileOutputStream = null; // Release the reference
            } else {
                logger.warn("[Warning] No file stream to close.");
            }
        } catch (err) {
            logger.error(`[Error] Failed to close file stream: ${err}`);
        }
    });
}


export function openNewFile(outputFileNameBase: string = "dump"): void {
    Java.perform(() => {
        const FileOutputStream = Java.use("java.io.FileOutputStream");
        const File = Java.use("java.io.File");
        const ActivityThread = Java.use("android.app.ActivityThread");

        try {
            const appContext = ActivityThread.currentApplication().getApplicationContext();
            let privateDir = appContext.getFilesDir().getAbsolutePath();

            // Replace `/data/user/0/` with `/data/data/`
            if (privateDir.startsWith("/data/user/0/")) {
                privateDir = privateDir.replace("/data/user/0/", "/data/data/");
            }

            const currentFilePath = `${privateDir}/${outputFileNameBase}.cs`;

            if (fileOutputStream) {
                logger.log("[*] Closing previous file stream...");
                fileOutputStream.flush();
                fileOutputStream.close();
                fileOutputStream = null; // Release the reference
            }

            logger.log(`[*] Creating new file: ${currentFilePath}`);
            const file = File.$new(currentFilePath);
            if (!file.exists()) {
                logger.log("[*] File does not exist. Creating new file.");
                file.createNewFile();
            }

            fileOutputStream = FileOutputStream.$new(currentFilePath, true); // Append mode
            logger.log(`[*] File opened for writing: ${currentFilePath}`);

            // Clean up Java references
            file.$dispose();
            appContext.$dispose();
            ActivityThread.$dispose();
        } catch (err) {
            logger.log(`[*] Error opening file: ${err}`);
        }
    });
}

