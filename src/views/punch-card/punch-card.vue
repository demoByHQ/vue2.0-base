<template>
  <div :class="{'punchCard-left':!isPunchHistory,'punchCard-right':isPunchHistory}">

    <button-tab class="punch-tab" v-model="select">
      <button-tab-item @on-item-click="consoleIndex()">打卡</button-tab-item>
      <button-tab-item @on-item-click="consoleIndex()">打卡记录</button-tab-item>
    </button-tab>

    <div class="punch-content" v-if="!isPunchHistory">
      <div class="row punch-line-first">
        <div class="col">
          <img v-if="signInNum!==0" @click="signIn()" class="punch-line-img"
               src="../../assets/images/punch-card/active.png">
          <img v-if="signInNum===0" @click="signIn()" class="punch-line-img"
               src="../../assets/images/punch-card/noActive.png">
        </div>
        <div class="col">
          <img v-if="signOutNum!==0" @click="signOut()" class="punch-line-img"
               src="../../assets/images/punch-card/active.png">
          <img v-if="signOutNum===0" @click="signOut()" class="punch-line-img"
               src="../../assets/images/punch-card/noActive.png">
        </div>
      </div>

      <div class="row punch-line">
        <div class="col">
          <div class="row">
            <div v-if="signInNum!==1" style="margin: auto;padding: 10px">
              <img class="punch-img" src="../../assets/images/punch-card/icon@3.3.png">
              <span style="color: #33CC99;">今日已打卡</span>
            </div>
            <div v-if="signInNum===1" style="margin: auto;padding: 10px">
              <img class="punch-img" src="../../assets/images/punch-card/icon@3.4.png">
              上班打卡
            </div>
          </div>
          <div class="row">
            <div class="col">
              剩余<span :class="{true: 'punch-abnormal',false: 'punch-normal'}[signInNum == 0]">
              {{signInNum}}</span>次
            </div>
          </div>
        </div>
        <div class="col">
          <div class="row">
            <div v-if="signOutNum!==1" style="margin: auto;padding: 10px">
              <img class="punch-img" src="../../assets/images/punch-card/icon@3.3.png">
              <span style="color: #33CC99;">今日已打卡</span>
            </div>
            <div v-if="signOutNum===1" style="margin: auto;padding: 10px">
              <img class="punch-img" src="../../assets/images/punch-card/icon@3.4.png">
              下班打卡
            </div>
          </div>
          <div class="row">
            <div class="col">
              剩余<span :class="{true: 'punch-abnormal',false: 'punch-normal'}[signOutNum == 0]">
              {{signOutNum}}</span>次
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="punch-today" v-if="!isPunchHistory" v-for="item in punchToday">
      {{item.fClockType | changeStatus}}：{{item.fClockTime}}
    </div>

    <div class="punch-history" v-if="isPunchHistory"
         style="background: #F1F6F9; position: absolute;top: 66px; bottom: 0px; width: 100%;left: 0px">
      <scroller>
        <punch-list>
          <punch-item v-for="(item ,index) in punchCardHistory" :key="index" :item="item"></punch-item>
        </punch-list>
      </scroller>
    </div>

  </div>
</template>

