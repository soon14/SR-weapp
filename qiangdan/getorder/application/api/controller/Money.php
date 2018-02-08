<?php
/**
 * Created by PhpStorm.
 * User: bcc
 * Date: 2017/11/18
 * Time: 上午12:35
 */

namespace app\api\controller;


class Money extends Base
{
    /**
     * 用户交易详情
     * @param $openid
     * @return string
     */
    public function getUserMoneyDetail($openid)
    {
        $res = db('order')->field(['orderid', 'time', 'payprice'])->where('openid', $openid)->select();
        if ($res) {
            $data['code'] = 1;
            $data['msg'] = "获取成功";
            $data['data'] = $res;
        } else {
            $data['code'] = 0;
            $data['msg'] = "获取失败";
        }
        return json_encode($data);
    }

    /**
     * 获取总金额
     * @param $openid
     * @return string
     */
    public function getShopAllMoney($openid)
    {
        $res = db('all_money')->where('openid', $openid)->find();
        if ($res) {
            $data['code'] = 1;
            $data['msg'] = "获取成功";
            $data['data'] = $res;
        } else {
            $data['code'] = 0;
            $data['msg'] = "暂无数据";
        }
        return json_encode($data);
    }

    /**
     * 获取提现流水
     * @param $openid
     * @return string
     */
    public function getShopTiMoneyList($openid)
    {
        $res = db('money_detail')->where('openid', $openid)->select();
        if ($res) {
            $data['code'] = 1;
            $data['msg'] = "获取成功";
            $data['data'] = $res;
        } else {
            $data['code'] = 0;
            $data['msg'] = "暂无数据";
        }
        return json_encode($data);
    }
}