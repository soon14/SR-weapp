package qiangdan.hemiao.com.qiangdan.activity;

import android.os.Bundle;
import android.view.View;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import qiangdan.hemiao.com.qiangdan.R;
import qiangdan.hemiao.com.qiangdan.base.BaseActivity;
import qiangdan.hemiao.com.qiangdan.utils.Tools;

/**
 * 配送员手册
 */
public class ShouCeActivity extends BaseActivity {

    private LinearLayout wygl;//违约管理
    private LinearLayout fwlc;//服务流程
    private LinearLayout gqzb;//岗前准备
    private LinearLayout sgcl;//事故处理
    private LinearLayout gbwjp;//规避违禁品

    private TextView title;
    private ImageView center;
    private ImageView back;

    @Override
    public void initWidget() {
        setContentView(R.layout.activity_shou_che);
        title = findViewById(R.id.title);
        title.setText("配送员手册");
        center = findViewById(R.id.center);
        center.setVisibility(View.INVISIBLE);
        back = findViewById(R.id.back);
        back.setOnClickListener(this);

        wygl = findViewById(R.id.wygl);
        fwlc = findViewById(R.id.fwlc);
        gqzb = findViewById(R.id.gqzb);
        sgcl = findViewById(R.id.sgcl);
        gbwjp = findViewById(R.id.gbwjp);

        wygl.setOnClickListener(this);
        fwlc.setOnClickListener(this);
        gqzb.setOnClickListener(this);
        sgcl.setOnClickListener(this);
        gbwjp.setOnClickListener(this);

    }

    @Override
    public void widgetClick(View v) {
        Bundle bundle = new Bundle();

        switch (v.getId()) {
            case R.id.back:
                finish();
                break;
            case R.id.wygl:
                bundle.putString("title", "违约管理");
                bundle.putString("txtName", "wygl.txt");
                Tools.bundle(mContext, TextActivity.class, bundle);

                break;
            case R.id.fwlc:
                bundle.putString("title", "服务流程");
                bundle.putString("txtName", "fwlcs.txt");
                Tools.bundle(mContext, TextActivity.class, bundle);

                break;
            case R.id.gqzb:
                bundle.putString("title", "岗前准备");
                bundle.putString("txtName", "gqzb.txt");
                Tools.bundle(mContext, TextActivity.class, bundle);

                break;

            case R.id.sgcl:
                bundle.putString("title", "事故处理");
                bundle.putString("txtName", "sgcl.txt");
                Tools.bundle(mContext, TextActivity.class, bundle);

                break;
            case R.id.gbwjp:
                bundle.putString("title", "规避违禁品");
                bundle.putString("txtName", "wbwjp.txt");
                Tools.bundle(mContext, TextActivity.class, bundle);

                break;
        }
    }

    @Override
    public void showProgress() {

    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }
}
