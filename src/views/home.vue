<template>
  <div class="home">

    <base-loading v-if="isLoadingData"></base-loading>

    <div v-if="!isLoadingData">
      <swiper loop auto :list="slideShowList" :index="demo06_index" @on-index-change="demo06_onIndexChange"></swiper>

      <div class="log-name">
        <div class="log-style"></div>
        HR
      </div>

      <grid :cols="4">
        <grid-item v-for="(menu,index) in quickMenuList.quickMenus" :key="index" @on-item-click="goTarget(menu)">
          <img v-if="menu.img" slot="icon" :src="menu.img">
          <br>
          <span v-if="menu.text">  {{menu.text}}</span>
        </grid-item>
      </grid>
    </div>


    <!-- <group>
      <x-input title="手机号码格式化"  v-model="maskValue" :max="13" is-type="china-mobile"></x-input>
    </group>

    <group>
      <x-input title="title" v-model="message"></x-input>
    </group>

    <p ref="msg">{{msg}}</p>

    <button @click="test">翻译</button> -->

  </div>
</template>

<script>
  import {
    Swiper,
    SwiperItem,
    Grid,
    GridItem,
    Group,
    XInput,
  } from 'vux'
  import baseLoading from 'components/base-loading.vue'
  import getBrowserInfo from 'get-browser-info';

  const quickMenuList = (_this) => {
    return {
      'quickMenus': [
        {
          img: require('../assets/images/home/icon@3.1.png'),
          text: '打卡',
          target: 'punchCard',
        },
        {
          img: require('@/assets/images/home/icon@3.2.png'),
          text: '假期管理',
          target: 'vocationManage',
        },
        {
          img: require('@/assets/images/home/icon@3.3.png'),
          text: '我的排班',
          target: 'myScheduling',
        },
        {
          img: require('@/assets/images/home/icon@3.4.png'),
          text: '外出申请',
          target: 'outApply',
        },
        {
          img: require('@/assets/images/home/icon@3.5.png'),
          text: '异常管理',
          target: 'exceptionManage',
        },
        {
          img: require('@/assets/images/home/icon@3.6.png'),
          text: '我的申请',
          target: 'myApply',
        },
        {
          img: require('@/assets/images/home/icon@3.7.png'),
          text: '待我审批',
          target: 'myApprove',
        },
        {
          img: require('@/assets/images/home/icon@3.7.png'),
          text: '翻译',
          target: 'translation',
        },
      ],
    }
  }

  const baseList = [{
    url: 'javascript:',
    img: 'https://ww1.sinaimg.cn/large/663d3650gy1fq66vvsr72j20p00gogo2.jpg',
    title: '送你一朵fua'
  }, {
    url: 'javascript:',
    img: 'https://ww1.sinaimg.cn/large/663d3650gy1fq66vw1k2wj20p00goq7n.jpg',
    title: '送你一辆车'
  }, {
    url: 'javascript:',
    img: 'https://ww1.sinaimg.cn/large/663d3650gy1fq66vw1k2wj20p00goq7n.jpg',
    title: '送你一次旅行',
    fallbackImg: 'https://ww1.sinaimg.cn/large/663d3650gy1fq66vw50iwj20ff0aaaci.jpg'
  }]

  const slideShowList = baseList.map((item, index) => ({
    // url: 'http://m.baidu.com',
    img: item.img,
    // title: `(可点击)${item.title}`
  }))

export default {
    components: {
      Swiper,
      SwiperItem,
      Grid,
      GridItem,
      Group,
      baseLoading,
      XInput,
    },
    name: 'home',
    data () {
      return {
        message: '',
        msg: '1111111111',
        maskValue: '',
        isLoadingData: true,
        quickMenuList: quickMenuList(this),
        slideShowList: slideShowList,
        swiperItemIndex: 1,
        demo06_index: 0,
      }
    },
    methods: {
      onSwiperItemIndexChange (index) {
      },
      demo06_onIndexChange (index) {
        this.demo06_index = index
      },
      goTarget (menu) {
        this.$router.push('/' + menu.target)
      },
      test () {
        console.log('goTarget.menu:' + this.message)
      },
    },
    mounted () {
      this.msg = 'hello'
      this.$nextTick(() => {
        console.log(this.$refs.msg.innerHTML)
      })
      window.localStorage.setItem('applyCheckStatus', '2')
      window.localStorage.setItem('approveCheckStatus', '4')
      const clientInfo = getBrowserInfo() //返回一个信息对象
      
      console.log(clientInfo);

      this.isLoadingData = false
  //   if (window.localStorage.getItem('ACCESS_TOKEN')) {
  //     this.isLoadingData = false;
  //   } else {
  //     let that = this;
  //     // 暂时写死
  //     let loginUrl;
  //     if (window.location.hostname === 'localhost') {
  //       loginUrl = process.env.baseUrl + 'oauth/token?client_id=client&client_secret=secret&grant_type=password&username=16999&password=admin';
  //     } else {
  //       const code = WX_CONFIGS.getCode();
  //       loginUrl = process.env.baseUrl + 'oauth/token?client_id=client&client_secret=secret&grant_type=password&username=' + code + '&password=' + code;
  //     }
  //     let instance = axios.create({
  //       timeout: 30000,
  //       headers: {
  //         'Content-Type': 'application/x-www-form-urlencoded'
  //       }
  //     });
  //     instance.post(loginUrl)
  //       .then(function (response) {
  //         // success callback
  //         if (response && response.data && typeof response.data === 'object' && response.data.access_token) {
  //           window.localStorage.setItem('ACCESS_TOKEN', response.data.access_token);
  //           that.isLoadingData = false;
  //         }
  //       }, function (error) {
  //         //error callback
  //       })
  //       .catch(function (error) {
  //       })
  //   }
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style type="text/scss" scoped>
  .home .log-name {
    text-align: left;
    padding: 10px;
    font-weight: bold;
    background-color: white;
  }

  .home .log-style {
    width: 5px;
    height: 15px;
    background-color: #0094F6;
    float: left;
    margin-right: 5px;
    margin-top: 3px;
  }

  .home .weui-grid {
    text-decoration: none;
  }

  .home .weui-grids {
    background-color: #FFFFFF;
  }

  .home a {
    height: 100px;
    font-size: 13px;
    color: #000000;
  }

  .home .swiper-demo-img img {
    width: 100%;
  }
</style>
