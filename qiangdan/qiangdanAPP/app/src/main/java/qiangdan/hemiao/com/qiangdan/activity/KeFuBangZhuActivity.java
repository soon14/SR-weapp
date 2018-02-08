package qiangdan.hemiao.com.qiangdan.activity;

import android.os.Bundle;
import android.view.View;
import android.widget.ImageView;
import android.widget.TextView;

import qiangdan.hemiao.com.qiangdan.R;
import qiangdan.hemiao.com.qiangdan.base.BaseActivity;

/**
 * 客服与帮助
 */
public class KeFuBangZhuActivity extends BaseActivity {
    private TextView title;
    private ImageView back;
    private ImageView center;

    @Override
    public void initWidget() {
        setContentView(R.layout.activity_ke_fu_bang_zhu);
        title = findViewById(R.id.title);
        title.setText("客服与帮助");
        back = findViewById(R.id.back);
        back.setOnClickListener(this);
        center = findViewById(R.id.center);
        center.setVisibility(View.INVISIBLE);
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
    }
}
