const nacl = require('tweetnacl');

const HEADER_TIME = "X-Signature-Timestamp";
const HEADER_SIG  = "X-Signature-Ed25519";
const PLACEHOLDER_VALUE = "#DISCORD#";
const SECRET_KEY_ENVVAR = "ED25519_SECRET_KEY";

async function addSignature(context) {

    // Only work with requests that have the placeholder header
    if (!context.request.hasHeader(HEADER_SIG) ||
        context.request.getHeader(HEADER_SIG) != PLACEHOLDER_VALUE)
    {
        console.log("[discord-auth]: Skipping... no '%s' header in request", HEADER_SIG);
        return;
    }

    // Read Public Key
    const secretKeyHex = await context.request.getEnvironmentVariable(SECRET_KEY_ENVVAR);
    if (!secretKeyHex) {
        console.log("[global-headers]: Skipping... no [SECRET_KEY_ENVVAR] var present in environment");
        return;
    }

    // Convert to Byte Array
    const secretKey = Buffer.from(secretKeyHex, 'hex');

    // Generate Timestamp
    const sigTimestamp = Math.round(new Date().getTime()/1000).toString();

    // Content to Sign
    const contentToSign = sigTimestamp + context.request.getBody().text

    // Generate Signature
    const signature = nacl.sign.detached(Buffer.from(contentToSign), secretKey);
    const signatureHex = Buffer.from(signature).toString('hex');

    // Add Headers
    context.request.setHeader(HEADER_TIME, sigTimestamp);
    context.request.setHeader(HEADER_SIG,  signatureHex)

    // Log out
    console.log("[discord-auth]: Added '%s: %s'", HEADER_TIME, sigTimestamp);
    console.log("[discord-auth]: Added '%s: %s'", HEADER_SIG,  signatureHex);
}

// Exports
exports.requestHooks = [addSignature];


