package qiangdan.hemiao.com.qiangdan.activity;

import android.os.Bundle;
import android.os.Handler;
import android.text.TextUtils;
import android.view.View;
import android.widget.EditText;
import android.widget.TextView;

import com.klr.tools.SharedPreference;

import java.util.HashMap;
import java.util.Map;
import java.util.Timer;
import java.util.TimerTask;

import qiangdan.hemiao.com.qiangdan.MainActivity;
import qiangdan.hemiao.com.qiangdan.R;
import qiangdan.hemiao.com.qiangdan.base.App;
import qiangdan.hemiao.com.qiangdan.base.BaseActivity;
import qiangdan.hemiao.com.qiangdan.base.ShareApp;
import qiangdan.hemiao.com.qiangdan.bean.Code;
import qiangdan.hemiao.com.qiangdan.bean.User;
import qiangdan.hemiao.com.qiangdan.https.HttpLoader;
import qiangdan.hemiao.com.qiangdan.utils.Tools;

public class LoginActivity extends BaseActivity implements HttpLoader.HttpListener {

    private TextView login;//登录
    private static TextView getCode;//获取验证码
    private EditText phone;//手机号
    private Code mCode;//验证码
    private EditText inputCode;//输入的验证码
    // 定时器
    private static Timer mTimer;

    public void timer() {
        mTimer = new Timer();
        mTimer.schedule(new TimerTask() {
            @Override
            public void run() {
                handler.sendEmptyMessage(1);
            }
        }, 0, 1000);
    }

    static int time = 30;
    private static Handler handler = new Handler() {
        public void handleMessage(android.os.Message msg) {
            if (msg.what == 1) {
                if (time > 1) {
                    time--;
                    getCode.setText(time + "秒");

                } else {
                    mTimer.cancel();
                    getCode.setText("发送验证码");
                    getCode.setEnabled(true);
                    // voiceLayout.setVisibility(View.VISIBLE);
                    time = 30;
                }
            }
        }
    };

    @Override
    public void initWidget() {
        setContentView(R.layout.activity_login);
        login = findViewById(R.id.login);
        login.setOnClickListener(this);
        getCode = findViewById(R.id.getCode);
        getCode.setOnClickListener(this);
        phone = findViewById(R.id.phone);
        inputCode = findViewById(R.id.inputCode);
    }

    @Override
    public void widgetClick(View v) {
        switch (v.getId()) {
            case R.id.login:
                if (TextUtils.isEmpty(inputCode.getText().toString())) {
                    mSVProgressHUD.showInfoWithStatus("请输入验证码！");
                    return;
                }
                if (!inputCode.getText().toString().equals(mCode.getData().toString())) {
                    mSVProgressHUD.showInfoWithStatus("输入的验证码不正确，请重新输入！");
                    return;
                }
                getOpenID(phone.getText().toString());

//                SharedPreference.put(mContext, "openId", "oZOD20DZCj7uTjp6r6wHLLGSVT6w");
//                Tools.single(mContext, MainActivity.class);
                break;
            case R.id.getCode:
                if (TextUtils.isEmpty(phone.getText().toString())) {
                    mSVProgressHUD.showInfoWithStatus("请输入手机号！");
                    return;
                }
                getCode(phone.getText().toString());
                break;
        }
    }

    @Override
    public void showProgress() {

    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (!SharedPreference.get(mContext, "openId", "").equals("")) {
            Tools.single(mContext, MainActivity.class);
            finish();
        }
    }


    @Override
    public void onGetResponseSuccess(String requestCode, String response) {
        switch (requestCode) {
            case ShareApp.sendCode:
                mCode = Tools.parseJsonWithGson(response, Code.class);
                if (mCode.getCode().equals("1")) {
                    getCode.setEnabled(false);
                    timer();
                } else {
                    mSVProgressHUD.showInfoWithStatus(mCode.getMsg());
                }

                break;
            case ShareApp.getOpenID:
                User mUser = Tools.parseJsonWithGson(response, User.class);
                if (mUser.getCode().equals("1")) {
                    SharedPreference.put(mContext, "openId", mUser.getData().getOpenId());


                    Tools.single(mContext, MainActivity.class);
                    finish();
                } else {
                    mSVProgressHUD.showInfoWithStatus("登录失败！");
                }

                break;
        }
    }

    @Override
    public void onGetResponseError(String requestCode, Exception error) {

    }

    /**
     * 获取验证码
     */

    private void getCode(String phone) {
        Map hashmap = new HashMap();
        hashmap.put("phone", phone);
        App.KLR.getData(mOkHttpClient, ShareApp.sendCode, this, hashmap);
    }

    /**
     * 根据手机号获取ipenid
     */

    private void getOpenID(String phone) {
        Map hashmap = new HashMap();
        hashmap.put("phone", phone);
        App.KLR.getData(mOkHttpClient, ShareApp.getOpenID, this, hashmap);
    }
}
