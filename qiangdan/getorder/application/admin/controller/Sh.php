<?php

namespace app\admin\controller;


/**
 * Class Order我的审核
 * @package app\admin\controller
 */
class Sh extends Base
{
    public function lst()
    {
        $res = db('psuser')->where('isauth', 2)->select();
        $this->assign(['lst' => $res]);
        return view('lst');
    }


    public function sh($id)
    {
        $res = db('psuser')->find($id);
        if ($res['isauth'] == 2) {
            $res['isauth'] = 1;
        }
        $updata = db('psuser')->update($res);
        if ($updata) {
            $data = [
                'openid' => $res['openId'],
                'allMoney' => 0,
            ];
            db('all_money')->insert($data);
            $this->success('审核成功', 'lst');
        } else {
            $this->error('审核失败');
        }
    }

    public function del($id)
    {
        $res = db('order')->delete($id);
        if ($res) {
            $this->success('订单删除成功', 'lst');
        } else {
            $this->error('订单删除失败');

        }
    }
}
