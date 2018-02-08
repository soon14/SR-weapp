<?php

namespace app\admin\controller;

/**
 * Class Fee
 * @package app\admin\controller
 * 基础信息管理
 */
class Fee extends Base
{
    public function lst()
    {
        $res = db('jcfee')->select();
        $this->assign(['lst' => $res]);
        return view('lst');
    }


    public function edit($id)
    {
        if (request()->post()) {
            $res = db('jcfee')->update(input('post.'));
            if ($res) {
                $this->success('基础信息更新成功', 'lst');
            } else {
                $this->error('基础信息更新失败');
            }
        }
        $data = db('jcfee')->where('id', $id)->find();

        $this->assign('data', $data);
        return view('edit');
    }
}
