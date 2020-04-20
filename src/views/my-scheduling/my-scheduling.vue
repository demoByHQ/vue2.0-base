<template>
  <div class="my-scheduling">

    <div class="row my-scheduling-header">
      <div class="col col-10" @click="editWeek('minus')">
        <img width="16px" height="16px" src="../../assets/images/my-scheduling/left@3.png">
      </div>
      <div class="col col-80"> {{startMonday}} &nbsp;&nbsp; 至 &nbsp;&nbsp; {{endSunday}}</div>
      <div class="col col-10" @click="editWeek('add')">
        <img width="16px" height="16px" src="../../assets/images/my-scheduling/right@3.png">
      </div>
    </div>

    <base-loading v-if="isLoadingData"></base-loading>

    <div v-if="!isLoadingData" class="my-scheduling-scroller">
      <scroller v-show="mySchedulingList">
        <schedulingList>
          <schedulingItem :item="item" v-for="(item, index) in mySchedulingList" :key="index">
          </schedulingItem>
        </schedulingList>
      </scroller>
      <div v-show="!isSchedulingList" style="margin-top: 40px">
        <img width="40%" src="../../assets/images/nothing.png">
        <div class="text-center reminder-text">无排班记录！</div>
      </div>
    </div>

  </div>
</template>

<script type="text/ecmascript-6">
  import schedulingList from 'components/my-scheduling/scheduling-list.vue';
  import schedulingItem from 'components/my-scheduling/scheduling-item.vue';
  import baseLoading from 'components/base-loading.vue';
  import {
    schedulingQuery
  } from '@/api/my-scheduling';

  let i = 0;

  export default {
    name: 'myScheduling',
    components: {
      schedulingList,
      schedulingItem,
      baseLoading,
    },
    data() {
      return {
        items: [],
        scrollTop: 0,
        startMonday: "",
        endSunday: "",
        mySchedulingList: [],
        isLoadingData: true,
        isSchedulingList: false,//是否有排班记录  false显示提示图片
      }
    },
    created() {
      let now = new Date();
      let nowTime = now.getTime();
      let day = now.getDay();
      let oneDayTime = 24 * 60 * 60 * 1000;
      //显示周一
      let MondayTime = nowTime - (day - 1) * oneDayTime;
      //显示周日
      let SundayTime = nowTime + (7 - day) * oneDayTime;
      //初始化日期时间
      let startMonday = new Date(MondayTime);
      let endSunday = new Date(SundayTime);
      //打印查看结果
      console.log(this.formatDate(startMonday));
      console.log(this.formatDate(endSunday));
      this.startMonday = this.formatDate(startMonday);
      this.endSunday = this.formatDate(endSunday);
      let params = {
        "startDate": this.startMonday + " 00:00:00",
        "endDate": this.endSunday + " 23:59:00"
      };
      this.isLoadingData = true;
      this.getMySchedulingList(params);
    },
    mounted() {

    },
    methods: {
      //时间转换
      formatDate(date) {
        let year = date.getFullYear() + '-';
        let month = (date.getMonth() + 1);
        let day = date.getDate();
        let week = '(' + ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'][date.getDay()] + ')';
        return year + (month < 10 ? '0' + month : '' + month) + '-' + (day < 10 ? '0' + day : '' + day);
      },
      //获取排班记录
      getMySchedulingList(params) {
        schedulingQuery(params).then(response => {
          console.log(JSON.stringify(response));
          if (response.data.success) {
            this.mySchedulingList = response.data.rows;
            if (response.data.total === 0) {
              this.isSchedulingList = false;//提示无排班
              this.isLoadingData = false;
            } else {
              this.isSchedulingList = true;
              this.isLoadingData = false;
            }
          } else {
            this.mySchedulingList = [];
            this.isLoadingData = false;
          }
        }).catch(error => {
          console.log(error);
          this.$vux.toast.text("登陆超时，请重新登录", 'middle');
          this.isLoadingData = false;
        });
      },
      editWeek(param) {
        if (param === 'minus') {
          i = i - 1;
        } else {
          i = i + 1;
        }
        let now = new Date();
        let nowTime = now.getTime();
        let day = now.getDay();
        let oneDayTime = 24 * 60 * 60 * 1000;
        //显示周一
        let MondayTime = nowTime - (day - 1) * oneDayTime + 7 * (i) * oneDayTime;
        //显示周日
        let SundayTime = nowTime + (7 - day) * oneDayTime + 7 * (i) * oneDayTime;
        //初始化日期时间
        let startMonday = new Date(MondayTime);
        let endSunday = new Date(SundayTime);
        //打印查看结果
        console.log(this.formatDate(startMonday));
        console.log(this.formatDate(endSunday));
        this.startMonday = this.formatDate(startMonday);
        this.endSunday = this.formatDate(endSunday);
        let params = {
          "startDate": this.startMonday + " 00:00:00",
          "endDate": this.endSunday + " 23:59:00",
        };
        this.isLoadingData = true;
        this.getMySchedulingList(params);
      },
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style type="text/scss">
  .my-scheduling {
    position: absolute;
    width: 100%;
    height: 100%;
  }

  .my-scheduling-header {
    background: white;
    border-bottom: 1px solid #ececec;
    height: 40px;
    position: absolute;
    z-index: 11;
    align-items: center;
  }

  .my-scheduling-header img {
    vertical-align: middle;
  }

  .my-scheduling-scroller {
    background: #F1F6F9;
    position: absolute;
    top: 40px;
    bottom: 0px;
    width: 100%;
    padding: 10px 0px;
    left: 0px;
  }

  .my-scheduling-scroller .reminder-text {
    margin-top: 8%;
    font-size: 18px;
  }
</style>
