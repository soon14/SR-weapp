package qiangdan.hemiao.com.qiangdan.adapter;

import android.content.Context;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.TextView;

import com.klr.tools.SharedPreference;
import com.klr.tools.Toasts;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import okhttp3.OkHttpClient;
import qiangdan.hemiao.com.qiangdan.R;
import qiangdan.hemiao.com.qiangdan.base.App;
import qiangdan.hemiao.com.qiangdan.base.Constant;
import qiangdan.hemiao.com.qiangdan.base.ShareApp;
import qiangdan.hemiao.com.qiangdan.bean.Msg;
import qiangdan.hemiao.com.qiangdan.bean.Order;
import qiangdan.hemiao.com.qiangdan.bean.TiMoney;
import qiangdan.hemiao.com.qiangdan.https.HttpLoader;
import qiangdan.hemiao.com.qiangdan.utils.Tools;


/**
 * author: klr
 * date: 2017/6/2
 */
public class TiMoneyListAdapter extends BaseAdapter {
    private List<TiMoney> mDatas;
    private Context mContext;
    ViewHolder holder;

    public TiMoneyListAdapter(Context context, List<TiMoney> mList) {
        this.mDatas = mList;
        this.mContext = context;
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
                    R.layout.ti_money, null);
            holder.status = view.findViewById(R.id.status);
            holder.price = view.findViewById(R.id.price);
            holder.time = view.findViewById(R.id.time);

            view.setTag(holder);
        } else {
            holder = (ViewHolder) view.getTag();
        }
        if (mDatas.get(position).getIs_ti().equals("0")) {
            holder.status.setText("审核中");
        } else {
            holder.status.setText("审核通过");
        }
        holder.price.setText(mDatas.get(position).getPrice());

        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Long time = new Long(mDatas.get(position).getTime() + "000");
        String d = format.format(time);
        holder.time.setText(d);

        return view;
    }

    /**
     * ViewHolder类
     */
    static class ViewHolder {
        TextView status;
        TextView price;
        TextView time;


    }


}