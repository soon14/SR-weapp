package qiangdan.hemiao.com.qiangdan.adapter;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.TextView;

import com.klr.tools.SharedPreference;
import com.klr.tools.Toasts;

import java.text.SimpleDateFormat;
import java.util.HashMap;
import java.util.List;

import okhttp3.OkHttpClient;
import qiangdan.hemiao.com.qiangdan.R;

import qiangdan.hemiao.com.qiangdan.bean.Order;



/**
 * author: klr
 * date: 2017/6/2
 */
public class GetOrderListAdapter extends BaseAdapter  {
    private List<Order> mDatas;
    private Context mContext;
    private OkHttpClient mOkHttpClient;
    ViewHolder holder;
    int pos;

    public GetOrderListAdapter(Context context, List<Order> mList, OkHttpClient mOkHttpClient) {
        this.mDatas = mList;
        this.mContext = context;
        this.mOkHttpClient = mOkHttpClient;
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
                    R.layout.get_order_item, null);


            holder.money = view.findViewById(R.id.money);
            holder.base = view.findViewById(R.id.base);

            holder.ji_address = view.findViewById(R.id.ji_address);
            holder.shou_address = view.findViewById(R.id.shou_address);
            holder.goodsName = view.findViewById(R.id.goodsName);
            holder.time = view.findViewById(R.id.time);
            holder.getGoodsNum = view.findViewById(R.id.getGoodsNum);
            holder.status = view.findViewById(R.id.status);
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
        holder.getGoodsNum.setText(mDatas.get(position).getShou_name());
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Long time = new Long(mDatas.get(position).getTime());
        String d = format.format(time * 1000);
        holder.time.setText(d);

        if (mDatas.get(position).getOrder_status().equals("1")) {
            holder.status.setText("未支付");
        } else if (mDatas.get(position).getOrder_status().equals("2")) {
            holder.status.setText("已支付");
        } else if (mDatas.get(position).getOrder_status().equals("3")) {
            holder.status.setText("已送货");
        } else if (mDatas.get(position).getOrder_status().equals("4")) {
            holder.status.setText("已到达");
        }
        return view;
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
        TextView getGoodsNum;
        TextView status;
    }


}