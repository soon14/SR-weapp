/**
 *  @author Shirui 2018/03/26
 *  37780012@qq.com
 *  协议
 */
const app = getApp();
Page({
    data: {
        type: null,
        centerServiceProtocol: app.host + '/home/sysnotice/centerServiceProtocol', //商家中心服务协议
        centerAgentProtocol: app.host + '/home/sysnotice/centerAgentProtocol' //会员服务协议
    },
    onLoad: function(options) {
        /**
         * type==1 商家中心服务协议
         * type==2 会员服务协议
         */
        if (options.type == 1) { //商家中心服务协议
            this.setData({
                webViewUrl: this.data.centerServiceProtocol
            })
        } else if (options.type == 2) { //会员服务协议
            this.setData({
                webViewUrl: this.data.centerAgentProtocol
            })
        }
    }
})