package qiangdan.hemiao.com.qiangdan.activity;

import android.media.Image;
import android.os.Bundle;
import android.text.Html;
import android.util.Log;
import android.view.View;
import android.widget.ImageView;
import android.widget.TextView;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

import qiangdan.hemiao.com.qiangdan.R;
import qiangdan.hemiao.com.qiangdan.base.BaseActivity;

public class TextActivity extends BaseActivity {
    private TextView text;

    private TextView title;
    private ImageView center;
    private ImageView back;

    private String titles;
    private String txtName;

    @Override
    public void initWidget() {
        setContentView(R.layout.activity_text);
        titles = getIntent().getStringExtra("title");
        txtName = getIntent().getStringExtra("txtName");
        text = findViewById(R.id.texts);
        title = findViewById(R.id.title);
        title.setText(titles);
        center = findViewById(R.id.center);
        center.setVisibility(View.INVISIBLE);
        back = findViewById(R.id.back);
        back.setOnClickListener(this);
        readAsset(txtName);
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

    public void readAsset(String txtName) {
        try {
            //获取文件中的字节
            InputStream inputStream = getResources().getAssets().open(txtName);
            //将字节转换为字符
            InputStreamReader isReader = new InputStreamReader(inputStream, "UTF-8");
            //使用bufferReader去读取内容
            BufferedReader reader = new BufferedReader(isReader);
            String out = "";
            String outs = "";

            while ((out = reader.readLine()) != null) {
                outs += out;
//                Log.d("读取到的文件信息:", out);
//                Log.e("=====", out + "");
                //   text.setText(out);

            }
            Log.e("=====", outs + "");

            //text.setText(outs);

            text.setText(Html.fromHtml(outs));
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
