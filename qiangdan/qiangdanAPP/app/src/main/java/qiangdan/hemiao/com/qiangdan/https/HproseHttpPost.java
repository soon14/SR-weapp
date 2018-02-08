package qiangdan.hemiao.com.qiangdan.https;

import android.os.Handler;
import android.os.Message;
import android.util.Log;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Map;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.FormBody;
import okhttp3.MediaType;
import okhttp3.MultipartBody;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
 import qiangdan.hemiao.com.qiangdan.base.ShareApp;


public class HproseHttpPost extends Thread {
    private Handler handle = null;
    private String mUri;
    private Map<String, Object> hashmap;
    private OkHttpClient mOkHttpClient;
    private Request requests;

    // 构造函数
    public HproseHttpPost(String uri, Map<String, Object> params, OkHttpClient mOkHttpClients) {
        mUri = uri;
        hashmap = params;
        mOkHttpClient = mOkHttpClients;
    }

    /**
     * 启动线程
     */
    public void execute(final ResponseListener responseListener)

    {
        handle = new Handler() {
            @Override
            public void handleMessage(Message msg) {
                super.handleMessage(msg);
                if (msg.what == -1) {//发生异常
                    responseListener.onExceptionError((Exception) msg.obj);

                } else if (msg.what == 1) {//返回正常
                    //解析出正常的对象
                    String tmp = (String) msg.obj;

                    responseListener.onSuccess(tmp);
                }
            }
        };
        start();

    }


    /**
     * 线程运行
     */
    @Override
    public void run() {
        super.run();

        if (hashmap != null) {
            if (hashmap.containsKey("files") || hashmap.containsKey("file")) {         //如果条件为真
                List<File> listFile;
                //    if (hashmap.containsKey("files")) {
                listFile = (List<File>) hashmap.get("files");

//                } else {
//                    listFile = (List<File>) hashmap.get("file");
//
//                }


                MultipartBody.Builder builder = new MultipartBody.Builder().setType(MultipartBody.FORM);
                for (int i = 0; i < listFile.size(); i++) {
                    if (listFile.get(i) != null) {
                        // if (hashmap.containsKey("files")) {
                        builder.addFormDataPart("files", listFile.get(i).getName(), RequestBody.create(MediaType.parse("image/png"), listFile.get(i)));
//
                        //        } else {
                        //       builder.addFormDataPart("file", listFile.get(i).getName(), RequestBody.create(MediaType.parse("image/png"), listFile.get(i)));

                        //   }
                    }
                }
                MultipartBody requestBody = builder.build();
                //构建请求
                Request request = new Request.Builder()
                        .url(ShareApp.Server + mUri)//地址
                        .post(requestBody)//添加请求体
                        .build();
                requests = request;
            } else {
                FormBody.Builder build = new FormBody.Builder();
                //增强for循环遍历
                for (Map.Entry<String, Object> entry : hashmap.entrySet()) {
                    build.add(entry.getKey(), (String) entry.getValue());
                    Log.e("=====Map====", entry.getKey() + "/" + entry.getValue() + "");
                }

                FormBody formBody = build.build();
                Request request = new Request.Builder()
                        .url(ShareApp.Server + mUri)
                        .post(formBody)
                        .build();
                requests = request;
            }
        } else if (hashmap == null) {
            FormBody.Builder build = new FormBody.Builder();

            FormBody formBody = build.build();
            Request request = new Request.Builder()
                    .url(ShareApp.Server + mUri)
                    .post(formBody)
                    .build();
            requests = request;

        }


        Call call = mOkHttpClient.newCall(requests);

        call.enqueue(new

                             Callback() {
                                 @Override
                                 public void onFailure(Call call, IOException e) {
                                     Log.e("==错误==", call.toString());
                                     Log.e("==错误==", e.toString());

                                     Message message = handle.obtainMessage(-1);
                                     message.obj = e;
                                     handle.sendMessage(message);
                                     e.printStackTrace();
                                 }

                                 @Override
                                 public void onResponse(Call call, Response response) throws IOException {
                                     String result = response.body().string();
                                     Log.e("==" + mUri + "正确==", result);
                                     Message message = handle.obtainMessage(1);
                                     message.obj = result;
                                     handle.sendMessage(message);
                                 }
                             });

    }

}

