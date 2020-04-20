<template>
  <div class="punch-item">

    <div class="row">
      <div class="col col-70 punch-left">
        <div class="row punch-date-time">
          {{item.fClockTime}}
        </div>
        <div class="row punch-address">
          <img class="punch-img" src="../../assets/images/punch-card/icon@3.1.png"> {{item.fPlace}}
        </div>
      </div>
      <div class="col-10 punch-middle">
        {{item.fClockType | changeStatus}}
      </div>
      <div class="col-20 punch-right" :class="{true: 'normal',false: 'abnormal'}[item.fClockStatus == 'startWork']">
        {{item.fClockStatus}}
      </div>
    </div>

  </div>
</template>

<script type="text/ecmascript-6">
  export default{
    props: ["item"],
    methods: {}
  }
</script>

<style>
  .punch-item {
    padding: 15px;
    background: white;
    margin: 0px 10px 10px;
  }

  .punch-item .punch-date-time {
    padding: 5px;
  }

  .punch-item .punch-img {
    width: 16px;
    height: 16px;
    vertical-align: middle
  }

  .punch-item .punch-address {
    color: #999999;
    padding: 5px 2px;
    font-size: 12px;
  }

  .punch-item .punch-middle {
    margin: auto;
  }

  .punch-item .punch-right {
    margin: auto;
  }

  .punch-item .normal {
    color: #33CC99;
  }

  .punch-item .abnormal {
    color: #FF0000;;
  }

</style>
