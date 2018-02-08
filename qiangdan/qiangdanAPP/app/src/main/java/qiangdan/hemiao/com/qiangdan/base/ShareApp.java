package qiangdan.hemiao.com.qiangdan.base;

/**
 * author: klr
 * date: 2017/7/11
 */
public class ShareApp {

    /**
     * 公共URL
     */
    // public static final String Server = "http://192.168.1.103/getorder/public/appApi/";
 //public static final String Server = "http://xiaochengxu.hemiaoit.com/getorder/public/appApi/";
   public static final String Server = "https://xxf.ql178.com/getorder/public/appApi/";

    /**
     * 获取验证码
     */
    public static final String sendCode = "message/sendCode";
    /**
     * 获取验证码
     */
    public static final String sendNewCode = "message/sendNewCode";
    /**
     * 根据手机号获取OPenid
     */
    public static final String getOpenID = "user/getOpenID";

    /**
     * 获取抢单列表
     */
    public static final String getQiangOrderList = "order/getQiangOrderList";
    /**
     * 获取用户信息
     */
    public static final String getUserInfoByOpenId = "user/getUserInfoByOpenId";
    /**
     * 修改手机号
     */
    public static final String changePhone = "user/changePhone";

    /**
     * 修改手机号
     */
    public static final String getQiangOrderByOpenId = "order/getQiangOrderByOpenId";
    /**
     * 根据订单id获取订单详情
     */
    public static final String getOrderDetailById = "order/getOrderDetailById";

    /**
     * 抢单
     */
    public static final String getQiangOrder = "order/getQiangOrder";

    /**
     * 确认收货
     */
    public static final String getQRSH = "order/getQRSH";
    /**
     * 确认送达
     */
    public static final String getQRSD = "order/getQRSD";

    /**
     * 判断确认码是否正确
     */
    public static final String judgeCode = "order/judgeCode";

    /**
     * 获取总金额
     */
    public static final String getShopAllMoney = "money/getShopAllMoney";
    /**
     * 获取提现
     */
    public static final String getTi = "money/getTi";
    /**
     * 获取提现流水
     */
    public static final String getShopTiMoneyList = "money/getShopTiMoneyList";

    /**
     * 上传最后位置
     */
    public static final String updataPos = "user/updataPos";


    /**
     * 获取最后位置
     */
    public static final String getPostion = "user/getPostion";

}
