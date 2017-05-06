// pages/main/index.js
const uploadFileUrl_1 = `https://v1-api.visioncloudapi.com/face/detection`
const uploadFileUrl = `http://127.0.0.1:7959/upload`
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
    var tmpFilePath = this.data.imageSrc;
    var width;
    var height;

    // wx.request({
    //   url: 'https://v1-api.visioncloudapi.com/info/api?api_id=f9bf8274b9174a5a852ed309bd960fda&api_secret=37adb7200e724998823919098a8601cb',
    //   data: {},
    //   method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    //   // header: {}, // 设置请求的 header
    //   success: function(res){
    //     // success
    //     console.log(res.data)
    //     console.log(typeof(res.data))
    //   }
    // })

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

    wx.getImageInfo({
      src:tmpFilePath,
      success:function(res){
        console.log("width!: "+res.width);
        var width = res.width;
        var height = res.height;
      }
    })

    self.setData({
      display: true,
      width: width,
      height: height
    })
    
    console.log(self.data.display);
    console.log("width: "+width);
    console.log("height: "+height);

    const ctx = wx.createCanvasContext('mCanvas');
    ctx.drawImage(tmpFilePath, 0, 0, width, height);
    ctx.draw();
    ctx.setFontSize(14);//设置字号
    if((rect[0]+rect[2]) < width){
      var w1 = rect[2];//在中线左侧/认为右边地方大
    }
    else{
      var w1 = rect[0];
    }
    if((rect[1]+rect[3]) < height){
      var w2 = rect[3];//在中线上侧/认为下面地方大
    }else{
      var w2 = rect[1];
    }
    ctx.fillText("theWords", w1+20, w2+20);//写文字
    
    //保存图片
    wx.canvasToTempFilePath({
      canvasId:'mCanvas',
      success:function (res) {
        console.log(res.tempFilePath);
      }
    })


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

        self.setData({imageSrc});

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