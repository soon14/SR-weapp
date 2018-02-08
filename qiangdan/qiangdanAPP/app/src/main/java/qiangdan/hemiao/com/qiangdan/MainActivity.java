package qiangdan.hemiao.com.qiangdan;


import android.app.Dialog;
import android.graphics.Color;
import android.os.Bundle;
import android.os.Handler;
import android.support.v4.widget.SwipeRefreshLayout;
import android.util.Log;
import android.view.Gravity;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ListView;
import android.widget.TextView;
import android.widget.Toast;


import com.baidu.location.BDAbstractLocationListener;
import com.baidu.location.BDLocation;

import com.klr.tools.SharedPreference;
import com.klr.tools.Toasts;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import qiangdan.hemiao.com.qiangdan.activity.CenterActivity;
import qiangdan.hemiao.com.qiangdan.activity.GetOrderDetailActivity;
import qiangdan.hemiao.com.qiangdan.adapter.OrderListAdapter;
import qiangdan.hemiao.com.qiangdan.base.App;
import qiangdan.hemiao.com.qiangdan.base.BaseActivity;
import qiangdan.hemiao.com.qiangdan.base.Constant;
import qiangdan.hemiao.com.qiangdan.base.ShareApp;
import qiangdan.hemiao.com.qiangdan.bean.Msg;
import qiangdan.hemiao.com.qiangdan.bean.Order;
import qiangdan.hemiao.com.qiangdan.bean.OrderList;
import qiangdan.hemiao.com.qiangdan.https.HttpLoader;
import qiangdan.hemiao.com.qiangdan.service.LocationService;
import qiangdan.hemiao.com.qiangdan.utils.Tools;

public class MainActivity extends BaseActivity implements HttpLoader.HttpListener, SwipeRefreshLayout.OnRefreshListener {

    private ImageView center;//个人中心
    private TextView title;//标题
    private ImageView back;

    private ListView list;
    private SwipeRefreshLayout mSwipeRefreshLayout;
    private LinearLayout nullView;//空布局
    private LocationService locationService;//定位服务
    long preTime;
    public static final long TWO_SECOND = 4 * 1000;
    private String getOrderId;
//    /**
//     * 构造广播监听类，监听 SDK key 验证以及网络异常广播
//     */
//    public class SDKReceiver extends BroadcastReceiver {
//
//        public void onReceive(Context context, Intent intent) {
//            String s = intent.getAction();
//            Log.e("wwwwwwwww", "action: " + s);
////            TextView text = (TextView) findViewById(R.id.text_Info);
////            text.setTextColor(Color.RED);
//            if (s.equals(SDKInitializer.SDK_BROADTCAST_ACTION_STRING_PERMISSION_CHECK_ERROR)) {
////                text.setText("key 验证出错! 错误码 :" + intent.getIntExtra
////                        (SDKInitializer.SDK_BROADTCAST_INTENT_EXTRA_INFO_KEY_ERROR_CODE, 0)
////                        +  " ; 请在 AndroidManifest.xml 文件中检查 key 设置");
//            } else if (s.equals(SDKInitializer.SDK_BROADTCAST_ACTION_STRING_PERMISSION_CHECK_OK)) {
////                text.setText("key 验证成功! 功能可以正常使用");
////                text.setTextColor(Color.YELLOW);
//            } else if (s.equals(SDKInitializer.SDK_BROADCAST_ACTION_STRING_NETWORK_ERROR)) {
//            //    text.setText("网络出错");
//            }
//        }
//    }
//
//    private SDKReceiver mReceiver;

