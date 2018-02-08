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

class Message extends Controller
{

    public function sendCode($phone)
    {
        $res = db('psuser')->where('phone', $phone)->find();

        if (!$res) {
            $data['code'] = 0;
            $data['msg'] = "无此配送员";
            return json_encode($data);
        }

        $num = rand(100000, 999999);
        $datas = [
            'userid' => '530',
            'account' => 'jnjwhy',
            'password' => 'jnjwhy',
            'mobile' => $phone,
            'content' => '【邻速达】验证码:' . $num,
            'sendTime' => '',
            'action' => 'send',
            'extno' => '',
        ];
        $res = send_post('http://green.58yhkj.com/sms.aspx', $datas);
        Log::error($res);
        if ($res) {
            $data['code'] = 1;
            $data['msg'] = "获取成功";
            $data['data'] = $num;
        } else {
            $data['code'] = 0;
            $data['msg'] = "获取失败";
        }
         return json_encode($data);

    }

    public function sendNewCode($phone)
    {

        $num = rand(100000, 999999);
        $datas = [
            'userid' => '530',
            'account' => 'jnjwhy',
            'password' => 'jnjwhy',
            'mobile' => $phone,
            'content' => '【邻速达】验证码:' . $num,
            'sendTime' => '',
            'action' => 'send',
            'extno' => '',
        ];
        $res = send_post('http://green.58yhkj.com/sms.aspx', $datas);
        Log::error($res);
        if ($res) {
            $data['code'] = 1;
            $data['msg'] = "获取成功";
            $data['data'] = $num;
        } else {
            $data['code'] = 0;
            $data['msg'] = "获取失败";
        }
        Log::error($data);
        return json_encode($data);

    }
}