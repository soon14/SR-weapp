package qiangdan.hemiao.com.qiangdan.bean;

/**
 * Created by bcc on 2017/12/17.
 */

public class Order {

    private String id;
    private String orderid;
    private String ji_address;
    private String ji_name;
    private String ji_tel;

    private String shou_address;
    private String shou_tel;
    private String goodsname;
    private String payprice;//价格
    private String gl;
    private String zl;
    private String time;
    private String shou_name;
    private String order_status;
    private String shou_lon;
    private String shou_lat;
    private String ji_lon;
    private String ji_lat;
    private String remark;

    public String getJi_name() {
        return ji_name;
    }

    public void setJi_name(String ji_name) {
        this.ji_name = ji_name;
    }

    public String getJi_tel() {
        return ji_tel;
    }

    public void setJi_tel(String ji_tel) {
        this.ji_tel = ji_tel;
    }

    public String getShou_tel() {
        return shou_tel;
    }

    public void setShou_tel(String shou_tel) {
        this.shou_tel = shou_tel;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

    public String getShou_lon() {
        return shou_lon;
    }

    public void setShou_lon(String shou_lon) {
        this.shou_lon = shou_lon;
    }

    public String getShou_lat() {
        return shou_lat;
    }

    public void setShou_lat(String shou_lat) {
        this.shou_lat = shou_lat;
    }

    public String getJi_lon() {
        return ji_lon;
    }

    public void setJi_lon(String ji_lon) {
        this.ji_lon = ji_lon;
    }

    public String getJi_lat() {
        return ji_lat;
    }

    public void setJi_lat(String ji_lat) {
        this.ji_lat = ji_lat;
    }

    public String getOrder_status() {
        return order_status;
    }

    public void setOrder_status(String order_status) {
        this.order_status = order_status;
    }

    public String getShou_name() {
        return shou_name;
    }

    public void setShou_name(String shou_name) {
        this.shou_name = shou_name;
    }

    public String getOrderid() {
        return orderid;
    }

    public void setOrderid(String orderid) {
        this.orderid = orderid;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getJi_address() {
        return ji_address;
    }

    public void setJi_address(String ji_address) {
        this.ji_address = ji_address;
    }

    public String getShou_address() {
        return shou_address;
    }

    public void setShou_address(String shou_address) {
        this.shou_address = shou_address;
    }

    public String getGoodsname() {
        return goodsname;
    }

    public void setGoodsname(String goodsname) {
        this.goodsname = goodsname;
    }

    public String getPayprice() {
        return payprice;
    }

    public void setPayprice(String payprice) {
        this.payprice = payprice;
    }

    public String getGl() {
        return gl;
    }

    public void setGl(String gl) {
        this.gl = gl;
    }

    public String getZl() {
        return zl;
    }

    public void setZl(String zl) {
        this.zl = zl;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }
}
