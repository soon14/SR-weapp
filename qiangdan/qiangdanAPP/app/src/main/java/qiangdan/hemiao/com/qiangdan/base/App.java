package qiangdan.hemiao.com.qiangdan.base;

import android.app.Application;
import android.content.Context;
import android.os.Bundle;
import android.util.DisplayMetrics;

import com.baidu.mapapi.CoordType;
import com.baidu.mapapi.SDKInitializer;

import org.xutils.x;

import java.util.ArrayList;
import java.util.List;

import cn.jpush.android.api.JPushInterface;
import qiangdan.hemiao.com.qiangdan.https.HttpLoader;
import qiangdan.hemiao.com.qiangdan.service.LocationService;


/**
 * Created by 孔令仁 on 2016/6/21.
 */
public class App extends Application {
    public static HttpLoader KLR;
    public static Context context;
    public static List<?> images = new ArrayList<>();
    public static int H, W;
    public LocationService locationService;

    public static double lon;
    public static double lat;


    @Override
    public void onCreate() {
        super.onCreate();
        context = this;
        getScreen(context);
        // 在使用 SDK 各组间之前初始化 context 信息，传入 ApplicationContext
        KLR = HttpLoader.getInstance(context);

        x.Ext.init(this);
        x.Ext.setDebug(true); // 是否输出debug日志

        JPushInterface.setDebugMode(true);
        JPushInterface.init(this);


        locationService = new LocationService(getApplicationContext());
        // 在使用 SDK 各组间之前初始化 context 信息，传入 ApplicationContext
        SDKInitializer.initialize(this);
        //自4.3.0起，百度地图SDK所有接口均支持百度坐标和国测局坐标，用此方法设置您使用的坐标类型.
        //包括BD09LL和GCJ02两种坐标，默认是BD09LL坐标。
        SDKInitializer.setCoordType(CoordType.BD09LL);
    }

    public void getScreen(Context aty) {
        DisplayMetrics dm = aty.getResources().getDisplayMetrics();
        H = dm.heightPixels;
        W = dm.widthPixels;
    }
}
