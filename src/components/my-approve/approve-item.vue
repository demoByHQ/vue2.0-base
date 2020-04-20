<template>
  <div class="approve-item" @click="click">

    <div v-if="!showSelectImg" @click="repairCard(item)">
      <div class="row">
        <div class="col col-10 col-center">
          <img :src="stateImg" class="select-button"/>
        </div>
        <div class="col col-70 col-center approve-left">
          <div class="row approve-type">{{item.fApplyType | exceptionStatus}}</div>
          <div class="row approve-person">{{item.fApplyerName}}</div>
          <div class="row approve-time" v-if="item.fClassTypeId == '190000002' ||　item.fClassTypeId == '190000003' ">
            {{item.fStartTime}}&nbsp;至&nbsp;{{item.fEndTime}}
          </div>
          <div class="row approve-time" v-if="item.fClassTypeId == '190000001'">{{item.fReissueCardDate}}</div>
        </div>
        <div class="col col-20 col-center approve-right">
        <span v-if="item.fStatus==='通过'">
           <img class="approve-img-type" src="../../assets/images/my-approve/pass@3.png">
        </span>
          <span v-if="item.fStatus==='拒绝'">
           <img class="approve-img-type" src="../../assets/images/my-approve/refuse@3.png">
        </span>
          <img class="approve-img" src="../../assets/images/arrow.png">
        </div>

      </div>
    </div>

    <div v-if="showSelectImg" @click="repairCard(item)">
      <div class="row">
        <div class="col col-80 col-center approve-left">
          <div class="row approve-type">{{item.fApplyType | exceptionStatus}}</div>
          <div class="row approve-person">{{item.fApplyerName}}</div>
          <div class="row approve-time" v-if="item.fClassTypeId == '190000002' ||　item.fClassTypeId == '190000003' ">
            {{item.fStartTime}}&nbsp;至&nbsp;{{item.fEndTime}}
          </div>
          <div class="row approve-time" v-if="item.fClassTypeId == '190000001'">{{item.fReissueCardDate}}</div>
        </div>
        <div class="col col-20 col-center approve-right">
        <span v-if="item.fStatus==='通过'">
           <img class="approve-img-type" src="../../assets/images/my-approve/pass@3.png">
        </span>
          <span v-if="item.fStatus==='拒绝'">
           <img class="approve-img-type" src="../../assets/images/my-approve/refuse@3.png">
        </span>
          <img class="approve-img" src="../../assets/images/arrow.png">
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
    props: ["item", "selected", "showSelectImg"],
    methods: {
      repairCard(item){
        console.log('goTarget.menu:' + JSON.stringify(item));
//        this.$router.push({
//          name: 'outApply',
//          params: {outApplyItem: item}
//        });
      },
      click: function () {
        this.$emit('click');
      }
    },
    computed: {
      stateImg: function () {
        return this.selected ? require('../../assets/images/my-approve/yes@3.png') : require('../../assets/images/my-approve/no@3.png');
      }
    }
  }
</script>
<style>
  .select-button {
    width: 4vw;
    height: 4vw;
  }

  .approve-item {
    padding: 5px 10px;
    background: white;
    margin-top: 10px;
  }

  .approve-left {
    text-align: left;
    font-size: 16px;
    color: #4c4c4c;
    word-wrap: break-word;
  }

  .approve-type {
    color: #0092DA;
    padding: 5px;
  }

  .approve-person {
    color: #999999;
    padding: 2px 5px;
    font-size: 12px;
  }

  .approve-time {
    color: #999999;
    padding: 5px;
    font-size: 12px;
  }

  .approve-right {
    text-align: right;
    font-size: 16px;
    color: #4c4c4c;
    word-wrap: break-word;
  }

  .approve-agree {
    border: 1px solid #FF0000;
    font-size: 12px;
    border-radius: 4px;
    padding: 3px 8px;
    color: #FF0000;
    margin-right: 5px;
  }

  .approve-refuse {
    border: 1px solid #33CC99;
    font-size: 12px;
    border-radius: 4px;
    padding: 3px 8px;
    color: #33CC99;
    margin-right: 5px;
  }

  .approve-img-type {
    vertical-align: middle;
    width: 40px;
    height: 20px;
  }

  .approve-img {
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
