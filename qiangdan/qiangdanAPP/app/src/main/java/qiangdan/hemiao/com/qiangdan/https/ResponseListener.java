package qiangdan.hemiao.com.qiangdan.https;


/**
 * 类描述：接口回调函数
 * 创建时间：16/8/10 下午12:59
 * 修改时间：16/8/10 下午12:59
 * 修改备注：
 */
public interface ResponseListener<String> {
    void onSuccess(String data);

    void onExceptionError(Exception e);

}
