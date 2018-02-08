package qiangdan.hemiao.com.qiangdan.activity;

import android.app.AlertDialog;
import android.app.Dialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.os.TestLooperManager;
import android.util.Log;
import android.view.Display;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ListView;
import android.widget.TextView;

import com.baidu.mapapi.model.LatLng;
import com.baidu.mapapi.navi.BaiduMapAppNotSupportNaviException;
import com.baidu.mapapi.navi.BaiduMapNavigation;
import com.baidu.mapapi.navi.NaviParaOption;
import com.baidu.mapapi.utils.OpenClientUtil;
import com.klr.tools.SharedPreference;

import java.text.SimpleDateFormat;
import java.util.HashMap;
import java.util.Map;

import qiangdan.hemiao.com.qiangdan.R;
import qiangdan.hemiao.com.qiangdan.base.App;
import qiangdan.hemiao.com.qiangdan.base.BaseActivity;
 import qiangdan.hemiao.com.qiangdan.base.ShareApp;
import qiangdan.hemiao.com.qiangdan.bean.Code;
import qiangdan.hemiao.com.qiangdan.bean.Msg;
import qiangdan.hemiao.com.qiangdan.bean.OrderDetail;
import qiangdan.hemiao.com.qiangdan.bean.Postion;
import qiangdan.hemiao.com.qiangdan.https.HttpLoader;
import qiangdan.hemiao.com.qiangdan.utils.Tools;

public class GetOrderDetailActivity extends BaseActivity implements HttpLoader.HttpListener {

    private String orderId;
    private ImageView center;//个人中心
    private ImageView back;

    private TextView orderNum;//订单号
    private TextView status;//状态
    private TextView ji_address;//寄地址
    private TextView shou_address;//收地址
    private TextView goodsName;//物品名称
    private TextView remark;//备注
    private TextView money;//钱数
    private TextView base;//基础
    private TextView time;//时间
    private TextView title;
    private TextView querenSH;//确认收货
    private TextView qrsd;//确认送达
    private String ji_lon;//寄件人经纬度
    private String ji_lat;//寄件人经纬度
    private String shou_lon;//收件人经纬度
    private String shou_lat;//收件人经纬度

    private TextView ji_name;//寄件人姓名
    private TextView ji_tel;//寄件人电话
    private TextView shou_name;//收件人姓名
    private TextView shou_tel;//收件人电话


    Dialog dialogss;

    private int type = 0;//0为寄件地址   1为收件地址

    @Override
    public void initWidget() {
        setContentView(R.layout.activity_get_order_detail);
        orderId = getIntent().getStringExtra("orderId");
        title = findViewById(R.id.title);
        title.setText("订单详情");
        center = findViewById(R.id.center);
        center.setVisibility(View.GONE);
        back = findViewById(R.id.back);
        back.setOnClickListener(this);

        orderNum = findViewById(R.id.orderNum);//订单号
        status = findViewById(R.id.status);//状态
        ji_address = findViewById(R.id.ji_address);//寄地址
        ji_address.setOnClickListener(this);
        shou_address = findViewById(R.id.shou_address);//收地址
        shou_address.setOnClickListener(this);

        goodsName = findViewById(R.id.goodsName);//物品名称
        remark = findViewById(R.id.remark);//备注
        money = findViewById(R.id.money);//钱数
        base = findViewById(R.id.base);//基础
        time = findViewById(R.id.time);//时间

        querenSH = findViewById(R.id.querenSH);
        querenSH.setOnClickListener(this);

        qrsd = findViewById(R.id.qrsd);
        qrsd.setOnClickListener(this);


        ji_name = findViewById(R.id.ji_name);//寄件人姓名
        ji_tel = findViewById(R.id.ji_tel);//寄件人电话
        shou_name = findViewById(R.id.shou_name);//收件人姓名
        shou_tel = findViewById(R.id.shou_tel);//收件人电话
        ji_tel.setOnClickListener(this);
        shou_tel.setOnClickListener(this);

    }