    @Override
    public void initWidget() {
        setContentView(R.layout.activity_main);
        center = findViewById(R.id.center);
        center.setOnClickListener(this);
        back = findViewById(R.id.back);
        back.setVisibility(View.GONE);
        list = findViewById(R.id.list);
        title = findViewById(R.id.title);
        title.setText("我的抢单");
        nullView = findViewById(R.id.nullView);
        mSwipeRefreshLayout = findViewById(R.id.swipeLayout);
        mSwipeRefreshLayout.setOnRefreshListener(this);
        mSwipeRefreshLayout.setColorSchemeColors(Color.rgb(47, 223, 189));
        mSwipeRefreshLayout.post(new Runnable() {
            @Override
            public void run() {
                mSwipeRefreshLayout.setRefreshing(true);
            }
        });
//        // 注册 SDK 广播监听者
//        IntentFilter iFilter = new IntentFilter();
//        iFilter.addAction(SDKInitializer.SDK_BROADTCAST_ACTION_STRING_PERMISSION_CHECK_OK);
//        iFilter.addAction(SDKInitializer.SDK_BROADTCAST_ACTION_STRING_PERMISSION_CHECK_ERROR);
//        iFilter.addAction(SDKInitializer.SDK_BROADCAST_ACTION_STRING_NETWORK_ERROR);
//        mReceiver = new SDKReceiver();
//        registerReceiver(mReceiver, iFilter);
//        Log.e("wwwwwwwww", "act2222222222ion: "  );

    }

    @Override
    public void widgetClick(View v) {
        switch (v.getId()) {
            case R.id.center:
                Tools.single(mContext, CenterActivity.class);
                break;
        }
    }

    @Override
    public void showProgress() {

    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getData();

    }

    @Override
    public void onGetResponseSuccess(String requestCode, String response) {
        switch (requestCode) {
            case ShareApp.getQiangOrderList:
                OrderList mOrderList = Tools.parseJsonWithGson(response, OrderList.class);
                if (mOrderList.getCode().equals(Constant.SUCCESS)) {
                    OrderListAdapter adapter = new OrderListAdapter(mContext, mOrderList.getData(), mOkHttpClient, MainActivity.this);
                    list.setAdapter(adapter);
                    adapter.notifyDataSetChanged();
                    list.setVisibility(View.VISIBLE);
                    nullView.setVisibility(View.GONE);
                    alert(mOrderList.getData().get(0));

                } else {
                    list.setVisibility(View.GONE);
                    Log.e("==========", "==========");
                    nullView.setVisibility(View.VISIBLE);
                }
                mSwipeRefreshLayout.setRefreshing(false);

                break;
            case ShareApp.getQiangOrder:
                Msg mMsg = Tools.parseJsonWithGson(response, Msg.class);
                if (mMsg.getCode().equals(Constant.SUCCESS)) {
                    Toasts.show(mContext, "抢单成功！");
//                    mDatas.remove(pos);
//                    notifyDataSetChanged();

                    Bundle bundle = new Bundle();
                    bundle.putString("orderId", getOrderId);
                    Tools.bundle(mContext, GetOrderDetailActivity.class, bundle);
                } else {
                    Toasts.show(mContext, "抢单失败！");

                }

                break;
        }
    }

    @Override
    public void onGetResponseError(String requestCode, Exception error) {

    }

    @Override
    public void onRefresh() {
        new Handler().postDelayed(new Runnable() {
            @Override
            public void run() {
                Log.e("=====onRefresh=====", "刷新了");
                getData();
            }
        }, 1000);
    }

    private void getData() {
        Map hashmap = new HashMap();
        hashmap.put("getorder_status", "0");
        hashmap.put("order_status", "2");
        App.KLR.getData(mOkHttpClient, ShareApp.getQiangOrderList, this, hashmap);

    }

    @Override
    protected void onStart() {
        // TODO Auto-generated method stub
        super.onStart();
        // -----------location config ------------
        locationService = ((App) getApplication()).locationService;
        //获取locationservice实例，建议应用中只初始化1个location实例，然后使用，可以参考其他示例的activity，都是通过此种方式获取locationservice实例的
        locationService.registerListener(mListener);
        //注册监听

        locationService.setLocationOption(locationService.getDefaultLocationClientOption());

        locationService.start();// 定位SDK

//            @Override
//            public void onClick(View v) {
//                if (startLocation.getText().toString().equals(getString(R.string.startlocation))) {
//                    locationService.start();// 定位SDK
//                    // start之后会默认发起一次定位请求，开发者无须判断isstart并主动调用request
//                    startLocation.setText(getString(R.string.stoplocation));
//                } else {
//                    locationService.stop();
//                    startLocation.setText(getString(R.string.startlocation));
//                }
//            }
//        });
    }

