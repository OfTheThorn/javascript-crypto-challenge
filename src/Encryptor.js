const _nacl = require('libsodium-wrappers')

module.exports = async (sharedRx) => {
    await _nacl.ready;
    let nacl = _nacl;
    let ciphertext, nonce;
    return Object.freeze({
        encrypt: (msg, nonce) => {
            return nacl.crypto_secretbox_easy(msg, nonce, sharedRx);

        }
    })
}