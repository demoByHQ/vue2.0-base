<template>
  <div class="my-approve">
    <tab>
      <tab-item :selected="selectedOne" @on-item-click="onItemClick">待审批</tab-item>
      <tab-item :selected="selectedTwo" @on-item-click="onItemClick">已审批</tab-item>
    </tab>
    <base-loading v-if="isLoadingData"></base-loading>

    <div v-if="!isLoadingData" :class="{'my-approve-scroller1':bulkImport,'my-approve-scroller2':!bulkImport}">
      <scroller height="100%" :on-infinite="onScrollBottom">
        <approve-list>
          <approve-item v-for="(item, index) in myApproveList" :key="index" :item="item" :showSelectImg="showSelectImg"
                        :selected="selected[index]" @click="selectItem(index)"
                        @click.native="goDetail(item)"></approve-item>
        </approve-list>
      </scroller>
    </div>

    <!--<div v-if="checkStatus === 4">-->
    <!--<img v-if="bulkImport" @click="changeSelect()" class="select-all-img"-->
    <!--src="../../assets/images/my-approve/bulk-import@3.png">-->

    <!--<div v-if="!bulkImport" class="cancel-back" @click="cancel">-->
    <!--取消-->
    <!--</div>-->
    <!--<div v-if="!bulkImport" class="select-all" @click="selectAll">-->
    <!--全选-->
    <!--</div>-->
    <!--</div>-->

    <!--<foot-button v-if="!bulkImport" left-button="驳回" right-button="同意" @leftButtonEvent="refuse"-->
    <!--@rightButtonEvent="agree"></foot-button>-->
  </div>
</template>

