<?php
// +----------------------------------------------------------------------
// | ThinkPHP [ WE CAN DO IT JUST THINK ]
// +----------------------------------------------------------------------
// | Copyright (c) 2006~2016 http://thinkphp.cn All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Author: liu21st <liu21st@gmail.com>
// +----------------------------------------------------------------------

return [
    // +----------------------------------------------------------------------
    // | 应用设置
    // +----------------------------------------------------------------------

    'template' => [
        // 模板后缀
        'view_suffix' => 'htm',
    ],

    // 视图输出字符串内容替换
    'view_replace_str' => [
        '__ADMIN__' => '/getorder/public/static/admin',
        '__IMAGE__' => '/getorder/public/',

    ],
    // 默认跳转页面对应的模板文件
    'dispatch_success_tmpl' => APP_PATH . 'admin/view/' . DS . 'dispatch_jump.tpl',
    'dispatch_error_tmpl' => APP_PATH . 'admin/view/' . DS . 'dispatch_jump.tpl',


    //异常页面模板文件
    'exception_tmpl' => APP_PATH . 'admin/view' . DS . 'think_exception.tpl',


];
