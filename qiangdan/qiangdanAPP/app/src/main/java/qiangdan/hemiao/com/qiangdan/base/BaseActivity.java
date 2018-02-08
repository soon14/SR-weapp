package qiangdan.hemiao.com.qiangdan.base;

import android.Manifest;
import android.annotation.TargetApi;
import android.content.Context;
import android.content.pm.ActivityInfo;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v4.app.FragmentActivity;
import android.view.View;
import android.view.Window;
import android.widget.ImageView;

import com.bigkoo.svprogresshud.SVProgressHUD;

import org.xutils.image.ImageOptions;

import java.util.ArrayList;

import okhttp3.OkHttpClient;
import qiangdan.hemiao.com.qiangdan.R;


/**
 * 基础activity
 * author: klr
 * date: 2017/4/18
 */
public abstract class BaseActivity extends FragmentActivity implements View.OnClickListener {
    private static final int ACTIVITY_RESUME = 0;
    private static final int ACTIVITY_STOP = 1;
    private static final int ACTIVITY_PAUSE = 2;
    private static final int ACTIVITY_DESTROY = 3;

    public int activityState;

    public abstract void initWidget();//初始化视图

    public abstract void widgetClick(View v);

    public abstract void showProgress();

    public static Context mContext;

    //提示组件
    public SVProgressHUD mSVProgressHUD;
    private String permissionInfo;
    private final int SDK_PERMISSION_REQUEST = 127;
    public OkHttpClient mOkHttpClient;
    public static ImageOptions imageOptions;

    @Override
    public void onClick(View v) {
        widgetClick(v);
    }

   // public String _param_key;
    public App app;

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_NO_TITLE);

        //透明状态栏
//       getWindow().addFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS);
//         //透明导航栏
//       getWindow().addFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_NAVIGATION);
        // 竖屏锁定
        setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
        AppManager.getAppManager().addActivity(this);
        mSVProgressHUD = new SVProgressHUD(this);
        imageOptions = new ImageOptions.Builder()
                //  .setSize(DensityUtil.dip2px(120), DensityUtil.dip2px(120))
                // .setRadius(DensityUtil.dip2px(5))
                // 如果ImageView的大小不是定义为wrap_content, 不要crop.
                // .setCrop(true)
                // 加载中或错误图片的ScaleType
                //.setPlaceholderScaleType(ImageView.ScaleType.MATRIX)
                .setImageScaleType(ImageView.ScaleType.FIT_XY)
                .setLoadingDrawableId(R.mipmap.icon_clock)
                .setFailureDrawableId(R.mipmap.icon_clock)
                //设置使用缓存
                .setUseMemCache(true)
                .build();
        initWidget();
        mOkHttpClient = new OkHttpClient();
        showProgress();
        mContext = getApplicationContext();
        getPersimmions();
//        Long timeM = System.currentTimeMillis() / 1000;
//
//        Long timC = (Long) SharedPreference.get(mContext, "timeC", 0L);
//        Long time = timeM - timC;
//        _param_key = SharedPreference.get(mContext, "username", "") + "$" + SharedPreference.get(mContext, "password", "") + "$" + time;
//
//
//        _param_key = PublicRsaUitl.getInstance().JiaMiByPub(_param_key);
    }


    @Override
    protected void onStart() {
        super.onStart();
    }

    @Override
    protected void onResume() {
        super.onResume();
        activityState = ACTIVITY_RESUME;
    }

    @Override
    protected void onStop() {
        super.onStop();
        activityState = ACTIVITY_STOP;
    }

    @Override
    protected void onPause() {
        super.onPause();
        activityState = ACTIVITY_PAUSE;
    }

    @Override
    protected void onRestart() {
        super.onRestart();
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        activityState = ACTIVITY_DESTROY;
        AppManager.getAppManager().finishActivity(this);
    }


    @TargetApi(23)
    private void getPersimmions() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            ArrayList<String> permissions = new ArrayList<String>();
            /***
             * 定位权限为必须权限，用户如果禁止，则每次进入都会申请
             * 1、获取手机状态：
             Manifest.permission.READ_PHONE_STATE

             2、获取位置信息：
             Manifest.permission.ACCESS_COARSE_LOCATION
             Manifest.permission.ACCESS_FINE_LOCATION

             3、读写SD卡：
             Manifest.permission.READ_EXTERNAL_STORAGE
             Manifest.permission.WRITE_EXTERNAL_STORAGE
             */
            // 定位精确位置
            if (checkSelfPermission(Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
                permissions.add(Manifest.permission.ACCESS_FINE_LOCATION);
            }
            if (checkSelfPermission(Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
                permissions.add(Manifest.permission.ACCESS_COARSE_LOCATION);
            }
            /*
             * 读写权限和电话状态权限非必要权限(建议授予)只会申请一次，用户同意或者禁止，只会弹一次
			 */
            // 读写权限
            if (addPermission(permissions, Manifest.permission.WRITE_EXTERNAL_STORAGE)) {
                permissionInfo += "Manifest.permission.WRITE_EXTERNAL_STORAGE Deny \n";
            }
            if (addPermission(permissions, Manifest.permission.READ_EXTERNAL_STORAGE)) {
                permissionInfo += "Manifest.permission.READ_EXTERNAL_STORAGE Deny \n";
            }
            // 读取电话状态权限
            if (addPermission(permissions, Manifest.permission.READ_PHONE_STATE)) {
                permissionInfo += "Manifest.permission.READ_PHONE_STATE Deny \n";
            }

            if (permissions.size() > 0) {
                requestPermissions(permissions.toArray(new String[permissions.size()]), SDK_PERMISSION_REQUEST);
            }
        }
    }

    @TargetApi(23)
    private boolean addPermission(ArrayList<String> permissionsList, String permission) {
        if (checkSelfPermission(permission) != PackageManager.PERMISSION_GRANTED) { // 如果应用没有获得对应权限,则添加到列表中,准备批量申请
            if (shouldShowRequestPermissionRationale(permission)) {
                return true;
            } else {
                permissionsList.add(permission);
                return false;
            }

        } else {
            return true;
        }
    }

    @TargetApi(23)
    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        // TODO Auto-generated method stub
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);

    }

}
