package qiangdan.hemiao.com.qiangdan.https;


import java.util.Map;

import okhttp3.OkHttpClient;

public class HproseHttpBuilder {
    protected String mUrl = null;
    protected Map<String, Object> mParams = null;
    OkHttpClient mOkHttpClients = null;

    public HproseHttpBuilder url(String url, OkHttpClient mOkHttpClients) {
        this.mOkHttpClients = mOkHttpClients;
        this.mUrl = url;
        return this;
    }

    public HproseHttpBuilder params(Map<String, Object> params) {
        this.mParams = params;
        return this;
    }


    public HproseHttpPost build() {
        return new HproseHttpPost(mUrl, mParams, mOkHttpClients);
    }


}