    /*****
     *
     * 定位结果回调，重写onReceiveLocation方法，可以直接拷贝如下代码到自己工程中修改
     *
     */
    private BDAbstractLocationListener mListener = new BDAbstractLocationListener() {

        @Override
        public void onReceiveLocation(BDLocation location) {
            // TODO Auto-generated method stub
//            if (null != location && location.getLocType() != BDLocation.TypeServerError) {
//                StringBuffer sb = new StringBuffer(256);
//                sb.append("time : ");
//                /**
//                 * 时间也可以使用systemClock.elapsedRealtime()方法 获取的是自从开机以来，每次回调的时间；
//                 * location.getTime() 是指服务端出本次结果的时间，如果位置不发生变化，则时间不变
//                 */
//                sb.append(location.getTime());
//                sb.append("\nlocType : ");// 定位类型
//                sb.append(location.getLocType());
//                sb.append("\nlocType description : ");// *****对应的定位类型说明*****
//                sb.append(location.getLocTypeDescription());
//                sb.append("\nlatitude : ");// 纬度
//                sb.append(location.getLatitude());
//                sb.append("\nlontitude : ");// 经度
//                sb.append(location.getLongitude());
//                sb.append("\nradius : ");// 半径
//                sb.append(location.getRadius());
//                sb.append("\nCountryCode : ");// 国家码
//                sb.append(location.getCountryCode());
//                sb.append("\nCountry : ");// 国家名称
//                sb.append(location.getCountry());
//                sb.append("\ncitycode : ");// 城市编码
//                sb.append(location.getCityCode());
//                sb.append("\ncity : ");// 城市
//                sb.append(location.getCity());
//                sb.append("\nDistrict : ");// 区
//                sb.append(location.getDistrict());
//                sb.append("\nStreet : ");// 街道
//                sb.append(location.getStreet());
//                sb.append("\naddr : ");// 地址信息
//                sb.append(location.getAddrStr());
//                sb.append("\nUserIndoorState: ");// *****返回用户室内外判断结果*****
//                sb.append(location.getUserIndoorState());
//                sb.append("\nDirection(not all devices have value): ");
//                sb.append(location.getDirection());// 方向
//                sb.append("\nlocationdescribe: ");
//                sb.append(location.getLocationDescribe());// 位置语义化信息
//                sb.append("\nPoi: ");// POI信息
//                if (location.getPoiList() != null && !location.getPoiList().isEmpty()) {
//                    for (int i = 0; i < location.getPoiList().size(); i++) {
//                        Poi poi = (Poi) location.getPoiList().get(i);
//                        sb.append(poi.getName() + ";");
//                    }
//                }
//                if (location.getLocType() == BDLocation.TypeGpsLocation) {// GPS定位结果
//                    sb.append("\nspeed : ");
//                    sb.append(location.getSpeed());// 速度 单位：km/h
//                    sb.append("\nsatellite : ");
//                    sb.append(location.getSatelliteNumber());// 卫星数目
//                    sb.append("\nheight : ");
//                    sb.append(location.getAltitude());// 海拔高度 单位：米
//                    sb.append("\ngps status : ");
//                    sb.append(location.getGpsAccuracyStatus());// *****gps质量判断*****
//                    sb.append("\ndescribe : ");
//                    sb.append("gps定位成功");
//                } else if (location.getLocType() == BDLocation.TypeNetWorkLocation) {// 网络定位结果
//                    // 运营商信息
//                    if (location.hasAltitude()) {// *****如果有海拔高度*****
//                        sb.append("\nheight : ");
//                        sb.append(location.getAltitude());// 单位：米
//                    }
//                    sb.append("\noperationers : ");// 运营商信息
//                    sb.append(location.getOperators());
//                    sb.append("\ndescribe : ");
//                    sb.append("网络定位成功");
//                } else if (location.getLocType() == BDLocation.TypeOffLineLocation) {// 离线定位结果
//                    sb.append("\ndescribe : ");
//                    sb.append("离线定位成功，离线定位结果也是有效的");
//                } else if (location.getLocType() == BDLocation.TypeServerError) {
//                    sb.append("\ndescribe : ");
//                    sb.append("服务端网络定位失败，可以反馈IMEI号和大体定位时间到loc-bugs@baidu.com，会有人追查原因");
//                } else if (location.getLocType() == BDLocation.TypeNetWorkException) {
//                    sb.append("\ndescribe : ");
//                    sb.append("网络不同导致定位失败，请检查网络是否通畅");
//                } else if (location.getLocType() == BDLocation.TypeCriteriaException) {
//                    sb.append("\ndescribe : ");
//                    sb.append("无法获取有效定位依据导致定位失败，一般是由于手机的原因，处于飞行模式下一般会造成这种结果，可以试着重启手机");
//                }
            Log.e("=====sb======", location.getLatitude() + "");
            Log.e("=====sb======", location.getLongitude() + "");
            App.lon = location.getLongitude();
            App.lat = location.getLatitude();

            updataPos(location.getLongitude() + "", location.getLatitude() + "");

        }

    };