<script>

  import WX_CONFIGS from '@/utils/wx-config'
  import {formatDateTime, getNowFormatDate} from '@/utils/common'
  import {fclockinfoQuery, checkClockByPlace, clockTime} from '@/api/punch-card'
  import {ButtonTab, ButtonTabItem, Divider, Loading} from 'vux'
  import baseLoading from 'components/base-loading.vue';
  import punchItem from 'components/punch-card/punch-item.vue';
  import punchList from 'components/punch-card/punch-list.vue';

  export default {
    name: 'punchCard',
    components: {
      formatDateTime, ButtonTab, ButtonTabItem, Divider, baseLoading, punchItem, punchList, Loading
    },
    data () {
      return {
        select: 0,
        signInNum: 1,//上班次数
        signOutNum: 1,//下班次数
        isPunchHistory: false,//打卡历史记录
        isSignIn: false,
        isSignOut: false,
        punchToday: [],//今日打卡记录
        punchCardHistory: [],//打卡历史记录列表
        punchCardLoading: false,
      }
    },
    mounted(){
      WX_CONFIGS.wxConfig(window.location.href.split('#')[0], ['getLocation']);
      this.$wechat.ready(() => {
        console.log('config success');
      });
      this.$wechat.error((err) => {
        console.log(err);
      });
      this.getClockTime("");
    },
    methods: {
      //选择打卡 or 打卡记录
      consoleIndex () {
        switch (this.select) {
          case 0:
            this.isPunchHistory = false;
            this.getClockTime("");
            break;
          case 1:
            this.isPunchHistory = true;
            this.getPunchList();
            break;
        }
        //(!!this.select || (this.isPunchHistory = false)) && (this.isPunchHistory = true) && (this.getPunchList());
      },
      //获取打卡次数
      getClockTime(param){
        if (param === "") {
          this.signInNum = 1;
          this.signOutNum = 1;
        } else if (param === 'startWork') {
          this.signInNum = 1;
        } else if (param === 'offWork') {
          this.signOutNum = 1;
        }
        clockTime({"fEmpId": "ASTOR"}).then(response => {
          if (response.data.success) {
            this.punchToday = response.data.rows;
            for (var value of response.data.rows) {
              if (param === "") {
                if (value.fClockType === 'startWork') {
                  this.isSignIn = true;
                  this.signInNum--;
                } else if (value.fClockType === 'offWork') {
                  this.isSignOut = true;
                  this.signOutNum--;
                }
              } else {
                if (value.fClockType === 'startWork' && param === 'startWork') {
                  this.signInNum--;
                } else if (value.fClockType === 'offWork' && param === 'offWork') {
                  this.signOutNum--;
                }
              }
            }
          } else {

          }
        }).catch(error => {
          console.log(error);
        })
      },

      //获取打卡历史记录
      getPunchList(){
        fclockinfoQuery({"fEmpId": "ASTOR"}).then(response => {
          if (response.data.success) {
            this.punchCardHistory = response.data.rows;
          }
        }).catch(error => {
          console.log(error.response);
        });
      },

      //获取经纬度打卡
      startPunchCard(type){
        let _this = this;
        this.$wechat.getLocation({
          type: 'wgs84', // gps坐标
          success: function (res) {
            let latitude = res.latitude;
            let longitude = res.longitude;
            let params = {
              "fEmpId": "ASTOR",
              "fLongitude": longitude,
              "fLatitude": latitude,
              "fClockType": type,
              "fClockTime": getNowFormatDate()
            };
            checkClockByPlace(params).then(response => {
              _this.punchCardLoading = false;
              _this.$vux.loading.hide();
              if (response.data.success) {
                _this.getClockTime(type);
                _this.$vux.toast.text('打卡成功', 'middle');
              } else {
                _this.$vux.toast.text(response.data.message, 'middle');
              }
            }).catch(error => {
              console.log(error);
              _this.$vux.loading.hide();
              _this.$vux.toast.text('打卡失败', 'middle');
            });
          }
        });
      },
      //签到
      signIn(){
        this.punchCardLoading = true;
        if (this.signInNum === 0) {
          return;
        } else {
          this.$vux.loading.show({
            text: '打卡中'
          });
          this.startPunchCard('startWork');
        }
      },
      //签退
      signOut(){
        this.punchCardLoading = true;
        if (this.signOutNum === 0) {
          return;
        } else {
          this.$vux.loading.show({
            text: '打卡中'
          });
          this.startPunchCard('offWork');
        }
      }
    }
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style type="text/scss" scoped>

  .punchCard-left {
    padding: 10px;
    background-color: #FFFFFF;
  }

  .punchCard-right {
    padding: 10px;
  }

  .punch-tab {
    margin: 10px 30px 20px;
  }

  .punch-content {
    margin-bottom: 20px;
  }

  .punch-line-first {
    margin-top: 60px
  }

  .punch-line {
    margin-top: 30px
  }

  .punch-line-img {
    width: 65px;
    height: 60px;
  }

  .punch-img {
    width: 20px;
    height: 20px;
    vertical-align: middle;
    margin-top: -5px;
  }

  .punch-normal {
    color: #33CC99;
    margin-right: 5px;
  }

  .punch-abnormal {
    color: #FF0000;
    margin-right: 5px;
  }

  .punch-today {
    margin: 20px -10px -20px;
    text-align: left;
    background-color: #F1F6F9;
    padding: 10px 20px 10px;
  }

  .vux-button-group > a.vux-button-tab-item-first:after {
    content: " ";
    position: absolute;
    left: 0;
    top: 0;
    width: 200%;
    height: 1px;
    border: 1px solid #0092DA;
    color: #0092DA;
    height: 200%;
    -webkit-transform-origin: left top;
    transform-origin: left top;
    -webkit-transform: scale(0.5);
    transform: scale(0.5);
    border-top-left-radius: 32px;
    border-bottom-left-radius: 32px;
  }

  .vux-button-group > a.vux-button-tab-item-last:after {
    content: " ";
    position: absolute;
    left: 0;
    top: 0;
    width: 200%;
    height: 1px;
    border-right: 1px solid #0092DA;
    border-top: 1px solid #0092DA;
    border-bottom: 1px solid #0092DA;
    border-left: none;
    color: #0092DA;
    height: 200%;
    -webkit-transform-origin: left top;
    transform-origin: left top;
    -webkit-transform: scale(0.5);
    transform: scale(0.5);
    border-top-right-radius: 32px;
    border-bottom-right-radius: 32px;
  }

  .vux-button-group > a.vux-button-tab-item-first {
    color: #0092DA;
    text-decoration: none;
    border-top-left-radius: 32px;
    border-bottom-left-radius: 32px;
  }

  .vux-button-group > a.vux-button-tab-item-last {
    color: #0092DA;
    text-decoration: none;
    border-top-right-radius: 32px;
    border-bottom-right-radius: 32px;
  }

  .vux-button-group > a.vux-button-group-current {
    text-decoration: none;
    color: #FFF;
    background: #0092DA;
  }

</style>
