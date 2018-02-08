<?php
/**
 * Created by PhpStorm.
 * User: bcc
 * Date: 2017/11/16
 * Time: 下午10:36
 */

namespace app\appApi\controller;


use think\Controller;
use think\Log;

class User extends Controller
{

    /**
     * 根据手机号获取OPenid
     * @param $phone
     * @return string
     */
    public function getOpenID($phone)
    {
        $res = db('psuser')->where("phone", $phone)->where('status', 0)->where('isauth', 1)->find();
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
     * @param $openId
     * @return string
     * 根据openId获取数据
     */
    public function getUserInfoByOpenId($openId)
    {
        $res = db('psuser')->where('openId', $openId)->find();
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

    public function changePhone($phone, $openId)
    {
        $res = db('psuser')->where('openId', $openId)->update(['phone' => $phone]);
        if ($res) {
            $data['code'] = 1;
            $data['msg'] = '获取成功';

        } else {
            $data['code'] = 0;
            $data['msg'] = '暂无数据';
        }
        return json_encode($data);

    }

    /**
     * 上传最后位置
     */
    public function updataPos($openId, $lon, $lat)
    {
        $psRes = db('pspos')->where('openId', $openId)->find();
        Log::error($psRes);
        if ($psRes) {

            $res = db('pspos')->where('openId', $openId)->update(['lon' => $lon, 'lat' => $lat]);
            Log::error($res);

            if ($res) {
                $data['code'] = 1;
                $data['msg'] = "成功";

            } else {
                $data['code'] = 0;
                $data['msg'] = "失败";

            }
        } else {
            $res = db('pspos')->insert(['openId' => $openId, 'lon' => $lon, 'lat' => $lat]);
            if ($res) {
                $data['code'] = 1;
                $data['msg'] = "成功";

            } else {
                $data['code'] = 0;
                $data['msg'] = "失败";

            }

        }

        return json_encode($data);

    }
    /**
     * 获取最近一次位置
     */
    public function getPostion($openId)
    {
        $res = db('pspos')->where('openId', $openId)->find();
        if ($res) {
            $data['code'] = 1;
            $data['msg'] = "成功";
            $data['data'] = $res;

        } else {
            $data['code'] = 0;
            $data['msg'] = "失败";
        }
        return json_encode($data);
    }
}