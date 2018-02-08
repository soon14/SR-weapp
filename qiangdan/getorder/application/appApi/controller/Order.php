<?php

namespace app\appApi\controller;

use think\Controller;
use think\Log;


/**
 * Class inputOrder提交订单
 * @package app\admin\controller
 */
class Order extends Controller
{

    /**
     * 获取要抢单的列表
     * @param $status 0表示还没有被抢单
     * @return string
     */
    public function getQiangOrderList($getorder_status, $order_status)
    {

        $res = db('order')->where('getorder_status', $getorder_status)->where('order_status', $order_status)->select();
        if ($res) {
            $data['code'] = 1;
            $data['msg'] = '获取成功';
            $data['data'] = $res;
        } else {
            $data['code'] = 0;
            $data['msg'] = '暂无数据';
        }
        return json_encode($data);

    }

    /**
     * 抢单
     * @param $openid
     * @param $orderid
     * @return array
     */
    public function getQiangOrder($openid, $orderid)
    {
        $orderStatus = db('order')->where('orderid', $orderid)->find();
        if ($orderStatus['getorder_status'] == 0) {
            $res = db('order')->where('orderid', $orderid)->update(['getorder_status' => 1]);

            if ($res) {
                $datas = ['order_id' => $orderid, 'openid' => $openid];
                $getOrderRes = db('getorder')->insert($datas);
                if ($getOrderRes) {
                    //给寄件人发短信
                    $msg1 = '恭喜您！您的订单已被邻速达的战士们接单，取件码是'.$orderStatus['jiedancode'].'，我们会以最快的速度过来取件，谢谢！';

                    sendNewCode($orderStatus['ji_tel'], $msg1);
                    //给收件人发短信
                    $msg2 = '恭喜您！您的订单已被邻速达的战士们接单，收件码是'.$orderStatus['querencode'].'，我们会以最快的速度送达，谢谢！';
                    sendNewCode($orderStatus['shou_tel'], $msg2);

                    $data['code'] = 1;
                    $data['msg'] = "成功";


                } else {
                    db('order')->where('orderid', $orderid)->update(['getorder_status' => '0']);
                    $data['code'] = 0;
                    $data['msg'] = "操作失败，请稍后再试！";
                }
            } else {
                $data['code'] = 0;
                $data['msg'] = "操作失败，请稍后再试！";
            }
        } else {
            $data['code'] = 0;
            $data['msg'] = "操作失败，请稍后再试！";
        }
        return json_encode($data);
    }

    /**
     * 根据openid查找抢到的订单
     * @param $openid
     * @return string
     */
    public function getQiangOrderByOpenId($openid)
    {
        $res = db('getorder')->where(['o.openid' => $openid])
            ->alias('a')
            ->join('order o', 'a.order_id=o.orderid')
            ->select();
        if ($res) {
            foreach ($res as $v) {
                $newdatas[] = $v['time'];
            }
            array_multisort($newdatas, SORT_DESC, $res);



            $data['code'] = 1;
            $data['msg'] = "成功";
            $data['data'] = $res;
        } else {
            $data['code'] = 0;
            $data['msg'] = "暂无数据";
        }
        return json_encode($data);
    }

    /**
     * 改变订单状态
     * @param $orderId
     * @return string
     */
    public function peiSong($orderId, $formId)
    {
        $res = db('order')->where('orderid', $orderId)->update(['order_status' => 3]);

        if ($res) {
            $data['code'] = 1;
            $data['msg'] = "成功";
            //成功后发送消息
            // $msg = new Message();
            //  $msg->getToken($formId,'订单号','名称','电话','时间','姓名');

        } else {
            $data['code'] = 0;
            $data['msg'] = "失败";
        }
        return json_encode($data);
    }

    /**
     * 根据id获取订单详情
     * @param $orderId
     * @return string
     */
    public function getOrderDetailById($orderId)
    {
        $res = db('order')->where('orderid', $orderId)->find();
        if ($res) {
            $data['code'] = 1;
            $data['msg'] = '获取成功';
            $data['data'] = $res;
        } else {
            $data['code'] = 0;
            $data['msg'] = '获取失败';
        }

        return json_encode($data);
    }

    /**
     * 确认收货
     */
    public function getQRSH($orderId)
    {
        $res = db('order')->where('orderid', $orderId)->update(['order_status' => 3]);
        if ($res) {
            $data['code'] = 1;
            $data['msg'] = '获取成功';
        } else {
            $data['code'] = 0;
            $data['msg'] = '获取失败';
        }
        return json_encode($data);

    }

    /**
     * 确认送达
     */
    public function getQRSD($orderId)
    {
        $res = db('order')->where('orderid', $orderId)->update(['order_status' => 4]);
        if ($res) {
            $orderRes = db('order')->where('orderid', $orderId)->find();
            $getorderRes = db('getorder')->where('order_id', $orderId)->find();
            $allmoneyRes = db('all_money')->where('openid', $getorderRes['openid'])->find();

            $allMoney = $allmoneyRes['allMoney'] + $orderRes['payprice'];

            db('all_money')->where('openid', $getorderRes['openid'])->update(['allMoney' => $allMoney]);

            $data['code'] = 1;
            $data['msg'] = '获取成功';
        } else {
            $data['code'] = 0;
            $data['msg'] = '获取失败';
        }
        return json_encode($data);

    }

    public function judgeCode($orderId, $code, $type)
    {
        $res = db('order')->where('orderId', $orderId)->find();
        if ($res) {

            if ($type == 1) {
                if ($res['jiedancode'] == $code) {
                    $data['code'] = 1;
                    $data['msg'] = '获取成功';
                    $data['data'] = $type;

                } else {
                    $data['code'] = 0;
                    $data['msg'] = '失败';
                }
            } else {

                if ($res['querencode'] == $code) {
                    $data['code'] = 1;
                    $data['msg'] = '获取成功';
                    $data['data'] = $type;

                } else {
                    $data['code'] = 0;
                    $data['msg'] = '失败';
                }
            }
        } else {
            $data['code'] = 0;
            $data['msg'] = '失败';
        }
        return json_encode($data);

    }

}