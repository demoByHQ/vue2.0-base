<template>
  <div class="two-item">
    <div class="row date-time">
      {{item.startDate | getWeek}} &nbsp; ({{item.startDate | getDate}})
    </div>
    <div class="row two-time">
      {{item.startDate | getTime}}~{{item.endDate | getTime}}
      <span v-if="item.amountInTime!=='0'">&nbsp;&nbsp;{{item.applyType}} {{item.amountInTime}}小时</span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default{
    data(){
      return {}
    },
    props: ["item"],
    methods: {}
  }
</script>

<style>
  .two-item {
    background: white;
    margin-bottom: 10px;
    padding: 10px 10px;
  }

  .date-time {
    color: #999999;
    padding: 5px;
  }

  .two-time {
    color: #0092DA;
    padding: 5px;
  }

</style>
