package qiangdan.hemiao.com.qiangdan.activity;

import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.bigkoo.alertview.AlertView;
import com.bigkoo.alertview.OnItemClickListener;
import com.klr.tools.SharedPreference;

import org.xutils.x;

import java.util.HashMap;
import java.util.Map;

import qiangdan.hemiao.com.qiangdan.R;
import qiangdan.hemiao.com.qiangdan.base.App;
import qiangdan.hemiao.com.qiangdan.base.AppManager;
import qiangdan.hemiao.com.qiangdan.base.BaseActivity;
import qiangdan.hemiao.com.qiangdan.base.ShareApp;
import qiangdan.hemiao.com.qiangdan.bean.User;
import qiangdan.hemiao.com.qiangdan.https.HttpLoader;
import qiangdan.hemiao.com.qiangdan.service.LocationService;
import qiangdan.hemiao.com.qiangdan.utils.Tools;

public class CenterActivity extends BaseActivity implements HttpLoader.HttpListener {

    private LinearLayout myOrder;
    private LinearLayout myMoneyBag;
    private LinearLayout sc;//闪送员手册
    private LinearLayout cjwt;//常见问题
    private LinearLayout kfbz;//客服与帮助
    private LinearLayout sjhxg;//修改手机号


    private TextView title;
    private ImageView back;

    private ImageView head;
    private TextView name;
    private TextView phone;
    private ImageView center;//个人中心
    private LocationService locationService;//定位服务

    private LinearLayout push;
    @Override
    public void initWidget() {
        setContentView(R.layout.activity_center);
        myOrder = findViewById(R.id.myOrder);
        myOrder.setOnClickListener(this);
        myMoneyBag = findViewById(R.id.myMoneyBag);
        myMoneyBag.setOnClickListener(this);
        title = findViewById(R.id.title);
        title.setText("个人中心");
        back = findViewById(R.id.back);
        back.setOnClickListener(this);

        head = findViewById(R.id.head);
        name = findViewById(R.id.name);
        phone = findViewById(R.id.phone);
        center = findViewById(R.id.center);
        center.setVisibility(View.GONE);

        sc = findViewById(R.id.sc);
        sc.setOnClickListener(this);

        cjwt = findViewById(R.id.cjwt);
        cjwt.setOnClickListener(this);

        kfbz = findViewById(R.id.kfbz);
        kfbz.setOnClickListener(this);

        sjhxg = findViewById(R.id.sjhxg);
        sjhxg.setOnClickListener(this);

        push= findViewById(R.id.push);
        push.setOnClickListener(this);
    }

    @Override
    public void widgetClick(View v) {
        switch (v.getId()) {
            case R.id.push:
                new AlertView("是否退出登录", null, null, new String[]{"取消", "确定"}, null, CenterActivity.this,
                        AlertView.Style.Alert, new OnItemClickListener() {
                    @Override
                    public void onItemClick(Object o, int position) {
                        Log.e("=====", position + "");
                        if (position == 1) {
                            locationService = ((App) getApplication()).locationService;
                            //注册监听
                            locationService.setLocationOption(locationService.getDefaultLocationClientOption());
                            locationService.stop();// 定位SDK


                            SharedPreference.clear(getApplicationContext());
                            AppManager.getAppManager().finishAllActivity();
                            Tools.single(getApplicationContext(), LoginActivity.class);
                            // Tools.single(getActivity(), MainActivity.class);
                        }
                    }
                }).show();
                break;
            case R.id.back:
                finish();
                break;
            case R.id.myOrder:
                Tools.single(mContext, MyOrderActivity.class);
                break;
            case R.id.myMoneyBag:
                Tools.single(mContext, MyMoneyBagActivity.class);
                break;
            case R.id.sc:
                Tools.single(mContext, ShouCeActivity.class);
                break;
            case R.id.cjwt:
                Tools.single(mContext, WenTiActivity.class);
                break;
            case R.id.kfbz:
                Tools.single(mContext, KeFuBangZhuActivity.class);
                break;
            case R.id.sjhxg:
                Tools.single(mContext, ChangePhone1Activity.class);
                break;


        }
    }

    @Override
    public void showProgress() {

    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getUserInfoByOpenId();
    }

    @Override
    public void onGetResponseSuccess(String requestCode, String response) {
        switch (requestCode) {
            case ShareApp.getUserInfoByOpenId:
                User mUser = Tools.parseJsonWithGson(response, User.class);
                name.setText(mUser.getData().getRealname());
                phone.setText(mUser.getData().getPhone());
                x.image().bind(head,
                        mUser.getData().getWeimage(),
                        imageOptions);


                break;
        }
    }

    @Override
    public void onGetResponseError(String requestCode, Exception error) {

    }

    /**
     * 获取用户信息
     */

    private void getUserInfoByOpenId() {
        Map hashmap = new HashMap();
        hashmap.put("openId", SharedPreference.get(mContext, "openId", ""));
        App.KLR.getData(mOkHttpClient, ShareApp.getUserInfoByOpenId, this, hashmap);

    }
}
