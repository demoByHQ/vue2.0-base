<template>
  <div class="vocation-item">
    <div class="row">
      <div class="col col-20 vocation-img">
        <img width="25px" height="25px" :src="item.img">
      </div>
      <div class="col-80">
        <div class="row vocation-type">
          {{item.leaveName}}
        </div>
        <div class="row vocation-time"
             v-show="item.leaveName==='年假'">
          剩余时长：<span style="color: #FF0000">{{item.baseTime}} 小时</span>
        </div>
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

    }
  }
</script>

<style>
  .vocation-item {
    padding: 10px;
    background: white;
    margin-bottom: 10px;
  }

  .vocation-img {
    padding-top: 15px;
    margin-left: -10px;
  }

  .vocation-type {
    padding: 5px 0px;
  }

  .vocation-time {
    font-size: 13px;
    color: #999999;
    padding: 5px 0px;
  }

</style>
