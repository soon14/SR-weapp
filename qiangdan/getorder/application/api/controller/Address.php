<?php

namespace app\api\controller;

use app\admin\common\Utils;
use think\Controller;

/**
 * Class inputOrder提交订单
 * @package app\admin\controller
 */
class Address extends Base
{
    /**
     * 获取设置的地址
     * @return \think\response\Json
     */
    public function getCity()
    {

        $orderRes = db('city')->select();

        if ($orderRes) {
            $data = ['code' => 1, 'msg' => "成功", 'data' => $orderRes];
        } else {
            $data = ['code' => 0, 'msg' => "失败"];
        }
        return json($data);

    }


    /**
     * 求两个已知经纬度之间的距离,单位为米
     *
     * @param lng1 $ ,lng2 经度
     * @param lat1 $ ,lat2 纬度
     * @return float 距离，单位米
     * @author www.Alixixi.com
     */
    function getdistance($shoupostion, $jipostion)
    {
        $shou = explode(',', $shoupostion);
        $ji = explode(',', $jipostion);

        $longitude1 = $shou[0];
        $latitude1 = $shou[1];
        $longitude2 = $ji[0];
        $latitude2 = $ji[1];

        $a = $longitude1 . ',' . $latitude1;
        $b = $longitude2 . ',' . $latitude2;
        $url = "http://restapi.amap.com/v3/distance?origins=$a&destination=$b&type=0&output=json&key=abeee50258b92f0c142a2772a24f6f22";
        $ss = str_replace("amp;", "", $url);
        $sss = str_replace("'", "", $ss);

        $res = curl_get($sss);
       // dump($res);
        return $res;
        // dump($res['results'][0]['distance']);
//        die;

    }

    function getDistances($shoupostion, $jipostion, $unit = 2, $decimal = 2)
    {
        $shou = explode(',', $shoupostion);
        $ji = explode(',', $jipostion);

        $longitude1 = $shou[0];
        $latitude1 = $shou[1];
        $longitude2 = $ji[0];
        $latitude2 = $ji[1];
        $EARTH_RADIUS = 6370.996; // 地球半径系数
        $PI = 3.1415926;

        $radLat1 = $latitude1 * $PI / 180.0;
        $radLat2 = $latitude2 * $PI / 180.0;

        $radLng1 = $longitude1 * $PI / 180.0;
        $radLng2 = $longitude2 * $PI / 180.0;

        $a = $radLat1 - $radLat2;
        $b = $radLng1 - $radLng2;

        $distance = 2 * asin(sqrt(pow(sin($a / 2), 2) + cos($radLat1) * cos($radLat2) * pow(sin($b / 2), 2)));
        $distance = $distance * $EARTH_RADIUS * 1000;

        if ($unit == 2) {
            $distance = $distance / 1000;
        }

        return round($distance, $decimal);

    }

    /**
     * @desc 根据两点间的经纬度计算距离
     * @param float $lat 纬度值
     * @param float $lng 经度值
     */
    function getDistancess($shoupostion, $jipostion)
    {
        $shou = explode(',', $shoupostion);
        $ji = explode(',', $jipostion);

        $lng1 = $shou[0];
        $lat1 = $shou[1];
        $lng2 = $ji[0];
        $lat2 = $ji[0];

        $earthRadius = 6367000; //approximate radius of earth in meters


        $lat1 = ($lat1 * pi()) / 180;
        $lng1 = ($lng1 * pi()) / 180;

        $lat2 = ($lat2 * pi()) / 180;
        $lng2 = ($lng2 * pi()) / 180;


        $calcLongitude = $lng2 - $lng1;
        $calcLatitude = $lat2 - $lat1;
        $stepOne = pow(sin($calcLatitude / 2), 2) + cos($lat1) * cos($lat2) * pow(sin($calcLongitude / 2), 2);
        $stepTwo = 2 * asin(min(1, sqrt($stepOne)));
        $calculatedDistance = $earthRadius * $stepTwo;

        return round($calculatedDistance);
    }
}
