<template>
  <div class="exception-item">
    <div class="row">
      <div class="col col-80 col-center exception-left">
        <div class="row exception-time">{{item.startDate | getWeek}} ({{item.startDate | getYearMonth}})</div>
        <div class="row exception-reason">{{item.reason}} <span v-if="item.hour!=='0'">{{item.hour}}分钟</span></div>
      </div>
      <div class="col col-20 col-center exception-right" @click="click"
           v-if="item.reason==='缺卡'|| item.reason==='缺下班卡'|| item.reason==='旷工'">
        <img class="exception-item-img" src="../../assets/images/exception-manage/punch-card@3.png">
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default{
    data(){
      return {}
    },
    props: ["item"],
    methods: {
      click: function () {
        this.$emit('click');
      },
    }
  }
</script>
<style>
  .exception-item {
    padding: 15px;
    background: white;
    margin-bottom: 10px;
  }

  .exception-left {
    text-align: left;
    font-size: 16px;
    color: #4c4c4c;
    word-wrap: break-word;
  }

  .exception-time {
    color: #999999;
    padding: 5px;
  }

  .exception-right {
    text-align: right;
    font-size: 16px;
    color: #4c4c4c;
    word-wrap: break-word;
  }

  .exception-reason {
    color: #0092DA;
    padding: 5px;

  }

  .exception-item-img {
    width: 30px;
    height: 30px
  }

</style>