    private void updataPos(String lon, String lat) {

        Map hashmap = new HashMap();
        hashmap.put("openId", SharedPreference.get(mContext, "openId", ""));
        hashmap.put("lon", lon);
        hashmap.put("lat", lat);
        App.KLR.getData(mOkHttpClient, ShareApp.updataPos, this, hashmap);

    }


    private void alert(final Order mOrder) {

        final Dialog dialogss = new Dialog(MainActivity.this, R.style.Dialog);
        Window dialogWindow = dialogss.getWindow();
        WindowManager.LayoutParams lp = dialogWindow.getAttributes();
        dialogWindow.setGravity(Gravity.CENTER);

        View contentViews = LayoutInflater.from(MainActivity.this).inflate(R.layout.position_alert, null);

        TextView ji_address = contentViews.findViewById(R.id.ji_address);
        TextView shou_address = contentViews.findViewById(R.id.shou_address);
        TextView goodsName = contentViews.findViewById(R.id.goodsName);
        TextView money = contentViews.findViewById(R.id.money);
        TextView bases = contentViews.findViewById(R.id.base);
        TextView time = contentViews.findViewById(R.id.time);
        TextView cancle = contentViews.findViewById(R.id.cancle);
        TextView commit = contentViews.findViewById(R.id.commit);
        ji_address.setText(mOrder.getJi_address());
        shou_address.setText(mOrder.getShou_address());
        goodsName.setText(mOrder.getGoodsname());

        money.setText(mOrder.getPayprice());

        String base = mOrder.getGl() + "公里 | " + mOrder.getZl() + "公斤";
        bases.setText(base);
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Long times = new Long(mOrder.getTime());
        String d = format.format(times * 1000);
        time.setText(d);

        dialogss.setContentView(contentViews);
        dialogss.setCanceledOnTouchOutside(false);
        dialogss.show();

        commit.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                getOrders(mOrder);
                dialogss.dismiss();

            }
        });
        cancle.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                dialogss.dismiss();
            }
        });
    }


    private void getOrders(Order mOrder) {
        getOrderId = mOrder.getOrderid();
        Map hashmap = new HashMap();
        hashmap.put("openid", SharedPreference.get(mContext, "openId", ""));
        hashmap.put("orderid", mOrder.getOrderid());
        App.KLR.getData(mOkHttpClient, ShareApp.getQiangOrder, this, hashmap);

    }


    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        // 截获后退键
        if (keyCode == KeyEvent.KEYCODE_BACK) {
            long currentTime = new Date().getTime();

            // 如果时间间隔大于2秒, 不处理
            if ((currentTime - preTime) > TWO_SECOND) {
                // 显示消息
                Toast.makeText(this, "再按一次退出应用",
                        Toast.LENGTH_SHORT).show();
                //  mSVProgressHUD.showInfoWithStatus("再按一次退出应用");

                // 更新时间
                preTime = currentTime;

                // 截获事件,不再处理
                return true;
            }
        }

        return super.onKeyDown(keyCode, event);
    }

}
