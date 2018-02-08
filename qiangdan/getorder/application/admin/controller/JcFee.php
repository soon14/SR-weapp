<?php

namespace app\admin\controller;

/**
 * 基础费
 * Class JcFee
 * @package app\admin\controller
 */
class JcFee extends Base
{
    public function lst()
    {
        $res = db('jc_fee')->select();
        $this->assign(['lst' => $res]);
        return view('lst');
    }


    public function edit($id)
    {
        if (request()->post()) {

            $datas = input('post.');
            $res = db('jc_fee')->where('id', $id)->update([  'yijia' => $datas['yijia']]);

            if ($res) {
                $this->success('基础信息更新成功', 'lst');
            } else {
                $this->error('基础信息更新失败');
            }
        }
        $data = db('jc_fee')->where('id', $id)->find();

        $this->assign('data', $data);
        return view('edit');
    }

    public function kqyj($id)
    {
        $data = db('jc_fee')->where('id', $id)->update(['status' => 1]);

        if ($data) {
            $this->success('开启溢价成功', 'lst');
        } else {
            $this->error('开启溢价失败');
        }
    }

    public function gbyj($id)
    {

        $res = db('jc_fee')->where('id', $id)->update(['status' => 0]);

        if ($res) {
            $this->success('关闭溢价成功', 'lst');
        } else {
            $this->error('关闭溢价失败');
        }

    }
}
