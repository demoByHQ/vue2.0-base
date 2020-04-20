<template>
  <div class="apply-item">
    <div class="row">
      <div class="col col-80 col-center approve-left">
        <div class="row apply-type">{{item.fApplyType | exceptionStatus}}</div>
        <div class="row apply-time" v-if="item.fClassTypeId == '190000002' ||　item.fClassTypeId == '190000003' ">{{item.fStartTime}}&nbsp;至&nbsp;{{item.fEndTime}}</div>
        <div class="row apply-time" v-if="item.fClassTypeId == '190000001'">{{item.fReissueCardDate}}</div>
      </div>
      <div class="col col-20 col-center apply-right">
        <!--<span v-if="item.fMultiCheckStatus == '2' && item.fStatus === '编辑中'">-->
        <!--<img class="apply-img-status" src="../../assets/images/my-apply/edit@3.png">-->
        <!--</span>-->
        <span v-if="item.fMultiCheckStatus == '2'">
               <img class="apply-img-status" src="../../assets/images/my-apply/save@3.png">
            </span>

        <span v-if="item.fMultiCheckStatus == '16'">
              <img class="apply-img-type" src="../../assets/images/my-approve/pass@3.png">
            </span>
        <span v-if="item.fMultiCheckStatus == '32'">
              <img class="apply-img-type" src="../../assets/images/my-approve/refuse@3.png">
            </span>

        <img class="apply-img" src="../../assets/images/arrow.png">
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data() {
      return {}
    },
    props: ["item"],
    methods: {}
  }
</script>

<style>
  .apply-item {
    padding: 5px 10px;
    background: white;
    margin-bottom: 10px;
  }

  .apply-left {
    text-align: left;
    font-size: 16px;
    color: #4c4c4c;
    word-wrap: break-word;
  }

  .apply-type {
    color: #0092DA;
    padding: 5px;
  }

  .apply-time {
    color: #999999;
    padding: 5px;
    font-size: 12px;
  }

  .apply-right {
    text-align: right;
    font-size: 16px;
    color: #4c4c4c;
    word-wrap: break-word;
  }

  .apply-img-status {
    vertical-align: middle;
    width: 40px;
    height: 40px;
  }

  .apply-img-type {
    vertical-align: middle;
    width: 40px;
    height: 20px;
  }

  .apply-edit {
    border: 1px solid #FF3300;
    font-size: 12px;
    border-radius: 4px;
    padding: 3px 8px;
    color: #FF3300;
    margin-right: 5px;
  }

  .apply-save {
    border: 1px solid #33CC99;
    font-size: 12px;
    border-radius: 4px;
    padding: 3px 8px;
    color: #33CC99;
    margin-right: 5px;
  }

  .apply-agree {
    border: 1px solid #FF3300;
    font-size: 12px;
    border-radius: 4px;
    padding: 3px 8px;
    color: #FF3300;
    margin-right: 5px;
  }

  .apply-refuse {
    border: 1px solid #33CC99;
    font-size: 12px;
    border-radius: 4px;
    padding: 3px 8px;
    color: #33CC99;
    margin-right: 5px;
  }

  .apply-img {
    vertical-align: middle
  }

  .vux-tab .vux-tab-item.vux-tab-selected {
    color: #0092DA;
    border-bottom: 3px solid #0092DA;
  }

  .vux-tab-ink-bar {
    position: absolute;
    height: 2px;
    bottom: 0;
    left: 0;
    background-color: #0092DA;
    text-align: center;
  }
</style>
