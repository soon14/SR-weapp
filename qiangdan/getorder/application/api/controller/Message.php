<?php
/**
 * Created by PhpStorm.
 * User: bcc
 * Date: 2017/11/18
 * Time: 上午9:27
 */

namespace app\api\controller;


class Message
{
    /**
     * 获取token
     */
    public function getToken($formId,$keyword1,$keyword2,$keyword3,$keyword4,$keyword5)
    {
        $url = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' . config('wx.app_id') . '&secret=' . config('wx.app_secret');
        $result = curl_get($url);
        $token = json_decode($result)->access_token;
        $tokenURL = 'https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=' . $token;
        $data = [
            'touser' => 'oLS8E0evMrU5YBd6GgCxSvHkMafU',
            'template_id' => 'nsAElB_QYN17i3vqJF8qn-SUZRGjrMW2gi-BMlNKq7s',
            'form_id' => $formId,
            'data' => array(
                "keyword1" => array(
                    "value" => $keyword1,
                    "color" => "#9b9b9b"
                ),
                "keyword2" => array(
                    "value" => $keyword2,
                    "color" => "#9b9b9b"
                ),
                "keyword3" => array(
                    "value" => $keyword3,
                    "color" => "#9b9b9b"
                ),
                "keyword4" => array(
                    "value" => $keyword4,
                    "color" => "#9b9b9b"
                ),
                "keyword5" => array(
                    "value" => $keyword5,
                    "color" => "#9b9b9b"
                ),
            )
        ];
        $res = curl_post($tokenURL, $data);

        $datas = [
            'touser' => 'oLS8E0evMrU5YBd6GgCxSvHkMafU',
            'template_id' => 'nsAElB_QYN17i3vqJF8qn-SUZRGjrMW2gi-BMlNKq7s',
            'form_id' => $formId,
            'data' => array(
                "keyword1" => array(
                    "value" => $keyword1,
                    "color" => "#9b9b9b"
                ),
                "keyword2" => array(
                    "value" => $keyword2,
                    "color" => "#9b9b9b"
                ),
                "keyword3" => array(
                    "value" => $keyword3,
                    "color" => "#9b9b9b"
                ),
                "keyword4" => array(
                    "value" => $keyword4,
                    "color" => "#9b9b9b"
                ),
                "keyword5" => array(
                    "value" => $keyword5,
                    "color" => "#9b9b9b"
                ),
            )
        ];
        $res = curl_post($tokenURL, $datas);
        return $res;
    }


    public function sendCode($phone)
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

}