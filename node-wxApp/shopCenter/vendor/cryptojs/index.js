/**
 * Created by rd on 2017/5/4.
 */
// 引入CryptoJS
let Crypto = require('../cryptojs/cryptojs.js').Crypto;

function RdWXBizDataCrypt(sessionKey) {
    //this.appId = appId;
    this.sessionKey = sessionKey;
}

RdWXBizDataCrypt.prototype.decryptData = function (encryptedData, iv) {
    // base64 decode ：使用 CryptoJS 中 Crypto.util.base64ToBytes()进行 base64解码
    let decryptResult;
    encryptedData = Crypto.util.base64ToBytes(encryptedData);
    let key = Crypto.util.base64ToBytes(this.sessionKey);
    iv = Crypto.util.base64ToBytes(iv);

    // 对称解密使用的算法为 AES-128-CBC，数据采用PKCS#7填充
    let mode = new Crypto.mode.CBC(Crypto.pad.pkcs7);

    try {
        // 解密
        let bytes = Crypto.AES.decrypt(encryptedData, key, {
            asBpytes:true,
            iv: iv,
            mode: mode
        });
        decryptResult = JSON.parse(bytes);

    } catch (err) {
        console.log(err)
    }

    /*if (decryptResult.watermark.appid !== this.appId) {
        console.log(err)
    }*/

    return decryptResult
};

module.exports = RdWXBizDataCrypt;