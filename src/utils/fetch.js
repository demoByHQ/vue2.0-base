import axios from 'axios'
import router from './../router'
import WX_CONFIGS from './wx-config'

export function fetch (options) {
  return new Promise((resolve, reject) => {
    const instance = axios.create({
      timeout: 80000, // 超时
      baseURL: process.env.baseUrl,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        // 'Authorization': 'bearer ' + window.localStorage.getItem('ACCESS_TOKEN'),
      },
    })
    instance(options).then(response => {
      const res = response
      resolve(res)
    }).catch(error => {
      console.log(JSON.stringify(error.response)) // for debug
      switch (error.response.status) {
        case 401:
          window.localStorage.setItem('ACCESS_TOKEN', '')
          router.replace({ // 跳转到登录页面
            path: '/',
          })
      }
      // if (error.response.data.error === 'invalid_token') {
      //   let loginUrl;
      //   if (window.location.hostname === 'localhost') {
      //     loginUrl = process.env.baseUrl + 'oauth/token?client_id=client&client_secret=secret&grant_type=password&username=12229&password=admin';
      //   } else {
      //     const code = WX_CONFIGS.getCode();
      //     loginUrl = process.env.baseUrl + 'oauth/token?client_id=client&client_secret=secret&grant_type=password&username=' + code + '&password=' + code;
      //   }
      //   let instance = axios.create({
      //     timeout: 20000,
      //     headers: {
      //       'Content-Type': 'application/x-www-form-urlencoded'
      //     }
      //   });
      //   instance.post(loginUrl).then(function (response) {
      //     // success callback
      //     if (response && response.data && typeof response.data === 'object' && response.data.access_token) {
      //       window.localStorage.setItem('ACCESS_TOKEN', response.data.access_token);
      //       //window.location.reload();
      //     }
      //   }, function (error) {
      //     //error callback
      //   }).catch(function (error) {
      //     //error
      //   })
      // }
      reject(error)
    })
  })
}
