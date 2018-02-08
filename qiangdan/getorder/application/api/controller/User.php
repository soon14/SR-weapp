<?php
/**
 * Created by PhpStorm.
 * User: bcc
 * Date: 2017/11/3
 * Time: 下午4:20
 */

namespace app\api\controller;


class User extends Base
{
    /**
     * 获取用户数据
     */
    public function getUserInfo($openId, $wename, $weimage)
    {
        $checkId = db('psuser')->where('openId', $openId)->find();
        if (!$checkId) {
            $data = [
                'openId' => $openId,
                'wename' => $wename,
                'weimage' => $weimage,
                'isauth' => 0,
                'retime' => time(),
                'status' => 0,
                'tel_yz' => 0,

            ];
            $res = db('psuser')->insert($data);

            if ($res) {
                $data['code'] = 0;
                $data['msg'] = "成功";
                // ['code' => 0, 'msg' => "成功"];
            } else {
                $data['code'] = 0;
                $data['msg'] = "失败1";
                // $data = ['code' => 0, 'msg' => "失败"];
            }
        } else if ($checkId['status'] == 1) {
//            $data = ['code' => 3, 'msg' => "该用户已被禁用"];
            $data['code'] = 3;
            $data['msg'] = "该用户已被禁用";

        } else {
            $data['code'] = 0;
            $data['msg'] = "已存在";

            //  $data = ['code' => 0, 'msg' => "已存在"];
        }
        return json_encode($data);

    }

    /**
     * 获取openid
     * @param $code
     * @return string
     */
    public function getOpenid($code)
    {
        $url = 'https://api.weixin.qq.com/sns/jscode2session?grant_type=client_credential&js_code=' . $code . '&appid=' . config('wx.app_id') . '&secret=' . config('wx.app_secret');
        $result = curl_get($url);

        // return json_decode($result);
        return $result;

    }

    /**
     * 判断是否是配送员，是返回1 不是返回0
     * @param $openId
     * @return string
     */
    public function judgeDC($openId)
    {
        $res = db('psuser')->where('openId', $openId)->find();
        if ($res) {
            $data['code'] = 1;
            $data['msg'] = "成功";
            $data['data'] = $res['isauth'];
        } else {
            $data['code'] = 0;
            $data['msg'] = "暂无数据";
        }

        return json_encode($data);

    }

    /**
     * 申请配送员
     * @param $realname
     * @param $card
     * @param $tel
     * @param $openId
     * @return string
     */
    public function applyDC($realname, $card, $tel, $ji_tel, $openId, $cards, $bankName)
    {
        $data = ['realname' => $realname, 'cardnum' => $card, 'phone' => $tel, 'jj_tel' => $ji_tel, 'isauth' => '2','cards' => $cards, 'bankName' => $bankName];
        $res = db('psuser')->where('openId', $openId)->update($data);
        if ($res) {
            $data['code'] = 1;
            $data['msg'] = "成功";

        } else {
            $data['code'] = 0;
            $data['msg'] = "失败";

        }
        return json_encode($data);
    }

    /**
     * 判断是否验证过用户手机号
     */
    public function changeYZ($openId)
    {
        $res = db('psuser')->where('openId', $openId)->find();
        if ($res['tel_yz'] == 0) {
            $data['code'] = 1;
            $data['msg'] = "成功";

        } else {
            $data['code'] = 0;
            $data['msg'] = "失败";

        }
        return json_encode($data);

    }

    /**
     * 更新手机验证
     */
    public  function updataUser($openId){

        $res = db('psuser')->where('openId', $openId)->update(['tel_yz'=>1]);
        if ($res) {
            $data['code'] = 1;
            $data['msg'] = "成功";

        } else {
            $data['code'] = 0;
            $data['msg'] = "失败";
        }
        return json_encode($data);
    }
}

