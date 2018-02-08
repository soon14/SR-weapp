<?php
/**
 * Created by PhpStorm.
 * User: bcc
 * Date: 2017/11/16
 * Time: 下午10:22
 */

namespace app\api\controller;


use app\api\service\WxNotify;
use think\Log;

class Pay
{
    public function getPreOrder($orderID, $openid)
    {
        $pay = new \app\api\service\Pay();
        $res = $pay->makeWxPreOrder($orderID, $openid);
        return $res;
    }
}