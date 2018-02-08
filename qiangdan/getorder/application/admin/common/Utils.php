<?php
/**
 * Created by PhpStorm.
 * User: bcc
 * Date: 2017/10/31
 * Time: 下午3:17
 */

namespace app\admin\common;
class Utils
{
    function uuid($prefix = '')
    {
        $chars = md5(uniqid(time(), true));
        $uuid = substr($chars, 0, 8) ;
        $uuid .= substr($chars, 8, 4) ;
        $uuid .= substr($chars, 12, 4) ;
        $uuid .= substr($chars, 16, 4);

        return $prefix . $uuid;
    }

}