    @Override
    public void widgetClick(View v) {
        switch (v.getId()) {
            case R.id.ji_tel:
                call(ji_tel.getText().toString());
                break;
            case R.id.shou_tel:
                call(shou_tel.getText().toString());
                break;
            case R.id.ji_address:
                Log.e("111111111", "111111111");
                double ji_lons = Double.parseDouble(ji_lon);
                double ji_lats = Double.parseDouble(ji_lat);

//                double shou_lons = Double.parseDouble(shou_lon);
//                double shou_lats = Double.parseDouble(shou_lat);
//
//                LatLng pt1 = new LatLng(ji_lons, ji_lats);
//                LatLng pt2 = new LatLng(shou_lons, shou_lats);
//                // 构建 导航参数
//                NaviParaOption para = new NaviParaOption()
//                        .startPoint(pt1).endPoint(pt2);
//
//                BaiduMapNavigation.openWebBaiduMapNavi(para, this);

                startNavi(ji_lons, ji_lats);
                break;
            case R.id.shou_address:
                double shou_lons = Double.parseDouble(shou_lon);
                double shou_lats = Double.parseDouble(shou_lat);
                startNavi(shou_lons, shou_lats);

                break;
            case R.id.back:
                finish();
                break;
            case R.id.querenSH:

                //
                getPostion();
                type = 0;

                break;
            case R.id.qrsd:
                //alert("确认送达", "2", orderId);
                getPostion();
                type = 1;
                break;

        }
    }

    @Override
    public void showProgress() {

    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getData(orderId);
    }

