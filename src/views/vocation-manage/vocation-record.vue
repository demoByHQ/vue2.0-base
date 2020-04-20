<template>
  <div class="vocation-record">

    <flexbox :gutter="0" class="box-content" v-for="(item, index) in queryRecordList" :key="index">
      <flexbox-item>
        <div class="desc-item">
          <span class="name">{{item.fApplyType}}</span>
          <span class="status">({{item.fMultiCheckStatus | checkStatus}})</span>
        </div>
        <div class="clock-item">
          <icon type="waiting-circle" class="diy-icon"></icon>
          <span>{{item.fStartTime}} 至 {{item.fEndTime}}</span>
        </div>
      </flexbox-item>

      <flexbox-item :span="2" align="center" class="day-item" v-if="item.applyTime > 0">-{{item.applyTime}}小时
      </flexbox-item>
      <flexbox-item :span="2" align="center" class="day-item-add" v-else>+{{Math.abs(item.applyTime)}}小时</flexbox-item>
    </flexbox>

  </div>
</template>

<script>
  import {
    Flexbox,
    FlexboxItem,
    Icon
  } from 'vux';

  import {
    myApplyQuery
  } from '@/api/vocation';

  export default {
    name: 'VocationRecord',
    data() {
      return {
        queryRecordList: []
      }
    },
    mounted() {
      this.getList();
    },
    methods: {
      getList(status){
        myApplyQuery({
          page: 1,
          pageSize: 10,
          fStatus: "4",
          fApplyType: this.$route.params.leaveType
        }).then(response => {
          if (response.status == '200' && response.data && response.data.rows) {
            for (let i = 0; i < response.data.rows.length; i++) {
              this.queryRecordList.push(response.data.rows[i]);
            }
            if (this.queryRecordList.length == 0) {
              this.$vux.toast.text('暂无数据！', 'middle');
            }
          }
        }).catch(error => {
          console.log(error);
        })
      }
    },
    components: {
      Flexbox,
      FlexboxItem,
      Icon
    }
  }
</script>

<style type="text/scss" lang="scss">
  .vocation-record {
    .box-content {
      background: white;
      margin: 10px 0;
      .desc-item {
        padding-top: 10px;
        .name {
          padding-left: 15px
        }
        .status {
          float: right;
          font-size: smaller;
          color: red;
          margin-right: 10px;
        }
      }
      .clock-item {
        line-height: 40px;
        color: #666;
        font-size: smaller;
        .diy-icon {
          font-size: 16px;
          margin-bottom: 3px;
          padding-left: 12px;
        }
      }
      .day-item {
        font-size: smaller;
        color: red
      }
      .day-item-add {
        font-size: smaller;
        color: #17a9f5;
      }
    }
  }
</style>
