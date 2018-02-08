package qiangdan.hemiao.com.qiangdan.bean;

import java.util.List;

/**
 * Created by bcc on 2018/1/1.
 */

public class TiMoneyList extends Msg {
    private List<TiMoney> data;

    public List<TiMoney> getData() {
        return data;
    }

    public void setData(List<TiMoney> data) {
        this.data = data;
    }
}
