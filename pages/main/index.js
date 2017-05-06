// pages/main/index.js
const uploadFileUrl_1 = `https://v1-api.visioncloudapi.com/face/detection`
const uploadFileUrl = `http://127.0.0.1:7959/upload`
const downloadUrl = `http://127.0.0.1:7959/download`
const ctx = wx.createCanvasContext('myCanvas')

Page({
  data: {
    rect: [],
    emotionK: 0,
    emotionV: "",
    obj: {},
    display: false,
    width: 0,
    height: 0
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },

  downloadImage: function () {
    var self = this;


    var rect = JSON.parse(self.data.obj.data).faces[0].rect;
    var emotions = JSON.parse(self.data.obj.data).faces[0].emotions;


    console.log(JSON.parse(self.data.obj.data).faces[0]);
    console.log(JSON.parse(self.data.obj.data).faces[1]);

    var max = -1;
    var maxEmotion = "";
    for (var key in emotions) {
      if (emotions[key] > max) {
        max = emotions[key];
        maxEmotion = key;
      }
    }

    console.log(max);
    console.log(maxEmotion);


    wx.downloadFile({
      url: downloadUrl,
      success: function (res) {
        console.log('downloadFile success, res is', res)

        self.setData({
          imageSrc: res.tempFilePath
        })
      },
      fail: function ({errMsg}) {
        console.log('downloadFile fail, err is:', errMsg)
      }
    })
  },
  chooseImage: function () {
    var self = this

    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album'],
      success: function (res) {
        console.log('chooseImage success, temp path is', res.tempFilePaths[0])

        var imageSrc = res.tempFilePaths[0]

        self.setData({ imageSrc });

        wx.uploadFile({
          url: uploadFileUrl,
          filePath: imageSrc,
          name: 'file',
          success: function (res) {
            self.setData({ obj: res });
            console.log('uploadImage success, res is:', res)

            wx.showToast({
              title: '上传成功',
              icon: 'success',
              duration: 1000
            })

            self.setData({
              imageSrc
            })
          },
          fail: function ({errMsg}) {
            console.log('uploadImage fail, errMsg is', errMsg)
          }
        })

      },
      fail: function ({errMsg}) {
        console.log('chooseImage fail, err is', errMsg)
      }
    })
  }
})