<?php
/**
 * Created by PhpStorm.
 * User: bcc
 * Date: 2017/11/18
 * Time: 上午12:35
 */

namespace app\appApi\controller;


use think\Controller;

class Money extends Controller
{
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
     * 申请提现
     * @param $openid
     * @param $price
     * @return string
     */
    public function getTi($openid, $price)
    {
        $datas = [
            'openid' => $openid,
            'price' => $price,
            'time' => time(),
            'is_ti' => 0,
        ];
        $res = db('money_detail')->insert($datas);
        if ($res) {
            $allRes = db('all_money')->where('openid', $openid)->find();
            $money = $allRes['allMoney'] - $price;
            db('all_money')->where('openid', $openid)->update(['allMoney' => $money]);

            $data['code'] = 1;
            $data['msg'] = "申请提现成功";
        } else {
            $data['code'] = 0;
            $data['msg'] = "申请提现失败";
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