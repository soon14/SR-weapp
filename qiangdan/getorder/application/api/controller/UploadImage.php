<?php
/**
 * Created by PhpStorm.
 * User: bcc
 * Date: 2017/11/3
 * Time: 下午4:20
 */

namespace app\api\controller;


class UploadImage extends Base
{
    /**
     * 提交图片
     */
    public function upload($openId, $types)
    {
        // 获取表单上传文件 例如上传了001.jpg
        $file = request()->file('file');
//      return  $openId."===".$types ;
//      移动到框架应用根目录/public/uploads/ 目录下
        if ($file) {
            $info = $file->move(ROOT_PATH . 'public' . DS . 'image');
            if ($info) {
                // 成功上传后 获取上传信息
                // 输出 jpg
                 if ($types == 0) {
                    $data = ['cardpic_z' => 'image/'.$info->getSaveName()];
                } else {
                    $data = ['cardpic_f' => 'image/'.$info->getSaveName()];
                }
                $res = db('psuser')->where('openId', $openId)->update($data);
                if ($res) {
                    $data['code'] = 1;
                    $data['msg'] = "成功";

                } else {
                    $data['code'] = 0;
                    $data['msg'] = "上传失败！";
                }
                return json_encode($data);
            }
        }
        return true;

    }
}

