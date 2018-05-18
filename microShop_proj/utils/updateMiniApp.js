/*
 * @Author: yangshirui 
 * @email: 37780012@qq.com 
 * @Date: 2018-05-02 19:22:04 
 * @Last Modified by: yangshirui
 * @Last Modified time: 2018-05-03 15:41:19
 */

// 获取全局唯一的版本更新管理器，用于管理小程序更新。
function updateMiniApp() {
  if (wx.getUpdateManager) {
    const updateManager = wx.getUpdateManager();

    updateManager.onCheckForUpdate(function(res) {
      // 请求完新版本信息的回调
      let msg = res.hasUpdate ? "有新的版本" : "没有新的版本";
      console.log("检查是否有新的版本：", msg);

      if (res.hasUpdate) {
        updateManager.onUpdateReady(function() {
          wx.showModal({
            title: "更新提示",
            showCancel: false,
            content: "新版本已经准备好，是否重启应用？",
            success: function(res) {
              if (res.confirm) {
                // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                updateManager.applyUpdate();
              }
            }
          });
        });

        updateManager.onUpdateFailed(function() {
          // 新的版本下载失败
          console.log("新的版本下载失败");
        });
      }
    });
  } else {
    // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
    console.log("当前微信版本过低，请升级到最新微信版本后重试");
  }
}

module.exports = {
  updateMiniApp: updateMiniApp //小程序更新
};
