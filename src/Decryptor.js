const nacl = require('libsodium-wrappers');


module.exports = (key) => {
    if (!key)
        throw 'no key';
    return Object.freeze({
        Decryptor: (key) => {

            this.key = key;
        },
        decrypt: (ciphertext, nonce) => {
            return nacl.crypto_secretbox_open_easy(ciphertext, nonce, key)
        }
    });
}