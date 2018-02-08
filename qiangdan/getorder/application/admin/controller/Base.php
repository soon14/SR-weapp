<?php

namespace app\admin\controller;

use think\Controller;

/**
 * 基础模块
 * Class Base
 * @package app\admin\controller
 */
class Base extends Controller
{
    protected function _initialize()
    {
        if (!session('id') || !session('username')) {
            $this->error('您尚未登录系统！', 'login/index');
        }
    }
}
