const _nacl = require('libsodium-wrappers')

module.exports = async (sharedRx) => {
    await _nacl.ready;
    let nacl = _nacl;

    return Object.freeze({
        encrypt: (msg) => {
            const nonce = nacl.randombytes_buf(nacl.crypto_secretbox_NONCEBYTES);
            const ciphertext = nacl.crypto_secretbox_easy(msg, nonce, sharedRx);
            return {
                nonce: nonce,
                ciphertext: ciphertext
            }

        }
    })
}