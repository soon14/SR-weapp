package qiangdan.hemiao.com.qiangdan.bean;

/**
 * Created by bcc on 2018/1/6.
 * "id": 1,
 * "openId": "oZOD20DZCj7uTjp6r6wHLLGSVT6w",
 * "lon": "116.674006",
 * "lat": "35.39821"
 */

public class PostionData {
    private String id;
    private String openId;
    private String lon;
    private String lat;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getOpenId() {
        return openId;
    }

    public void setOpenId(String openId) {
        this.openId = openId;
    }

    public String getLon() {
        return lon;
    }

    public void setLon(String lon) {
        this.lon = lon;
    }

    public String getLat() {
        return lat;
    }

    public void setLat(String lat) {
        this.lat = lat;
    }
}
