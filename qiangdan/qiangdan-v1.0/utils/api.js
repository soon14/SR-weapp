const BASE_URL = 'https://xxf.ql178.com/getorder/public/api/';
module.exports = {

    // 地址簿
    getRememberAddresses(categories) {
        var url = BASE_URL + 'user/getRememberAddresses'
        return url;
    },
}