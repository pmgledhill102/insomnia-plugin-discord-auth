// generate-keypair.js
// - Generate a Hex-Encoded ED25519 Signing Key Pair
// - It is expected that the secret key is twice the size of the private key

const nacl = require('tweetnacl');

var newBox = nacl.sign.keyPair();
const secretKey = Buffer.from(newBox.secretKey).toString('hex');
const publicKey = Buffer.from(newBox.publicKey).toString('hex');

console.log("secretKey: %s", secretKey);
console.log("publicKey: %s", publicKey);
