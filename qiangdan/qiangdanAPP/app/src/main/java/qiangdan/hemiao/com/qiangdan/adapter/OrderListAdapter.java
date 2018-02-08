package qiangdan.hemiao.com.qiangdan.adapter;

import android.app.Activity;
import android.app.Dialog;
import android.content.Context;
import android.os.Bundle;
import android.os.Handler;
import android.view.Display;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.view.WindowManager;
import android.widget.BaseAdapter;
import android.widget.TextView;


import com.klr.tools.SharedPreference;
import com.klr.tools.Toasts;

import java.text.SimpleDateFormat;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Timer;
import java.util.TimerTask;

import okhttp3.OkHttpClient;
import qiangdan.hemiao.com.qiangdan.R;
import qiangdan.hemiao.com.qiangdan.activity.GetOrderDetailActivity;
import qiangdan.hemiao.com.qiangdan.base.App;
import qiangdan.hemiao.com.qiangdan.base.Constant;
 import qiangdan.hemiao.com.qiangdan.base.ShareApp;
import qiangdan.hemiao.com.qiangdan.bean.Msg;
import qiangdan.hemiao.com.qiangdan.bean.Order;
import qiangdan.hemiao.com.qiangdan.bean.OrderList;
import qiangdan.hemiao.com.qiangdan.https.HttpLoader;
import qiangdan.hemiao.com.qiangdan.utils.Tools;


/**
 * author: klr
 * date: 2017/6/2
 */
public class OrderListAdapter extends BaseAdapter implements HttpLoader.HttpListener {
    private List<Order> mDatas;
    private Context mContext;
    private OkHttpClient mOkHttpClient;
    ViewHolder holder;
    int pos;
    Activity activity;
    static TextView commit;

    public OrderListAdapter(Context context, List<Order> mList, OkHttpClient mOkHttpClient, Activity activity) {
        this.mDatas = mList;
        this.mContext = context;
        this.mOkHttpClient = mOkHttpClient;
        this.activity = activity;
    }


    @Override
    public int getCount() {
        // TODO Auto-generated method stub
        return mDatas.size();
    }

    @Override
    public Object getItem(int position) {
        // TODO Auto-generated method stub

        return mDatas.get(position);
    }

    @Override
    public long getItemId(int position) {
        // TODO Auto-generated method stub
        return position;
    }

    @Override
    public View getView(final int position, View view, ViewGroup parent) {
        // TODO Auto-generated method stub
        if (view == null) {
            holder = new ViewHolder();

            view = LayoutInflater.from(mContext).inflate(
                    R.layout.order_item, null);


            holder.money = view.findViewById(R.id.money);
            holder.base = view.findViewById(R.id.base);

            holder.ji_address = view.findViewById(R.id.ji_address);
            holder.shou_address = view.findViewById(R.id.shou_address);
            holder.goodsName = view.findViewById(R.id.goodsName);
            holder.time = view.findViewById(R.id.time);
            holder.getOrder = view.findViewById(R.id.getOrder);
            view.setTag(holder);
        } else {
            holder = (ViewHolder) view.getTag();
        }
        holder.money.setText(mDatas.get(position).getPayprice());

        String base = mDatas.get(position).getGl() + "公里 | " + mDatas.get(position).getZl() + "公斤";
        holder.base.setText(base);

        holder.ji_address.setText(mDatas.get(position).getJi_address());
        holder.shou_address.setText(mDatas.get(position).getShou_address());
        holder.goodsName.setText(mDatas.get(position).getGoodsname());
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Long time = new Long(mDatas.get(position).getTime());
        String d = format.format(time * 1000);
        holder.time.setText(d);
        holder.getOrder.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                pos = position;

                alert(mDatas.get(position),  position);
                timer();
            }
        });
        return view;
    }

    @Override
    public void onGetResponseSuccess(String requestCode, String response) {
        switch (requestCode) {
            case ShareApp.getQiangOrder:
                Msg mMsg = Tools.parseJsonWithGson(response, Msg.class);
                if (mMsg.getCode().equals(Constant.SUCCESS)) {
                    Toasts.show(mContext, "抢单成功！");
                    mDatas.remove(pos);
                    notifyDataSetChanged();
//                    Bundle bundle = new Bundle();
//                    bundle.putString("orderId", getOrderId);
//                    Tools.bundle(mContext, GetOrderDetailActivity.class, bundle);
                }else{
                    Toasts.show(mContext, "抢单失败！");

                }

                break;
        }
    }

    @Override
    public void onGetResponseError(String requestCode, Exception error) {

    }


    /**
     * ViewHolder类
     */
    static class ViewHolder {
        TextView money;
        TextView base;

        TextView ji_address;
        TextView shou_address;
        TextView goodsName;
        TextView time;
        TextView getOrder;


    }

    private void getOrders(int position) {
        Map hashmap = new HashMap();
        hashmap.put("openid", SharedPreference.get(mContext, "openId", ""));
        hashmap.put("orderid", mDatas.get(position).getOrderid());
        App.KLR.getData(mOkHttpClient, ShareApp.getQiangOrder, this, hashmap);

    }


    private void alert(Order mOrder, final int postion) {

        final Dialog dialogss = new Dialog(activity, R.style.Dialog);
        Window dialogWindow = dialogss.getWindow();
        WindowManager.LayoutParams lp = dialogWindow.getAttributes();
        dialogWindow.setGravity(Gravity.CENTER);

        View contentViews = LayoutInflater.from(activity).inflate(R.layout.position_alert, null);

        TextView ji_address = contentViews.findViewById(R.id.ji_address);
        TextView shou_address = contentViews.findViewById(R.id.shou_address);
        TextView goodsName = contentViews.findViewById(R.id.goodsName);
        TextView money = contentViews.findViewById(R.id.money);
        TextView bases = contentViews.findViewById(R.id.base);
        TextView time = contentViews.findViewById(R.id.time);
        TextView  cancle= contentViews.findViewById(R.id.cancle);
         commit = contentViews.findViewById(R.id.commit);
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
                getOrders(postion);
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

    static int time = 5;
    private static Handler handler = new Handler() {
        public void handleMessage(android.os.Message msg) {
            if (msg.what == 1) {
                if (time > 1) {
                    time--;
                    commit.setText(time + "秒后抢单");
                    commit.setEnabled(false);
                } else {
                    mTimer.cancel();
                    commit.setText("开始抢单");
                    commit.setEnabled(true);
                    // voiceLayout.setVisibility(View.VISIBLE);
                    commit.setBackgroundResource(R.mipmap.btn);
                    time = 5;
                }
            }
        }
    };

}