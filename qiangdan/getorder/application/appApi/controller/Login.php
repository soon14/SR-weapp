<?php
/**
 * Created by PhpStorm.
 * User: bcc
 * Date: 2017/11/16
 * Time: 下午10:36
 */

namespace app\appApi\controller;


use app\api\utils\SuccessMessage;
use think\Controller;

class Login extends Controller
{

    public function  getcode(){
        //发送短信
        $res = db('psuser')->field('phone')->where('isauth', 1)->select();
        $phone = '';
        foreach ($res as $key => $v) {
            $phone = $phone . $v['phone'] . ',';
        }
        dump($phone);
        $tel = $phone . substr($phone, 0, strlen($phone) - 1);
        $datas = [
            'userid' => '530',
            'account' => 'jnjwhy',
            'password' => 'jnjwhy',
            'mobile' =>$tel,
            'content' => '【邻速达】您有新的抢单,赶快行动吧！',
            'sendTime' => '',
            'action' => 'send',
            'extno' => '',
        ];
        $res = send_post('http://green.58yhkj.com/sms.aspx', $datas);
        dump($res);

    }
    public function login($openid)
    {

        $res = db('psuser')->where('openId', $openid)->find();
        if (!$res) {
            $ress = db('psuser')->insert(['openId' => $openid]);

            if ($ress) {
                return json(new SuccessMessage());
            } else {
                return 'sss';
            }
        } else {
            $msgs = new SuccessMessage();
            $msgs->msg = '重复请求';
            return json($msgs);

        }


    }
}