<?php
/**
 * Created by PhpStorm.
 * User: bcc
 * Date: 2017/11/16
 * Time: 上午10:23
 */

namespace app\api\service;


 use think\Exception;
 use think\Loader;

Loader::import('WxPay.WxPay', EXTEND_PATH, '.Api.php');

class Pay
{
    private $orderID;
    private $orderNo;



//    public function pay()
//    {
//        //$this->checkOrderValid();
////        $order = new Order();
////        $status = $order->checkOrderStock($this->orderID);
////        if (!$status['pass'])
////        {
////            return $status;
////        }
//        return $this->makeWxPreOrder();
//        //        $this->checkProductStock();
//    }

    public function makeWxPreOrder($orderID,$openid)
    {

     // $ress= db('order')->where('orderid',$orderID)->find();

//     $res = curl_get('https://api.weixin.qq.com/sns/jscode2session?appid=wxc9ee0d2ba50d6f52&secret=0898bbdda77d538e64c98d517cd722d7&js_code=011DVxy80b6BaI1rQsw80VJey80DVxyP&grant_type=authorization_code');
//      $wxRes = json_decode($res, true);
//
        $wxOrderData = new \WxPayUnifiedOrder();
        $wxOrderData->SetOut_trade_no($orderID);
        $wxOrderData->SetTrade_type('JSAPI');
        $wxOrderData->SetTotal_fee(1);
        $wxOrderData->SetBody('邻速达');
        $wxOrderData->SetOpenid($openid);
        $wxOrderData->SetNotify_url(config('secure.pay_back_url'));
        // $wxOrderData->SetNotify_url('www.baidu.com');

        //dump($wxOrderData);

        return $this->getPaySignature($wxOrderData);
    }


    //向微信请求订单号并生成签名
    private function getPaySignature($wxOrderData)
    {
        $wxOrder = \WxPayApi::unifiedOrder($wxOrderData);
       //  dump($wxOrder);

        // 失败时不会返回result_code
        if ($wxOrder['return_code'] != 'SUCCESS' || $wxOrder['result_code'] != 'SUCCESS') {
//            Log::record($wxOrder, 'error');
//            Log::record('获取预支付订单失败', 'error');
        throw new Exception('获取预支付订单失败');
        }
        // $this->recordPreOrder($wxOrder);
        $signature = $this->sign($wxOrder);
        return $signature;
    }
//    private function recordPreOrder($wxOrder){
//        // 必须是update，每次用户取消支付后再次对同一订单支付，prepay_id是不同的
//        OrderModel::where('id', '=', $this->orderID)
//            ->update(['prepay_id' => $wxOrder['prepay_id']]);
//    }
    // 签名
    private function sign($wxOrder)
    {
        $jsApiPayData = new \WxPayJsApiPay();
        $jsApiPayData->SetAppid(config('wx.app_id'));
        $jsApiPayData->SetTimeStamp((string)time());
        $rand = md5(time() . mt_rand(0, 1000));
        $jsApiPayData->SetNonceStr($rand);
        $jsApiPayData->SetPackage('prepay_id=' . $wxOrder['prepay_id']);
        $jsApiPayData->SetSignType('md5');
        $sign = $jsApiPayData->MakeSign();
        $rawValues = $jsApiPayData->GetValues();
        $rawValues['paySign'] = $sign;
        unset($rawValues['appId']);
        return $rawValues;
    }

}