    @Override
    public void onGetResponseSuccess(String requestCode, String response) {
        switch (requestCode) {
            case ShareApp.getOrderDetailById:
                OrderDetail mOrderDetail = Tools.parseJsonWithGson(response, OrderDetail.class);
                orderNum.setText(mOrderDetail.getData().getOrderid());
                status.setText(mOrderDetail.getData().getOrder_status());
                ji_address.setText(mOrderDetail.getData().getJi_address());
                shou_address.setText(mOrderDetail.getData().getShou_address());
                goodsName.setText(mOrderDetail.getData().getGoodsname());
                remark.setText(mOrderDetail.getData().getRemark());
                money.setText(mOrderDetail.getData().getPayprice());
                ji_lon = mOrderDetail.getData().getJi_lon();
                ji_lat = mOrderDetail.getData().getJi_lat();

                shou_lon = mOrderDetail.getData().getShou_lon();
                shou_lat = mOrderDetail.getData().getShou_lat();

                ji_name.setText(mOrderDetail.getData().getJi_name());
                ji_tel.setText(mOrderDetail.getData().getJi_tel());
                shou_name.setText(mOrderDetail.getData().getShou_name());
                shou_tel.setText(mOrderDetail.getData().getShou_tel());

                String bases = mOrderDetail.getData().getGl() + "公里 | " + mOrderDetail.getData().getZl() + "公斤";
                base.setText(bases);


                SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                Long times = new Long(mOrderDetail.getData().getTime());
                String d = format.format(times * 1000);
                time.setText(d);

                if (mOrderDetail.getData().getOrder_status().equals("1")) {
                    status.setText("未支付");
                    querenSH.setVisibility(View.GONE);
                    qrsd.setVisibility(View.GONE);
                } else if (mOrderDetail.getData().getOrder_status().equals("2")) {
                    status.setText("已支付");
                    querenSH.setVisibility(View.VISIBLE);
                    qrsd.setVisibility(View.GONE);
                } else if (mOrderDetail.getData().getOrder_status().equals("3")) {
                    status.setText("送货中");
                    querenSH.setVisibility(View.GONE);
                    qrsd.setVisibility(View.VISIBLE);
                } else if (mOrderDetail.getData().getOrder_status().equals("4")) {
                    status.setText("已到达");
                    querenSH.setVisibility(View.GONE);
                    qrsd.setVisibility(View.GONE);
                }
                break;

            case ShareApp.getQRSH:
                Msg mMsg = Tools.parseJsonWithGson(response, Msg.class);
                if (mMsg.getCode().equals("1")) {
                    status.setText("送货中");

                    querenSH.setVisibility(View.GONE);
                    qrsd.setVisibility(View.VISIBLE);
                    mSVProgressHUD.showInfoWithStatus("操作成功");
                } else {
                    querenSH.setVisibility(View.VISIBLE);
                    qrsd.setVisibility(View.GONE);
                    mSVProgressHUD.showInfoWithStatus("操作失败");

                }
                break;
            case ShareApp.getQRSD:
                Msg mMsgs = Tools.parseJsonWithGson(response, Msg.class);
                if (mMsgs.getCode().equals("1")) {
                    status.setText("已到达");

                    querenSH.setVisibility(View.GONE);
                    qrsd.setVisibility(View.GONE);
                    mSVProgressHUD.showInfoWithStatus("操作成功");
                } else {
                    querenSH.setVisibility(View.GONE);
                    qrsd.setVisibility(View.VISIBLE);
                    mSVProgressHUD.showInfoWithStatus("操作失败");

                }
                break;
            case ShareApp.judgeCode:
                dialogss.dismiss();

                Code mCode = Tools.parseJsonWithGson(response, Code.class);
                if (mCode.getCode().equals("1")) {
                    if (mCode.getData().equals("1")) {

                        getquerensh(orderId);
                    } else {
                        getquerensd(orderId);
                    }

                } else {
                    mSVProgressHUD.showInfoWithStatus("确认码不正确，请重新输入！");
                }
                break;

            case ShareApp.getPostion:
                Postion mPostion = Tools.parseJsonWithGson(response, Postion.class);
                double longt1 = Double.parseDouble(mPostion.getData().getLon());
                double lat1 = Double.parseDouble(mPostion.getData().getLat());
                if (type == 0) {

                    double longt2 = Double.parseDouble(ji_lon);
                    double lat2 = Double.parseDouble(ji_lat);
                    double s = getDistance(longt1, lat1, longt2, lat2);
                    Log.e("====longt111===", longt1 + "");
                    Log.e("====longt222===", lat1 + "");
                    Log.e("====longt333===", longt2 + "");
                    Log.e("====longt444===", lat2 + "");

                    Log.e("====longt2===", s + "");
                    if (s > 500) {
                        mSVProgressHUD.showInfoWithStatus("寄件位置500m内才能输入寄件码确认");
                    } else {
                        alert("确认送货", "1", orderId);
                    }
                } else {

                    double longt2 = Double.parseDouble(shou_lon);
                    double lat2 = Double.parseDouble(shou_lat);
                    double s = getDistance(longt1, lat1, longt2, lat2);

//                    if (s > 1000) {
//                        mSVProgressHUD.showInfoWithStatus("寄件位置500m内才能输入收件码确认");
//                    } else {
                    alert("确认送达", "2", orderId);
                    //      }
                }


                break;
        }
    }

    @Override
    public void onGetResponseError(String requestCode, Exception error) {

    }

    private void getData(String orderId) {
        Map hashmap = new HashMap();
        hashmap.put("orderId", orderId);
        App.KLR.getData(mOkHttpClient, ShareApp.getOrderDetailById, this, hashmap);
    }

    private void getPostion() {
        Map hashmap = new HashMap();
        hashmap.put("openId", SharedPreference.get(mContext, "openId", ""));
        App.KLR.getData(mOkHttpClient, ShareApp.getPostion, this, hashmap);
    }

    /**
     * 确认送货
     *
     * @param orderId
     */
    private void getquerensh(String orderId) {
        Map hashmap = new HashMap();
        hashmap.put("orderId", orderId);
        App.KLR.getData(mOkHttpClient, ShareApp.getQRSH, this, hashmap);
    }

