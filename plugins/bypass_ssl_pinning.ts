// @ts-nocheck


import { logger } from "./logger.js";


// Bypass SSL pinning in TypeScript
export function bypassCertificatePinningWithTimeout(timeout: number): void {
    setTimeout(() => {
        Java.perform(() => {
            logger.log("Cert Pinning Bypass/Re-Pinning");

            const CertificateFactory = Java.use("java.security.cert.CertificateFactory");
            const FileInputStream = Java.use("java.io.FileInputStream");
            const BufferedInputStream = Java.use("java.io.BufferedInputStream");
            const X509Certificate = Java.use("java.security.cert.X509Certificate");
            const KeyStore = Java.use("java.security.KeyStore");
            const TrustManagerFactory = Java.use("javax.net.ssl.TrustManagerFactory");
            const SSLContext = Java.use("javax.net.ssl.SSLContext");

            // Load CAs from an InputStream
            logger.log("Loading our CA...");
            const cf = CertificateFactory.getInstance("X.509");

            let fileInputStream: any;
            try {
                fileInputStream = FileInputStream.$new("/data/local/tmp/mitmproxy-ca-cert.cer.crt");
            } catch (err) {
                logger.error(" " + err);
                return;
            }

            const bufferedInputStream = BufferedInputStream.$new(fileInputStream);
            const ca = cf.generateCertificate(bufferedInputStream);
            bufferedInputStream.close();

            const certInfo = Java.cast(ca, X509Certificate);
            logger.log("Our CA Info: " + certInfo.getSubjectDN());

            // Create a KeyStore containing our trusted CAs
            logger.log("Creating a KeyStore for our CA...");
            const keyStoreType = KeyStore.getDefaultType();
            const keyStore = KeyStore.getInstance(keyStoreType);
            keyStore.load(null, null);
            keyStore.setCertificateEntry("ca", ca);

            // Create a TrustManager that trusts the CAs in our KeyStore
            logger.log("Creating a TrustManager that trusts the CA in our KeyStore...");
            const tmfAlgorithm = TrustManagerFactory.getDefaultAlgorithm();
            const tmf = TrustManagerFactory.getInstance(tmfAlgorithm);
            tmf.init(keyStore);
            logger.log("Our TrustManager is ready...");

            logger.log("Hijacking SSLContext methods now...");
            logger.log("Waiting for the app to invoke SSLContext.init()...");

            SSLContext.init.overload(
                "[Ljavax.net.ssl.KeyManager;", 
                "[Ljavax.net.ssl.TrustManager;", 
                "java.security.SecureRandom"
            ).implementation = function (
                keyManagers: unknown, 
                trustManagers: unknown, 
                secureRandom: unknown
            ) {
                logger.log("App invoked javax.net.ssl.SSLContext.init...");
                SSLContext.init.overload(
                    "[Ljavax.net.ssl.KeyManager;", 
                    "[Ljavax.net.ssl.TrustManager;", 
                    "java.security.SecureRandom"
                ).call(this, keyManagers, tmf.getTrustManagers(), secureRandom);
                logger.log("SSLContext initialized with our custom TrustManager!");
            };

        });
    }, timeout); // Executes after the specified timeout (in milliseconds)
}

export default bypassCertificatePinningWithTimeout;
