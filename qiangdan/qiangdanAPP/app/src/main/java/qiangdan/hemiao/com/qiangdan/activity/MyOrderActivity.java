package qiangdan.hemiao.com.qiangdan.activity;

import android.graphics.Color;
import android.os.Bundle;
import android.os.Handler;
import android.provider.SyncStateContract;
import android.support.v4.widget.SwipeRefreshLayout;
import android.util.Log;
import android.view.View;
import android.widget.AbsListView;
import android.widget.AdapterView;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ListView;
import android.widget.TextView;


import com.klr.tools.SharedPreference;

import java.util.HashMap;
import java.util.Map;

import qiangdan.hemiao.com.qiangdan.R;
import qiangdan.hemiao.com.qiangdan.adapter.GetOrderListAdapter;
import qiangdan.hemiao.com.qiangdan.base.App;
import qiangdan.hemiao.com.qiangdan.base.BaseActivity;
import qiangdan.hemiao.com.qiangdan.base.Constant;
 import qiangdan.hemiao.com.qiangdan.base.ShareApp;
import qiangdan.hemiao.com.qiangdan.bean.OrderList;
import qiangdan.hemiao.com.qiangdan.https.HttpLoader;
import qiangdan.hemiao.com.qiangdan.utils.Tools;

/**
 * 我的抢单订单
 */
public class MyOrderActivity extends BaseActivity implements HttpLoader.HttpListener, SwipeRefreshLayout.OnRefreshListener {

    private TextView title;
    private ImageView back;
    private ListView list;
    OrderList mOrderList;
    private ImageView center;//个人中心
    private SwipeRefreshLayout mSwipeRefreshLayout;
    private LinearLayout nullView;//空布局

    @Override
    public void initWidget() {
        setContentView(R.layout.activity_my_order);

        center = findViewById(R.id.center);
        center.setVisibility(View.GONE);
        title = findViewById(R.id.title);
        title.setText("我的抢单");
        back = findViewById(R.id.back);
        back.setOnClickListener(this);
        list = findViewById(R.id.list);
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
        list.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                Bundle bundle = new Bundle();
                bundle.putString("orderId", mOrderList.getData().get(position).getOrderid());
                Tools.bundle(mContext, GetOrderDetailActivity.class, bundle);
            }
        });

        list.setOnScrollListener(new AbsListView.OnScrollListener() {

            @Override
            public void onScrollStateChanged(AbsListView view, int scrollState) {
            }

            @Override
            public void onScroll(AbsListView view, int firstVisibleItem,
                                 int visibleItemCount, int totalItemCount) {
                boolean enable = false;
                if(list != null && list.getChildCount() > 0){
                    // check if the first item of the list is visible
                    boolean firstItemVisible = list.getFirstVisiblePosition() == 0;
                    // check if the top of the first item is visible
                    boolean topOfFirstItemVisible = list.getChildAt(0).getTop() == 0;
                    // enabling or disabling the refresh layout
                    enable = firstItemVisible && topOfFirstItemVisible;
                }
                mSwipeRefreshLayout.setEnabled(enable);
            }});


    }

    @Override
    public void widgetClick(View v) {
        switch (v.getId()) {
            case R.id.back:
                finish();
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
            case ShareApp.getQiangOrderByOpenId:

                mOrderList = Tools.parseJsonWithGson(response, OrderList.class);
                if (mOrderList.getCode().equals(Constant.SUCCESS)) {
                    GetOrderListAdapter adapter = new GetOrderListAdapter(mContext, mOrderList.getData(), mOkHttpClient);
                    list.setAdapter(adapter);
                    nullView.setVisibility(View.GONE);
                    adapter.notifyDataSetChanged();
                } else {
                    nullView.setVisibility(View.VISIBLE);
                }
                mSwipeRefreshLayout.setRefreshing(false);

                break;
        }
    }

    @Override
    public void onGetResponseError(String requestCode, Exception error) {

    }

    private void getData() {
        Map hashmap = new HashMap();
        hashmap.put("openid", SharedPreference.get(mContext, "openId", ""));
        App.KLR.getData(mOkHttpClient, ShareApp.getQiangOrderByOpenId, this, hashmap);

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
}