    /**
     * 确认送达
     *
     * @param orderId
     */
    private void getquerensd(String orderId) {
        Map hashmap = new HashMap();
        hashmap.put("orderId", orderId);
        App.KLR.getData(mOkHttpClient, ShareApp.getQRSD, this, hashmap);
    }

    /**
     * 判断确认码
     *
     * @param orderId
     */
    private void judgeCode(String orderId, String code, String type) {
        Map hashmap = new HashMap();
        hashmap.put("orderId", orderId);
        hashmap.put("code", code);
        hashmap.put("type", type);

        App.KLR.getData(mOkHttpClient, ShareApp.judgeCode, this, hashmap);
    }


    private void alert(String buttomName, final String type, final String orderId) {

        dialogss = new Dialog(GetOrderDetailActivity.this, R.style.Dialog);


        Window dialogWindow = dialogss.getWindow();
        WindowManager.LayoutParams lp = dialogWindow.getAttributes();
        dialogWindow.setGravity(Gravity.CENTER);

        WindowManager m = getWindowManager();
        Display d = m.getDefaultDisplay(); // 获取屏幕宽、高用
        WindowManager.LayoutParams p = dialogWindow.getAttributes(); // 获取对话框当前的参数值
        p.height = (int) (d.getHeight()); // 高度设置为屏幕的0.6
        p.width = (int) (d.getWidth() * 0.65); // 宽度设置为屏幕的0.65
        dialogWindow.setAttributes(p);


        View contentViews = LayoutInflater.from(GetOrderDetailActivity.this).inflate(R.layout.position_item, null);
        final EditText code = (EditText) contentViews.findViewById(R.id.code);

        TextView commit = (TextView) contentViews.findViewById(R.id.commit);
        TextView cancle = (TextView) contentViews.findViewById(R.id.cancle);
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
                //if (type == 1) {
                //  getquerensh(orderId);

                judgeCode(orderId, code.getText().toString(), type);
                //  } else {
                // getquerensd(orderId);
                //  judgeCode(orderId, code.getText().toString(), String type);

                // }
            }
        });
    }

    public double getDistance(double longt1, double lat1, double longt2, double lat2) {

        double x, y, distance;

        x = (longt2 - longt1) * Math.PI * 6371.229 * Math.cos(((lat1 + lat2) / 2) * Math.PI / 180) /
                180;

        y = (lat2 - lat1) * Math.PI * 6371.229 / 180;

        distance = Math.hypot(x, y);

        return distance * 1000;

    }


    /**
     * 启动百度地图导航(Native)
     */
    public void startNavi(double mLon2, double mLat2) {
        LatLng pt1 = new LatLng(App.lat, App.lon);
        LatLng pt2 = new LatLng(mLat2, mLon2);

        // 构建 导航参数
        NaviParaOption para = new NaviParaOption()
                .startPoint(pt1).endPoint(pt2)
                .startName("天安门").endName("百度大厦");

        try {
            BaiduMapNavigation.openBaiduMapNavi(para, this);
        } catch (BaiduMapAppNotSupportNaviException e) {
            e.printStackTrace();
            showDialog();
        }

    }

    /**
     * 提示未安装百度地图app或app版本过低
     */
    public void showDialog() {
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setMessage("您尚未安装百度地图app或app版本过低，点击确认安装？");
        builder.setTitle("提示");
        builder.setPositiveButton("确认", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                dialog.dismiss();
                OpenClientUtil.getLatestBaiduMapApp(GetOrderDetailActivity.this);
            }
        });

        builder.setNegativeButton("取消", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                dialog.dismiss();
            }
        });

        builder.create().show();

    }

    private void call(String phone) {
        Intent intent = new Intent(Intent.ACTION_DIAL, Uri.parse("tel:" + phone));
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        startActivity(intent);
    }
}
