package qiangdan.hemiao.com.qiangdan.bean;

/**
 * Created by bcc on 2017/12/25.
 */

public class OrderDetail extends Msg {
    private Order data;

    public Order getData() {
        return data;
    }

    public void setData(Order data) {
        this.data = data;
    }
}
