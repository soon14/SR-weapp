<?php
/**
 * Created by PhpStorm.
 * User: bcc
 * Date: 2017/11/16
 * Time: 下午10:36
 */

namespace app\api\controller;


use JPush\Client as JPush;

class Jpushs extends Base
{

    public function getcode()
    {
        $client = new JPush(config('wx.jpush_id'), config('wx.jpush_secret'));
        $client->push()
            ->setPlatform('all')
            ->addAllAudience()
            ->setNotificationAlert('您有新的订单，请注意查收')
            ->send();
    }

}