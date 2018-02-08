<?php

namespace app\api\controller;

use app\admin\common\Utils;
use app\api\service\WxNotify;
use think\Log;

/**
 * Class inputOrder提交订单
 * @package app\admin\controller
 */
class Order extends Base
{
    /**
     * 下单接口
     * @param null $ji_address 寄件人地址
     * @param null $ji_lon 寄件人经度
     * @param null $ji_lat 寄件人维度
     * @param null $shou_address 收件人地址
     * @param null $shou_lon 收件人经度
     * @param null $shou_lat 收件人维度
     * @param null $ji_name 寄件人名称
     * @param null $ji_tel 寄件人电话
     * @param null $shou_name 收件人名称
     * @param null $shou_tel 收件人电话
     * @param null $isjia 是否加价
     * @param null $jia_price 加价金额
     * @param null $payprice 支付金额
     * @param null $goodsname 货物名称
     * @param null $remark 备注
     * @return \think\response\Json
     */
    public function inputOrder($openid, $ji_address, $ji_lon, $ji_lat, $shou_address, $shou_lon, $shou_lat, $ji_name, $ji_tel, $shou_name, $shou_tel, $isjia,
                               $jia_price, $payprice, $goodsname, $remark = null, $gl, $zl)
    {
        $res = [
            'openid' => $openid,
            'ji_address' => $ji_address,
            'ji_lon' => $ji_lon,
            'ji_lat' => $ji_lat,
            'shou_address' => $shou_address,
            'shou_lon' => $shou_lon,
            'shou_lat' => $shou_lat,
            'ji_name' => $ji_name,
            'ji_tel' => $ji_tel,
            'shou_name' => $shou_name,
            'shou_tel' => $shou_tel,
            'isjia' => $isjia,
            'jia_price' => $jia_price,
            'payprice' => $payprice,
            'goodsname' => $goodsname,
            'order_status' => '1',
            'remark' => $remark,
            'gl' => $gl,
            'zl' => $zl,
            'jiedancode' => $num = rand(100000, 999999),
            'querencode' => $num = rand(100000, 999999)
        ];
        $res['time'] = time();
        //获取uuid
        $uuid = new Utils();
        $res['orderid'] = $uuid->uuid();
        $shou = $this->getLonLat($shou_address);
        $ji = $this->getLonLat($ji_address);

        $shous = json_decode($shou);
        $jis = json_decode($ji);

        if ($shous->status == 0) {
            $res['shou_lon'] = substr($shous->result->location->lng, 0, 20);
            $res['shou_lat'] = substr($shous->result->location->lat, 0, 20);

        }
        if ($jis->status == 0) {
            $res['ji_lon'] = substr($jis->result->location->lng, 0, 20);
            $res['ji_lat'] = substr($jis->result->location->lat, 0, 20);

        }
//        $shous->result;//{"status":0,"result":{"location":{"lng":117.12974173792147,"lat":36.68724149792151},"precise":1,"confidence":80,"level":"商务大厦"}}
//        Log::error(substr($shous->result->location->lng, 0, 15));

        //   Log::error($res);


        $orderRes = db('order')->insert($res);
        if ($orderRes) {
            $data['code'] = 1;
            $data['msg'] = "成功";
            $data['orderid'] = $res['orderid'];

            $pay = new Pay();
            $payData = $pay->getPreOrder($res['orderid'], $openid);
            $data['data'] = $payData;


        } else {
            $data['code'] = 0;
            $data['msg'] = "失败";
        }
        return json_encode($data);
    }

    /**
     * 根据地址获取经纬度
     */
    public function getLonLat($address)
    {
        $URL = 'http://api.map.baidu.com/geocoder/v2/?address=' . $address . '&output=json&ak=V1IggXf1lWwvsNPgij5Bqt7q5awe9uXH';
        $add = curl_get($URL);
        // Log::error($add);
        return $add;
    }

    /**
     * @param $id
     * 订单删除
     */
    public function del($orderId)
    {
        $res = db('order')->where('orderid', $orderId)->delete();
//        if ($res) {
//            $this->success('订单删除成功', 'lst');
//        } else {
//            $this->error('订单删除失败');
//        }

        if ($res) {
            $data = ['code' => 1, 'msg' => "成功"];
        } else {
            $data = ['code' => 0, 'msg' => "失败"];
        }
        return json_encode($data);

    }

    /**
     * 获取订单基本数据
     * @return \think\response\Json
     */
    public function getBaseInfo()
    {
        $res = db('jcfee')->find();

        if ($res) {
            $data = ['code' => 1, 'msg' => "成功", 'data' => $res];
        } else {
            $data = ['code' => 0, 'msg' => "失败"];
        }
        return json($data);

    }

    /**
     * 获取基础费
     * @return \think\response\Json
     */
    public function getBaseStatusFee()
    {
        $res = db('jc_fee')->where('status', 1)->find();

        if ($res) {
            $data = ['code' => 1, 'msg' => "成功", 'data' => $res];
        } else {
            $data = ['code' => 0, 'msg' => "失败"];
        }
        return json($data);

    }

    /**
     * 获取我的订单
     */
    public function getMyOrder($openid)
    {
        $res = db('order')->where('openid', $openid)->select();
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
        $orderRes = db('order')->where('orderid', $orderId)->find();

        if ($orderRes) {
            if ($orderRes['getorder_status'] == 0) {
                $data['code'] = 0;
                $data['msg'] = '暂无配送员抢单';
            } else {
                $res = db('order')->where('orderid', $orderId)->update(['order_status' => 3]);
                if ($res) {
                    $data['code'] = 1;
                    $data['msg'] = '获取成功';
                } else {
                    $data['code'] = 0;
                    $data['msg'] = '获取失败';
                }
            }
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

    public function redirectNotify()
    {
        $notify = new WxNotify();
        $notify->handle();
    }
}
