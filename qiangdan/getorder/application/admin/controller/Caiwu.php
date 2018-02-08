<?php

namespace app\admin\controller;

/**
 * Class Caiwu
 * @package app\admin\controller
 * 财务管理
 */
class Caiwu extends Base
{
    /**
     * 订单统计
     * @return \think\response\View
     */

    public function lst()
    {
        $res = db('order')->field('id,time,payprice,remark')->where('order_status', '4')->paginate(10);
        $allPrice = 0;
        $ordernum = 0;

        foreach ($res as $k => $v) {
            $ordernum = $ordernum + 1;
            $allPrice = $allPrice + $v['payprice'];
        }
        //获取配送人员
        $psRes = db('psuser')->where('isauth', 1)->select();
        $psOrder = array();
        foreach ($psRes as $key => $v) {
            $ps['name'] = $v['realname'];
            //  $ress = db('getorder')->alias('a')->join('order o', 'a.orderid=o.orderid')->where('a.openid', $v['openId'])->select();

            $ress = db('getorder')->alias('g')->join('psuser p', 'g.openid=p.openid')->where('g.openid', $v['openId'])->select();

            $allMoneyRes = db('all_money')->where('openid', $v['openId'])->find();
            $agetTiMoney = db('money_detail')->where('openid', $v['openId'])->select();
            $allTimoney = 0;
            foreach ($agetTiMoney as $keys => $vs) {
                $allTimoney += $vs['price'];
            }
            $nums = 0;
            foreach ($ress as $keys => $vs) {
                $nums += 1;
            }

            $ps['num'] = $nums;
            $ps['money'] = $allMoneyRes['allMoney'];
            $ps['timoney'] = $allTimoney;

            array_push($psOrder, $ps);
        }
        $this->assign(['lst' => $res, 'price' => $allPrice, 'ordernum' => $ordernum, 'psOrder' => $psOrder, 'psNum' => count($psRes)]);
        return view('lst');
    }

    public function getMoney()
    {
        $res = db('money_detail')->alias('m')->join('psuser p', 'm.openid=p.openId ')->field('m.id,p.realname,m.price,m.time,p.cards,p.bankName')->where('is_ti', 0)->select();
        $this->assign(['list' => $res]);
        return view('getMoney');
    }

    public function commits($id)
    {
        $res = db('money_detail')->where('id', $id)->update(['is_ti' => 1]);
        if ($res) {
            $this->success('操作成功！', 'getMoney');
        } else {
            $this->error('操作失败！');
        }
    }
}
