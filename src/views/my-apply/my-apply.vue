<template>
  <div class="my-apply">
    <tab>
      <tab-item :selected="selectedOne" @on-item-click="onItemClick">待提交</tab-item>
      <tab-item :selected="selectedTwo" @on-item-click="onItemClick">审批中</tab-item>
      <tab-item :selected="selectedThree" @on-item-click="onItemClick">已审批</tab-item>
    </tab>

    <base-loading v-if="isLoadingData"></base-loading>

    <div v-if="!isLoadingData">
      <div class="my-apply-scroller">
        <scroller height="100%" :on-infinite="onScrollBottom">
          <apply-list>
            <apply-item v-for="(item, index) in myApplyList" :key="index" :item="item"
                        @click.native="goDetail(item)"></apply-item>
          </apply-list>
        </scroller>
      </div>

      <!--<img @click="screen()" class="screen-img" v-model="showModel" src="../../assets/images/my-apply/screen@3.png">-->

      <div v-transfer-dom>
        <popup class="apply-model" v-model="showModel" position="bottom">
          <div class="title">
            <grid>
              <grid-item class="model-head" @click.native="cancelModel">
                取消
              </grid-item>
              <grid-item class="model-head center" @click.native="emptySelect">
                清空筛选
              </grid-item>
              <grid-item class="model-head right" @click.native="confirmModel">
                确定
              </grid-item>
            </grid>
          </div>

          <scroller ref="scrollerLeft" class="scroll-left">
            <div class="item">
              请假类型
            </div>
          </scroller>

          <scroller ref="scrollerRight" class="scroll-right">
            <div class="row item" :class="{'end-item': index == vocationType.length - 1}"
                 v-for="(item, index) in vocationType" @click="select(item, index)">
              <div class="name" :class="{'end-item-name': index == vocationType.length - 1}">
                {{item.leaveName}}
              </div>
              <div v-if="!item.status" class="select-img">
                <img width="20px" height="20px" src="../../assets/images/my-apply/noSelect@3.png"/>
              </div>
              <div v-if="item.status" class="select-img">
                <img width="20px" height="20px" src="../../assets/images/my-apply/select@3.png"/>
              </div>
            </div>
          </scroller>
        </popup>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    myApplyQuery,
    vocationAll
  } from '@/api/my-apply';

  import {
    TransferDom,
    Tab,
    TabItem,
    Group,
    Cell,
    Popup,
    Grid,
    GridItem
  } from 'vux';

  import baseLoading from 'components/base-loading.vue';
  import applyList from 'components/my-apply/apply-list.vue';
  import applyItem from 'components/my-apply/apply-item.vue';

  export default {
    name: 'myApply',
    directives: {
      TransferDom
    },
    components: {
      baseLoading,
      applyList,
      applyItem,
      Tab,
      TabItem,
      Group,
      Cell,
      Popup,
      Grid,
      GridItem
    },
    data() {
      return {
        selectedOne: true,
        selectedTwo: false,
        selectedThree: false,
        labelPosition: 'left',
        commonList: ['China', '1221'],
        checklist001: [],
        checkStatus: '2', //(2：初始  4：进行中 16：结束  32：中止);
        showModel: false,
        isLoadingData: true,
        myApplyList: [],
        vocationType: [],
        onFetching: false,
        page: 1,
        pageSize: 10
      }
    },
    mounted() {
        if (window.localStorage.getItem('applyCheckStatus') === '16') {
        this.selectedOne = false;
        this.selectedTwo = false;
        this.selectedThree = true;
      } else if (window.localStorage.getItem('applyCheckStatus') === '4') {
        this.selectedOne = false;
        this.selectedTwo = true;
        this.selectedThree = false;
      } else {
        this.selectedOne = true;
        this.selectedTwo = false;
        this.selectedThree = false;
      }
      this.myApplyList = [];
      this.checkStatus = window.localStorage.getItem('applyCheckStatus');
      this.getList(this.checkStatus, 1);
      console.log(location.href);
      vocationAll().then(response => {
        if (response.data.success) {
          this.vocationType = response.data.rows.map(function (item, index) {
            item.status = false;
            return item;
          });
        }
      }).catch(error => {
        closeLoading(this);
      })
    },
    methods: {
      screen() {
        this.showModel = true;
      },
      onItemClick(index) {
        startLoading(this);
        switch (index) {
          case 0:
            this.checkStatus = "2";
            this.getList(this.checkStatus, 1);
            break;
          case 1:
            this.checkStatus = "4";
            this.getList(this.checkStatus, 1);
            break;
          case 2:
            this.checkStatus = "16";
            this.getList(this.checkStatus, 1);
            break;
          default:
            break;
        }
        window.localStorage.setItem('applyCheckStatus', this.checkStatus);
      },
      getList(checkCode, page, done) {
        //权限数据状态 fStatus (0我参与的,1我待批的，2已审批的，4我的申请)
        console.log(checkCode);
        myApplyQuery({
          page: page,
          pageSize: 10,
          fStatus: "4",
          fMultiCheckStatus: checkCode
        }).then(response => {
          if (response.data && response.data.rows) {
            this.myApplyList = response.data.rows || [];
            //延缓loading图标隐藏的时间
            setTimeout(() => {
              done && done()
            }, 2000);
            if (response.data.rows.length <= response.data.total) {
              this.onFetching = true;
            }
            closeLoading(this);
          }
        }).catch(error => {
          closeLoading(this);
        })
      },
      goDetail(item) {
        console.log(JSON.stringify(item));
        if (item.fClassTypeId === "190000001") {//异常申请
          this.$router.push({
            name: 'exceptionApply',
            params: {'fStatus': "4", 'id': this.checkStatus, 'exceptionApply': item}
          });
        } else if (item.fClassTypeId === "190000002") {//出差外出申请
          this.$router.push({
            name: 'outApply',
            params: {'fStatus': "4", 'id': this.checkStatus, 'outApply': item}
          });
        } else {//vocation申请
          this.$router.push({
            name: 'vocationDetail',
            params: {'fStatus': "4", 'id': this.checkStatus, 'vocationApply': item}
          });
        }
      },
      cancelModel() {
        this.showModel = false;
        this.vocationType.forEach(function (data) {
          data.status = false;
        });
      },
      confirmModel() {
        this.cancelModel();
      },
      select(item, num) {
        if (item.status) {
          item.status = false;
        } else {
          item.status = true;
        }
        console.log(JSON.stringify(item) + num);
      },
      emptySelect() {
        this.vocationType.forEach(function (data) {
          data.status = false;
        });
        console.log(JSON.stringify(this.vocationType));
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
    },
  }

  //开
  function startLoading(_self) {
    _self.isLoadingData = true;
  }

  //关
  function closeLoading(_self) {
    _self.isLoadingData = false;
  }
</script>

<style type="text/scss" lang="scss" rel="stylesheet/scss">

  .vux-tab .vux-tab-item.vux-tab-selected {
    color: #0092DA !important;
    border-bottom: 3px solid #0092DA !important;
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

  .my-apply {
    .screen-img {
      position: fixed;
      z-index: 111;
      bottom: 30px;
      left: 50%;
      margin-left: -25px;
      width: 50px;
      height: 50px;
    }
    .my-apply-scroller {
      background: #F1F6F9;
      position: absolute;
      top: 52px;
      bottom: 0px;
      width: 100%;
      left: 0px;
    }
  }

  .apply-model {
    background-color: #F5F5F5;
    overflow-y: hidden !important;
    min-height: 55%;
    .weui-grid {
      padding: 15px;
      text-decoration: none;
      color: #999999;
    }
    .title {
      background-color: #FFFFFF;
      .model-head {
        &.weui-grid:before {
          border-right: none;
        }
      }
      .center {
        text-align: center
      }
      .right {
        text-align: right;
        color: #0092DA
      }
    }
    .scroll-left {
      background: #f8f8f8;
      top: 53px;
      width: 33.3% !important;

      .item {
        text-align: center;
        padding: 11px 0px;
        width: 100%;
        background: #FFFFFF;
      }
    }
    .scroll-right {
      left: 33.3%;
      height: 100%;
      top: 53px;
      background: #FFFFFF;
      width: 66.6% !important;
      position: absolute;

      .item {
        border-bottom: 1px solid #F6F6F6;
        .name {
          padding: 10px 20px;
          width: 50%;
        }
        .end-item-name {
          margin-bottom: 58px;
        }
        .select-img {
          padding: 10px 0px;
          width: 25%;
          text-align: right
        }
      }
      .end-item {
        border-bottom: none;
      }
    }
  }
</style>
