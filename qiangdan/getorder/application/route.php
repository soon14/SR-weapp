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
use think\Route;

Route::post('api/login/login', 'api/Login/login');
Route::post('api/User/getUserInfo', 'api/User/getUserInfo');
Route::get('api/User/getOpenid', 'api/User/getOpenid');
Route::post('api/User/judgeDC', 'api/User/judgeDC');
Route::post('api/User/applyDC', 'api/User/applyDC');
Route::post('api/User/updataUser', 'api/User/updataUser');
Route::post('api/user/getPostion', 'appApi/User/getPostion');//获取最近一次位置


Route::get('api/Order/getBaseInfo', 'api/Order/getBaseInfo');
Route::post('api/Order/inputOrder', 'api/Order/inputOrder');
Route::post('api/Order/getMyOrder', 'api/Order/getMyOrder');
Route::post('api/Order/getOrderDetailById', 'api/Order/getOrderDetailById');
Route::post('api/Order/getQiangOrderList', 'api/Order/getQiangOrderList');
Route::post('api/Order/getQiangOrder', 'api/Order/getQiangOrder');
Route::post('api/Order/getQiangOrderByOpenId', 'api/Order/getQiangOrderByOpenId');
Route::post('api/Order/peiSong', 'api/Order/peiSong');
Route::post('api/Order/getBaseStatusFee', 'api/Order/getBaseStatusFee');
Route::post('api/Order/getQRSH', 'api/Order/getQRSH');
Route::post('api/Order/getQRSD', 'api/Order/getQRSD');


Route::post('api/UploadImage/upload', 'api/UploadImage/upload');


Route::post('api/Pay/getPreOrder', 'api/Pay/getPreOrder');
Route::post('api/Pay/Notify', 'api/Pay/redirectNotify');

Route::post('api/message/sendCode', 'api/Message/sendCode');




Route::post('api/Money/getUserMoneyDetail', 'api/Money/getUserMoneyDetail');
Route::post('api/Money/getShopAllMoney', 'api/Money/getShopAllMoney');
Route::post('api/Money/getShopTiMoneyList', 'api/Money/getShopTiMoneyList');

Route::get('api/Address/getdistance', 'api/Address/getdistance');

//==============================================================================================================================

Route::post('appApi/message/sendCode', 'appApi/Message/sendCode');//获取验证码
Route::post('appApi/message/sendNewCode', 'appApi/Message/sendNewCode');//修改获取验证码

Route::post('appApi/user/getOpenID', 'appApi/User/getOpenID');//根据手机号获取ipenid
Route::post('appApi/user/getUserInfoByOpenId', 'appApi/User/getUserInfoByOpenId');//根据penId获取用户信息
Route::post('appApi/user/changeYZ', 'appApi/User/changeYZ');//验证手机号
Route::post('appApi/user/updataPos', 'appApi/User/updataPos');//上传最后位置
Route::post('appApi/user/getPostion', 'appApi/User/getPostion');//获取最近一次位置


Route::post('appApi/order/getQiangOrderList', 'appApi/Order/getQiangOrderList');//根据获取抢单列表
Route::post('appApi/order/getQiangOrderByOpenId', 'appApi/Order/getQiangOrderByOpenId');//根据openid获取列表
Route::post('appApi/order/getOrderDetailById', 'appApi/Order/getOrderDetailById');//根据订单id获取详情
Route::post('appApi/order/getQRSH', 'appApi/Order/getQRSH');//确认送货
Route::post('appApi/order/getQRSD', 'appApi/Order/getQRSD');//确认送达
Route::post('appApi/order/getQiangOrder', 'appApi/Order/getQiangOrder');//抢单
Route::post('appApi/order/judgeCode', 'appApi/Order/judgeCode');//判断确认吗是否正确


Route::post('appApi/money/getShopAllMoney', 'appApi/Money/getShopAllMoney');//获取总金额
Route::post('appApi/money/getTi', 'appApi/Money/getTi');//提现
Route::post('appApi/money/getShopTiMoneyList', 'appApi/Money/getShopTiMoneyList');//获取提现流水

