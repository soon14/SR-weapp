package qiangdan.hemiao.com.qiangdan.activity;

import android.os.Bundle;
import android.text.TextUtils;
import android.view.View;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.TextView;


import java.util.HashMap;
import java.util.Map;

import qiangdan.hemiao.com.qiangdan.R;
import qiangdan.hemiao.com.qiangdan.base.App;
import qiangdan.hemiao.com.qiangdan.base.BaseActivity;
import qiangdan.hemiao.com.qiangdan.base.ShareApp;
import qiangdan.hemiao.com.qiangdan.bean.Code;
import qiangdan.hemiao.com.qiangdan.https.HttpLoader;
import qiangdan.hemiao.com.qiangdan.utils.Tools;

/**
 * 修改密码，先验证手机
 */
public class ChangePhone1Activity extends BaseActivity implements HttpLoader.HttpListener {

    private EditText phone;
    private EditText inputCode;
    private TextView getCode;
    private TextView next;//下一步

    private TextView title;
    private ImageView back;
    private ImageView center;
    private Code mCode;

    @Override
    public void initWidget() {
        setContentView(R.layout.activity_change_phone1);
        phone = findViewById(R.id.phone);
        inputCode = findViewById(R.id.inputCode);
        getCode = findViewById(R.id.getCode);
        getCode.setOnClickListener(this);

        next = findViewById(R.id.next);
        next.setOnClickListener(this);

        title = findViewById(R.id.title);
        title.setText("修改手机号");
        back = findViewById(R.id.back);
        back.setOnClickListener(this);
        center = findViewById(R.id.center);
        center.setVisibility(View.INVISIBLE);
    }

    @Override
    public void widgetClick(View v) {
        switch (v.getId()) {
            case R.id.back:
                finish();
                break;
            case R.id.getCode:
                if (TextUtils.isEmpty(phone.getText().toString())) {
                    mSVProgressHUD.showInfoWithStatus("请输入手机号！");
                    return;
                }
                getCode(phone.getText().toString());
                break;
            case R.id.next:
                if (mCode.getCode().equals("0")) {
                    mSVProgressHUD.showInfoWithStatus("验证码错误");
                } else if (mCode.getCode().equals("1")) {

                    if (mCode.getData().equals(inputCode.getText().toString())) {
                        Tools.single(mContext, ChangePhone2Activity.class);
                    } else {
                        mSVProgressHUD.showInfoWithStatus("验证码错误");

                    }

                }
                break;
        }
    }

    @Override
    public void showProgress() {

    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }


    @Override
    public void onGetResponseSuccess(String requestCode, String response) {
        switch (requestCode) {
            case ShareApp.sendCode:
                mCode = Tools.parseJsonWithGson(response, Code.class);

                if (mCode.getCode().equals("0")) {
                    mSVProgressHUD.showInfoWithStatus("手机号输入错误！");
                } else {
                    mSVProgressHUD.showInfoWithStatus("发送成功！");
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
}
