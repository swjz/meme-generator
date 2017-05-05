// pages/main/index.js
const uploadFileUrl = `https://v1-api.visioncloudapi.com/face/detection`
const ctx = wx.createCanvasContext('myCanvas')

Page({
  data: {
    rect: [],
    emotionK: 0,
    emotionV: "",
    obj: {}
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

    wx.request({
      url: 'https://v1-api.visioncloudapi.com/info/api?api_id=f9bf8274b9174a5a852ed309bd960fda&api_secret=37adb7200e724998823919098a8601cb',
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function(res){
        // success
        console.log(res.data)
      },
      fail: function(res) {
        // fail
      },
      complete: function(res) {
        // complete
      }
    })

    // function mHandler() {
    //   for (i = 0; i < 4; ++i) {
    //     self.data.rect[i] = self.data.obj.faces.rect[i];
    //   }
    //   tmpV = self.data.obj.faces.emotions.angry;
    //   tmpK = 'angry';
    //   if (self.data.obj.faces.emotions.calm > tmpV) {
    //     tmpV = self.data.obj.faces.emotions.calm;
    //     tmpK = 'calm';
    //   }
    //   if (self.data.obj.faces.emotions.disgust > tmpV) {
    //     tmpV = self.data.obj.faces.emotions.disgust;
    //     tmpK = 'disgust';
    //   }
    //   if (self.data.obj.faces.emotions.happy > tmpV) {
    //     tmpV = self.data.obj.faces.emotions.happy;
    //     tmpK = 'happy';
    //   }
    //   if (self.data.obj.faces.emotions.sad > tmpV) {
    //     tmpV = self.data.obj.faces.emotions.sad;
    //     tmpK = 'sad';
    //   }
    //   if (self.data.obj.faces.emotions.surprised > tmpV) {
    //     tmpV = self.data.obj.faces.emotions.surprised;
    //     tmpK = 'surprised';
    //   }
    //   if (self.data.obj.faces.emotions.confused > tmpV) {
    //     tmpV = self.data.obj.faces.emotions.confused;
    //     tmpK = 'confused';
    //   }
    //   if (self.data.obj.faces.emotions.squint > tmpV) {
    //     tmpV = self.data.obj.faces.emotions.squint;
    //     tmpK = 'squint';
    //   }
    //   if (self.data.obj.faces.emotions.screaming > tmpV) {
    //     tmpV = self.data.obj.faces.emotions.screaming;
    //     tmpK = 'screaming';
    //   }
    //   if (self.data.obj.faces.emotions.scared > tmpV) {
    //     tmpV = self.data.obj.faces.emotions.scared;
    //     tmpK = 'scared';
    //   }
    //   self.data.emotionV = tmpV;
    //   self.data.emotionK = tmpK;
    // }

    var rect = JSON.parse(self.data.obj.data).faces[0].rect;
    var emotions = JSON.parse(self.data.obj.data).faces[0].emotions;

    console.log(emotions);

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

    // wx.downloadFile({
    //   url: downloadExampleUrl,
    //   success: function(res) {
    //     console.log('downloadFile success, res is', res)

    //     self.setData({
    //       imageSrc: res.tempFilePath
    //     })
    //   },
    //   fail: function({errMsg}) {
    //     console.log('downloadFile fail, err is:', errMsg)
    //   }
    // })
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

        wx.uploadFile({
          url: uploadFileUrl,
          filePath: imageSrc,
          name: 'file',
          formData: {
            'api_id': 'f9bf8274b9174a5a852ed309bd960fda',
            'api_secret': '37adb7200e724998823919098a8601cb',
            'attributes': 1
          },
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