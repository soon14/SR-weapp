package qiangdan.hemiao.com.qiangdan.base;

import android.content.Context;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import com.bigkoo.svprogresshud.SVProgressHUD;

import okhttp3.OkHttpClient;

public abstract class BaseFragment extends Fragment {

    public SVProgressHUD mSVProgressHUD;
    public OkHttpClient mOkHttpClient;
    public Context mContext;

    //public String _param_key;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        mSVProgressHUD = new SVProgressHUD(getActivity());
        mOkHttpClient = new OkHttpClient();
        mContext = getActivity();
//        Long timeM = System.currentTimeMillis() / 1000;
//        Long timC = (Long) SharedPreference.get(mContext, "timeC", 0L);
//        Long time = timeM - timC;
//        _param_key = SharedPreference.get(mContext, "username", "") + "$" + SharedPreference.get(mContext, "password", "") + "$" + time;
//        _param_key = PublicRsaUitl.getInstance().JiaMiByPub(_param_key);

    }


    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {


        return container;
    }


}