<script type="text/ecmascript-6">
  import {
    myExamineQuery
  } from '@/api/my-approve'
  import {
    Tab,
    TabItem,
    Sticky,
    Divider,
    XButton,
    LoadMore
  } from 'vux'
  import baseLoading from 'components/base-loading.vue';
  import approveList from 'components/my-approve/approve-list.vue';
  import approveItem from 'components/my-approve/approve-item.vue';
  import footButton from 'components/out-apply/foot-button.vue';
  import Vue from 'vue'

  export default {
    name: 'myApprove',
    components: {
      Tab,
      TabItem,
      Sticky,
      Divider,
      XButton,
      baseLoading,
      approveList,
      approveItem,
      footButton
    },
    data() {
      return {
        selectedOne: true,
        selectedTwo: false,
        checkStatus: "4", //(2：初始  4：进行中 16：结束  32：中止);
        isLoadingData: true,
        bulkImport: true,
        showSelectImg: true,
        myApproveList: [],
        selected: [],
        onFetching: false,
        page: 1,
        pageSize: 10,
        fStatus: "1",
      }
    },
    mounted() {
      if (window.localStorage.getItem('approveCheckStatus') === '4') {
        this.selectedOne = true;
        this.selectedTwo = false;
        this.checkStatus = window.localStorage.getItem('approveCheckStatus');
        this.getList(1, this.fStatus, window.localStorage.getItem('approveCheckStatus'));
        this.fStatus = "1";
      } else if (window.localStorage.getItem('approveCheckStatus') === '') {
        this.selectedOne = false;
        this.selectedTwo = true;
        this.checkStatus = window.localStorage.getItem('approveCheckStatus');
        this.fStatus = "2";
        this.getList(1, this.fStatus, window.localStorage.getItem('approveCheckStatus'));
      }
    },
    methods: {
      onItemClick(index) {
        startLoading(this);
        switch (index) {
          case 0:
            this.checkStatus = "4";
            this.fStatus = "1";
            this.getList(1, this.fStatus, "4");
            break;
          case 1:
            this.checkStatus = "";
            this.showSelectImg = true;
            this.bulkImport = true;
            this.fStatus = "2";
            this.getList(1, this.fStatus, "");
            break;
        }
        window.localStorage.setItem('approveCheckStatus', this.checkStatus);
      },
      getList(page, fStatus, fMultiCheckStatus, done) {
        //权限数据状态 fStatus (0我参与的,1我待批的，2已审批的，4我的申请 )
        let params;
        if (fMultiCheckStatus) {
          params = {
            "page": page,
            "pagesize": 10,
            "fStatus": fStatus,
            "fMultiCheckStatus": fMultiCheckStatus
          };
        } else {
          params = {
            "page": page,
            "pagesize": 10,
            "fStatus": fStatus,
          };
        }
        myExamineQuery(params).then(response => {
          if (response.data && response.data.rows) {
            this.myApproveList = response.data.rows.map(function (item, index) {
              item.img = require("../../assets/images/my-approve/no@3.png");
              return item;
            });
            //延缓loading图标隐藏的时间
            setTimeout(() => {
              done && done()
            }, 2000);
            if (response.data.rows.length <= response.data.total) {
              this.onFetching = true;
            }
          } else {
            this.myApproveList = [];
          }
          closeLoading(this);
        }).catch(error => {
          this.onFetching = false;
          closeLoading(this);
        })
      },
      selectItem(index) {
        Vue.set(this.selected, index, !this.selected[index]);
      },
      changeSelect() {
        this.bulkImport = false;
        this.showSelectImg = false;
      },
      cancel() {
        this.bulkImport = true;
        this.showSelectImg = true;
        for (let i = 0; i < this.myApproveList.length; i++) {
          Vue.set(this.selected, i, false);
        }
      },
      //全选
      selectAll() {
        for (let i = 0; i < this.myApproveList.length; i++) {
          Vue.set(this.selected, i, true);
        }
      },
      refuse() {
      },
      agree() {
      },
      onScrollBottom(done) {
        if (this.onFetching) {
          // 没有数据时候延迟显示
          setTimeout(() => {
            done(true)
          }, 500);
        } else {
          this.page++;
          this.getList(this.checkStatus, this.page, done);
        }
      },
      //查看详情
      goDetail(item) {
        if (item.fClassTypeId === "190000001") {//异常申请
          this.$router.push({
            name: 'exceptionApply',
            params: {'fStatus': this.fStatus, 'id': this.checkStatus, 'exceptionApply': item}
          });
        } else if (item.fClassTypeId === "190000002") {//出差外出申请
          this.$router.push({
            name: 'outApply',
            params: {'fStatus': this.fStatus, 'id': this.checkStatus, 'outApply': item}
          });
        } else {//vocation申请
          this.$router.push({
            name: 'vocationDetail',
            params: {'fStatus': this.fStatus, 'id': this.checkStatus, 'vocationApply': item}
          });
        }
      },
    },
  }

  //开
  function startLoading(_self) {
    _self.isLoadingData = true;
    _self.onFetching = false;
    _self.page = 1;
    _self.myApproveList = [];
  }

  //关
  function closeLoading(_self) {
    _self.isLoadingData = false;
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style type="text/scss" lang="scss" rel="stylesheet/scss">
  .my-approve-scroller1 {
    background: #F1F6F9;
    position: absolute;
    top: 45px;
    bottom: 0px;
    width: 100%;
  }

  .my-approve-scroller2 {
    background: #F1F6F9;
    position: absolute;
    top: 50px;
    bottom: 100px;
    width: 99%;
  }

  .vux-tab .vux-tab-item.vux-tab-selected {
    color: #0092DA !important;
    border-bottom: 3px solid #0092DA;
  }

  .vux-tab-ink-bar-transition-backward {
    background-color: #0092DA !important;
    transition: right 0.3s cubic-bezier(0.35, 0, 0.25, 1) 0.09s, left 0.3s cubic-bezier(0.35, 0, 0.25, 1);
  }

  .vux-tab-ink-bar {
    position: absolute;
    height: 2px;
    bottom: 0;
    left: 0;
    background-color: #0092DA !important;
    text-align: center;
  }

  .select-all-img {
    position: fixed;
    z-index: 111;
    bottom: 30px;
    left: 50%;
    margin-left: -25px;
    width: 50px;
    height: 50px;
  }

  .cancel-back {
    height: 20px;
    position: fixed;
    z-index: 8;
    bottom: 60px;
    left: 30px;
    text-align: left;
    color: #0092da
  }

  .select-all {
    height: 20px;
    position: fixed;
    z-index: 8;
    bottom: 60px;
    right: 30px;
    text-align: right;
    color: #0092da
  }
</style>
