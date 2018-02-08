<?php

namespace app\admin\controller;
/**
 * Class Admin
 * @package app\admin\controller管理模块
 */
 class Admin extends Base
{
    public function lst()
    {
        $res = db('user')->select();
        $this->assign('list', $res);
        return view('lst');
    }


}
