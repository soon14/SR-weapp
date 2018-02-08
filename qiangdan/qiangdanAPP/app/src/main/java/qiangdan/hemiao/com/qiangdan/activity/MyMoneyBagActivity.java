package qiangdan.hemiao.com.qiangdan.activity;

import android.app.Dialog;
import android.os.Bundle;
import android.view.Display;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.ListView;
import android.widget.TextView;

import com.klr.tools.SharedPreference;

import java.util.HashMap;
import java.util.Map;

import qiangdan.hemiao.com.qiangdan.R;
import qiangdan.hemiao.com.qiangdan.adapter.TiMoneyListAdapter;
import qiangdan.hemiao.com.qiangdan.base.App;
import qiangdan.hemiao.com.qiangdan.base.BaseActivity;
import qiangdan.hemiao.com.qiangdan.base.ShareApp;
import qiangdan.hemiao.com.qiangdan.bean.AllMoney;
import qiangdan.hemiao.com.qiangdan.bean.Msg;
import qiangdan.hemiao.com.qiangdan.bean.TiMoneyList;
import qiangdan.hemiao.com.qiangdan.https.HttpLoader;
import qiangdan.hemiao.com.qiangdan.utils.Tools;

/**
 * 我的钱包
 */
public class MyMoneyBagActivity extends BaseActivity implements HttpLoader.HttpListener {

    private TextView title;
    private ImageView back;
    private ImageView center;

    private TextView Alloney;//余额
    private TextView tixian;//提现
    private ListView list;
    Dialog dialogss;

    @Override
    public void initWidget() {
        setContentView(R.layout.activity_my_money_bag);
        title = findViewById(R.id.title);
        title.setText("我的钱包");
        back = findViewById(R.id.back);
        back.setOnClickListener(this);
        center = findViewById(R.id.center);
        center.setVisibility(View.INVISIBLE);
        Alloney = findViewById(R.id.Alloney);
        tixian = findViewById(R.id.tixian);
        tixian.setOnClickListener(this);
        list = findViewById(R.id.list);
    }

    @Override
    public void widgetClick(View v) {
        switch (v.getId()) {
            case R.id.back:
                finish();
                break;
            case R.id.tixian:
                alert();
                break;
        }
    }

    @Override
    public void showProgress() {

    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getAllMoney();
        getTiDetail();
    }

    @Override
    public void onGetResponseSuccess(String requestCode, String response) {
        switch (requestCode) {
            case ShareApp.getShopAllMoney:
                AllMoney mAllMoney = Tools.parseJsonWithGson(response, AllMoney.class);
                if (mAllMoney.getCode().equals("1")) {
                    Alloney.setText(mAllMoney.getData().getAllMoney());
                }
                break;
            case ShareApp.getTi:
                dialogss.dismiss();
                Msg mMsg = Tools.parseJsonWithGson(response, Msg.class);
                if (mMsg.getCode().equals("1")) {
                    getAllMoney();
                    getTiDetail();
                } else {
                    mSVProgressHUD.showInfoWithStatus("提现失败，请稍后再试！");
                }

                break;
            case ShareApp.getShopTiMoneyList:
                TiMoneyList mTiMoneyList = Tools.parseJsonWithGson(response, TiMoneyList.class);
                if (mTiMoneyList.getCode().equals("1")) {
                    TiMoneyListAdapter adapter = new TiMoneyListAdapter(mContext, mTiMoneyList.getData());
                    list.setAdapter(adapter);
                    adapter.notifyDataSetChanged();
                }

                break;
        }
    }

    @Override
    public void onGetResponseError(String requestCode, Exception error) {

    }

    /**
     * 获取总金额
     */
    private void getAllMoney() {
        Map hashmap = new HashMap();
        hashmap.put("openid", SharedPreference.get(mContext, "openId", ""));
        App.KLR.getData(mOkHttpClient, ShareApp.getShopAllMoney, this, hashmap);

    }

    /**
     * 提现
     */
    private void getTi(String price) {
        Map hashmap = new HashMap();
        hashmap.put("openid", SharedPreference.get(mContext, "openId", ""));
        hashmap.put("price", price);
        App.KLR.getData(mOkHttpClient, ShareApp.getTi, this, hashmap);

    }

    /**
     * 提现
     */
    private void getTiDetail() {
        Map hashmap = new HashMap();
        hashmap.put("openid", SharedPreference.get(mContext, "openId", ""));
        App.KLR.getData(mOkHttpClient, ShareApp.getShopTiMoneyList, this, hashmap);

    }

    /**
     * 提现弹出框
     */
    private void alert() {


        dialogss = new Dialog(MyMoneyBagActivity.this, R.style.Dialog);


        Window dialogWindow = dialogss.getWindow();
        WindowManager.LayoutParams lp = dialogWindow.getAttributes();
        dialogWindow.setGravity(Gravity.CENTER);

        WindowManager m = getWindowManager();
        Display d = m.getDefaultDisplay(); // 获取屏幕宽、高用
        WindowManager.LayoutParams p = dialogWindow.getAttributes(); // 获取对话框当前的参数值
        p.height = (int) (d.getHeight()); // 高度设置为屏幕的0.6
        p.width = (int) (d.getWidth() * 0.65); // 宽度设置为屏幕的0.65
        dialogWindow.setAttributes(p);

        View contentViews = LayoutInflater.from(MyMoneyBagActivity.this).inflate(R.layout.position_tixian, null);
        final EditText code = contentViews.findViewById(R.id.code);

        TextView commit = contentViews.findViewById(R.id.commit);
        TextView cancle = contentViews.findViewById(R.id.commit);
        dialogss.setContentView(contentViews);
        dialogss.setCanceledOnTouchOutside(false);
        dialogss.show();

        cancle.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                dialogss.dismiss();
            }
        });
        commit.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (Double.parseDouble(Alloney.getText().toString()) > Double.parseDouble(code.getText().toString())) {
                    getTi(code.getText().toString());
                } else {
                    dialogss.dismiss();
                    mSVProgressHUD.showInfoWithStatus("提现金额大于总金额！");
                }
            }
        });
    }
}
