const _nacl = require('libsodium-wrappers')

module.exports = async () => {
    await _nacl.ready;
    let nacl = _nacl;

    const {publicKey, privateKey} = nacl.crypto_sign_keypair();
    //console.log(nacl.crypto_sign_keypair());
    return Object.freeze({
        verifyingKey: publicKey,
        sign: (msg) => {
            return nacl.crypto_sign(msg,privateKey);
        }
    });
}