const _nacl = require('libsodium-wrappers')
const _Encryptor = require('./Encryptor')
const _Decryptor = require('./Decryptor')

let tempObj = async(peer = null) =>
{
    await _nacl.ready;
    let nacl = _nacl;

    let nonce, sessionKeys, msg_friend, secureSessionPeer = {}, thisObj = {}, encryptor, decryptor;
    const {publicKey, privateKey} = nacl.crypto_kx_keypair();

    if (peer) {
        secureSessionPeer = peer;
        sessionKeys = {
            sharedRx,
            sharedTx
        } = nacl.crypto_kx_server_session_keys(publicKey, privateKey, peer.publicKey);
        encryptor = await _Encryptor(sessionKeys.sharedTx);
        decryptor = await _Decryptor(sessionKeys.sharedRx);
        await peer.generateCode(publicKey);
    }
    thisObj.publicKey = publicKey;
    thisObj.setSession = function (sess) {
        secureSessionPeer = sess;
    }
    thisObj.setMsg = function (msg) {
        thisObj.msg_friend = msg;
    }
    thisObj.getNonce = function () {
        return nonce;
    }
    thisObj.setMsg = function (msg) {
        msg_friend = msg;
    }

    thisObj.encrypt = function (msg) {
        const nonce = nacl.randombytes_buf(nacl.crypto_secretbox_NONCEBYTES);
        const ciphertext = encryptor.encrypt(msg, nonce);
        return {ciphertext, nonce}
    }
    thisObj.decrypt = function (ciphertext, nonce) {
        return decryptor.decrypt(ciphertext, nonce);
    }
    thisObj.generateCode = async function (otherPublicKey) {
        let sessionKeys = {
            sharedRx,
            sharedTx
        } = nacl.crypto_kx_client_session_keys(publicKey, privateKey, otherPublicKey);
        encryptor = await _Encryptor(sessionKeys.sharedTx);
        decryptor = await _Decryptor(sessionKeys.sharedRx);
    }
    thisObj.send = function (msg) {
        let encrypted = this.encrypt(msg);
        secureSessionPeer.setMsg(encrypted);
    }
    thisObj.receive = function () {
        return this.decrypt(msg_friend.ciphertext, msg_friend.nonce);
    }
    if (peer)
        peer.setSession(thisObj);

    return Object.freeze(thisObj);
}
module.exports = tempObj;
