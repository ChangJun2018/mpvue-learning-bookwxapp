// 工具函数库

import config from './config'

// get请求
export function get(url,data) {
  return request(url,'GET',data);
}

// post请求
export function post(url,data){
  return request(url,'POST',data);
}

function request(url,method,data){
  return new Promise((reslove, reject) => {
    wx.request({
      data,
      method,
      url: config.host + url,
      success: function (res) {
        if (res.data.code == 0) {
          reslove(res.data.data)
        } else {
          showModal('添加失败',res.data.data.msg)
          reject(res.data)
        }
      }
    })
  })
}

export function showModal(title,content){
  wx.showModal({
    title,
    content,
    showCancel:false
  })
}

// showSuccess
export function showSuccess(text) {
  wx.showToast({
    title: text,
    icon: "success",
    duration: 3000
  })
}
