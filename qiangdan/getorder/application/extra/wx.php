<?php
/**
 * Created by 七月
 * Author: 七月
 * 微信公号: 小楼昨夜又秋风
 * 知乎ID: 七月在夏天
 * Date: 2017/2/22
 * Time: 13:49
 */

return [
    //  +---------------------------------
    //  微信相关配置
    //  +---------------------------------

    // 小程序app_id
    'app_id' => 'wxf267dddd98a3d57d',
    // 小程序app_secret
    'app_secret' => 'd10aa77d262ca7179f7720ac1d55aaab',

    // 微信使用code换取用户openid及session_key的url地址
    'login_url' => "https://api.weixin.qq.com/sns/jscode2session?" .
        "appid=%s&secret=%s&js_code=%s&grant_type=authorization_code",

    // 微信获取access_token的url地址
    'access_token_url' => "https://api.weixin.qq.com/cgi-bin/token?" .
        "grant_type=client_credential&appid=%s&secret=%s",

    // 推送app_id
    'jpush_id' => '2fce23e9e9d176ddb51fd042',
    // 推送app_secret
    'jpush_secret' => 'ddf0bf640733b170c28ee93e',


];
