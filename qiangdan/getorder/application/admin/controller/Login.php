<?php

namespace app\admin\controller;

use think\Controller;
use think\Log;

class Login extends Controller
{
    public function index()
    {

        if (request()->isPost()) {

            $res = db('user')->where("username", input('post.')['username'])->where('password', md5(input('post.')['password']))->find();

            if ($res) {
                session('id', $res['id']);
                session('username', $res['username']);
                $this->success('登录成功！', 'admin/lst');
            } else {
                $this->error('登录失败');
            }
            return;
        }

        return $this->fetch('login');
    }


}
