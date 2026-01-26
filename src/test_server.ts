import { AntigravityServer } from './server/index';
import * as path from 'path';

async function test() {
    console.log("🧪 Starting AntigravityServer Diagnostic...");
    const server = new AntigravityServer(3001, path.join(__dirname, '..'));

    try {
        const urls = await server.start();
        console.log("✅ Server started successfully!");
        console.log(`🔗 Local URL:  "${urls.localUrl}"`);
        console.log(`🔗 Secure URL: "${urls.secureUrl}"`);
        console.log(`🔍 Server.secureUrl: "${server.secureUrl}"`);

        const qrcode = require('qrcode');
        try {
            const dataUrl = await qrcode.toDataURL(urls.secureUrl || urls.localUrl);
            console.log("✅ QR Code generated successfully (DataURL length: " + dataUrl.length + ")");
        } catch (qrErr) {
            console.error("❌ QR Code generation FAILED:", qrErr);
        }

        if (!urls.secureUrl && !urls.localUrl) {
            console.error("❌ ERROR: Both URLs are empty!");
        } else if (!urls.secureUrl) {
            console.warn("⚠️ WARNING: Secure URL is empty!");
        }

        server.stop();
        console.log("🛑 Server stopped.");
        process.exit(0);
    } catch (e) {
        console.error("❌ Failed to start server:", e);
        process.exit(1);
    }
}

test();
