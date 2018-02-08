<?php

namespace app\admin\controller;


/**
 * Class Order配送人员管理
 * @package app\admin\controller
 */
class Psmember extends Base
{
    public function lst()
    {
        $res = db('psuser')->where('isauth', 1)->select();
        $this->assign(['lst' => $res]);
        return view('lst');
    }

    public function del($id)
    {
        $res = db('psuser')->where('id', $id)->update(['isauth'=>0]);
        if ($res) {
            $this->success('取消成功', 'lst');
        } else {
            $this->error('取消失败');

        }
    }
}
