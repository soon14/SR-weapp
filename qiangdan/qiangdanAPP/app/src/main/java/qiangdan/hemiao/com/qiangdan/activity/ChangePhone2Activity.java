package qiangdan.hemiao.com.qiangdan.activity;

import android.os.Bundle;
import android.text.TextUtils;
import android.view.View;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.TextView;

import com.klr.tools.SharedPreference;
import com.klr.tools.Toasts;

import java.util.HashMap;
import java.util.Map;

import qiangdan.hemiao.com.qiangdan.R;
import qiangdan.hemiao.com.qiangdan.base.App;
import qiangdan.hemiao.com.qiangdan.base.BaseActivity;
import qiangdan.hemiao.com.qiangdan.base.ShareApp;
import qiangdan.hemiao.com.qiangdan.bean.Code;
import qiangdan.hemiao.com.qiangdan.bean.Msg;
import qiangdan.hemiao.com.qiangdan.https.HttpLoader;
import qiangdan.hemiao.com.qiangdan.utils.Tools;

/**
 * 验证新手机号
 */
public class ChangePhone2Activity extends BaseActivity implements HttpLoader.HttpListener {

    private EditText phone;
    private EditText inputCode;
    private TextView getCode;
    private TextView commit;


    private TextView title;
    private ImageView back;
    private ImageView center;
    private Code mCode;

    @Override
    public void initWidget() {
        setContentView(R.layout.activity_change_phone2);
        phone = findViewById(R.id.phone);
        inputCode = findViewById(R.id.inputCode);
        getCode = findViewById(R.id.getCode);
        getCode.setOnClickListener(this);
        commit = findViewById(R.id.commit);
        commit.setOnClickListener(this);


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
            case R.id.commit:
                changePhone(phone.getText().toString());
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
            case ShareApp.sendNewCode:
                mCode = Tools.parseJsonWithGson(response, Code.class);

                if (mCode.getCode().equals("0")) {
                    mSVProgressHUD.showInfoWithStatus("发送失败，请稍后再试！");
                } else {
                    mSVProgressHUD.showInfoWithStatus("发送成功！");
                }
                break;
            case ShareApp.changePhone:
                Msg mMsg = Tools.parseJsonWithGson(response, Msg.class);

                if (mMsg.getCode().equals("1")) {
                    Toasts.show(mContext, "修改成功");
                    Tools.single(mContext, CenterActivity.class);
                    finish();
                } else {
                    mSVProgressHUD.showInfoWithStatus("修改失败，请稍后再试！");
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
        App.KLR.getData(mOkHttpClient, ShareApp.sendNewCode, this, hashmap);
    }

    /**
     * 修改电话
     */

    private void changePhone(String phone) {
        Map hashmap = new HashMap();
        hashmap.put("phone", phone);
        hashmap.put("openId", SharedPreference.get(mContext, "openId", ""));
        App.KLR.getData(mOkHttpClient, ShareApp.changePhone, this, hashmap);
    }
}
