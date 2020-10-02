const _nacl = require('libsodium-wrappers')

module.exports = async (key) => {
    await _nacl.ready;
    let nacl = _nacl;

    if (!key)
        throw 'no key';
    return Object.freeze({
        decrypt: (ciphertext, nonce) => {
            return nacl.crypto_secretbox_open_easy(ciphertext, nonce, key)
        }
    });
}