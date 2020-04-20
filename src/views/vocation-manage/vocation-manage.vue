<template>
  <div class="vocation-manage">
    <base-loading v-if="showLoading"></base-loading>

    <scroller>
      <vocation-list>
        <vocation-item v-for="(item, index) in vocationManageList" :key="index" :item="item">
          <!--@click.native="$router.push('/vocationRecord/'+ item.vocationType)"-->
        </vocation-item>
      </vocation-list>
    </scroller>

    <img @click="add()" width="50px" height="50px" class="add-img" src="../../assets/images/vocation-manage/add@3.png">
  </div>
</template>

<script>
  import baseLoading from 'components/base-loading.vue';
  import vocationList from 'components/vocation-manage/vocation-list.vue';
  import vocationItem from 'components/vocation-manage/vocation-item.vue';
  import {
    vocationQuery
  } from '@/api/vocation'
  import axios from 'axios'

  export default {
    name: 'vocationManage',
    components: {
      baseLoading,
      vocationList,
      vocationItem
    },
    data() {
      return {
        showLoading: true,
        vocationManageList: [],
      }
    },
    methods: {
      add() {
        this.$router.push('/vocationInfo');
      },
      lookDetail(item){
        this.$router.push({
          name: 'vocationRecord',
          params: {'leaveType': item.leaveType}
        });
      }
    },
    mounted() {
      let _this = this;
      vocationQuery({
        emplNbr: '12229'
      }).then(response => {
        _this.showLoading = false;
        _this.vocationManageList = response.data.rows.map(function (item, index) {
          let imgIcon = "4";
          if (item.leaveName === "病假") {
            imgIcon = "1";
          } else if (item.leaveName === "顺延年假" || item.leaveName === "法定年假" || item.leaveName === "公司年假") {
            imgIcon = "2";
          } else if (item.leaveName === "事假") {
            imgIcon = "3";
          }
          item.img = require("../../assets/images/vocation-manage/" + imgIcon + ".png");
          return item;
        });
        // 去掉外出 出差 年假类型
        for (let i = _this.vocationManageList.length - 1; i >= 0; i--) {
          if (_this.vocationManageList[i].leaveName !== '年假') {
            _this.vocationManageList.splice(i, 1);
          }
        }
      }).catch(error => {
        _this.showLoading = false;
        console.log(error);
      });

    }
  }
</script>

<style type="text/scss" lang="scss" rel="stylesheet/scss">
  .vocation-manage {
    .add-img {
      position: fixed;
      z-index: 111;
      bottom: 50px;
      left: 50%;
      margin-left: -25px;
    }
  }
</style>
