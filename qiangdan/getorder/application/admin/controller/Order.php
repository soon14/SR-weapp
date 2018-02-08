<?php

namespace app\admin\controller;

/**
 * Class Order
 * @package app\admin\controller
 * 订单管理
 */
class Order extends Base
{
    public function lst()
    {
        $res = db('order')->paginate(10);
        $orderstatus = db('orderstatus')->select();
        $this->assign(['lst' => $res, 'status' => $orderstatus]);
        return view('lst');
    }

    public function detail($id)
    {
        $res = db('order')->where('id', $id)->find();
        $orderstatus = db('orderstatus')->select();

     //   dump($res);
//         die;
        if ($res) {
            $this->assign(['orderDetail' => $res, 'status' => $orderstatus]);

        } else {
            $this->error('订单详情获取失败！');
        }
        return view('detail');

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
