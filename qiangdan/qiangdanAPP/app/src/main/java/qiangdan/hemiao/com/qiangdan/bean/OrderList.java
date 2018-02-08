package qiangdan.hemiao.com.qiangdan.bean;

import java.util.List;

/**
 * Created by bcc on 2017/12/17.
 */

public class OrderList extends Msg {
    private List<Order> data;

    public List<Order> getData() {
        return data;
    }

    public void setData(List<Order> data) {
        this.data = data;
    }
}
