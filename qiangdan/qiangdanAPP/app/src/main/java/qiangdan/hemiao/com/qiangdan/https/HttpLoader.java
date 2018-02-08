package qiangdan.hemiao.com.qiangdan.https;

import android.content.Context;
import android.util.Log;

import java.util.Map;

import okhttp3.OkHttpClient;


/**
 * Created by buchangchi on 16/9/20.
 */
public class HttpLoader {
    private static HttpLoader sInstance;
    private Context mContext;

    private HttpLoader(Context context) {
        mContext = context.getApplicationContext();
    }

    /**
     * 返回HttpLoader 单例对象
     *
     * @param context
     * @return
     */
    public static synchronized HttpLoader getInstance(Context context) {
        if (sInstance == null) {
            sInstance = new HttpLoader(context);
        }
        return sInstance;
    }


    /**
     * 成功获取到服务器响应结果的监听，供UI层注册.
     */
    public interface HttpListener {
        /**
         * 当成功获取到服务器响应结果的时候调用
         *
         * @param requestCode response对应的requestCode
         * @param response    返回的response
         */
        void onGetResponseSuccess(String requestCode, String response);


        /**
         * 网络请求失败，做一些释放性的操作，比如关闭对话框
         *
         * @param requestCode 请求码
         * @param error       异常详情
         */
        void onGetResponseError(String requestCode, Exception error);
    }

    public void getData(OkHttpClient mOkHttpClient, final String method, final HttpListener listener, Map<String, Object> hashmap) {

        Log.e("=====method====", method + "");

        HproseHttpUtils.post().url(method, mOkHttpClient).params(hashmap).build().execute(new ResponseListener<String>() {
            @Override
            public void onSuccess(String data) {
                listener.onGetResponseSuccess(method, data);
            }

            @Override
            public void onExceptionError(Exception e) {
//          异常
                listener.onGetResponseError(method, e);

            }
        });


    }
}

