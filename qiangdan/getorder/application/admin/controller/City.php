<?php

namespace app\admin\controller;

/**
 * Class City
 * @package app\admin\controller
 * 城市管理
 */
class City extends Base
{
    public function lst()
    {
        $res = db('city')->select();
        $this->assign('list', $res);
        return view('lst');
    }

    public function del($id)
    {
        $res = db('city')->delete($id);
        if ($res) {
            $this->success('删除成功', 'lst');
        } else {
            $this->error('删除失败，请稍后再试！');
        }
    }

    public function add()
    {
        if (request()->isPost()) {
            $res = input('post.');

            $datas = explode(",", $res['pos']);
            $data['city'] = $res['city'];
            $data['lon'] = $datas[0];
            $data['lat'] = $datas[1];
            $resa = db('city')->insert($data);
            if ($resa) {
                $this->success('添加成功！','lst');
            } else {
                $this->error('添加失败！');
            }
        }

        return view('add');
    }
}
