<?php

namespace app\admin\controller;



class User extends Base
{
    public function lst()
    {
        $res = db('psuser')->paginate(10);
        $this->assign('list', $res);
        return view('lst');
    }

    /**
     * 禁用用户
     * @param $id
     */
    public function edit($id)
    {
        $res = db('psuser')->where('id', $id)->find();
        $res['status'] = 1;
        $resUpdata = db('psuser')->update($res);
        if ($resUpdata) {
            $this->success('操作成功', 'lst');
        } else {
            $this->error('操作失败');
        }
    }

    /**
     * 恢复用户
     * @param $id
     */
    public function huifu($id)
    {
        $res = db('psuser')->where('id', $id)->find();
        $res['status'] = 0;
        $resUpdata = db('psuser')->update($res);
        if ($resUpdata) {
            $this->success('操作成功', 'lst');
        } else {
            $this->error('操作失败');
        }
    }
}
